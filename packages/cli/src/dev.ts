import Ajv, { Schema } from 'ajv';
import addFormats from 'ajv-formats';
import chokidar from 'chokidar';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { Miniflare } from 'miniflare';
import ora from 'ora';
import * as path from 'path';

import { buildScriptFromManifest } from './build';
import { prettyPath } from './files';
import { getDefaultManifestPath, resolveFile, resolveIntegrationManifestPath } from './manifest';
import { getAPIClient } from './remote';
import { createDevTunnel } from './tunnel';

export const GITBOOK_DEV_SERVER_PORT = 8787;
export const GITBOOK_DEV_CONFIG_FILE = 'gitbook-dev.yaml';

const spinner = ora({ color: 'blue' });

export async function startIntegrationsDevServer(port: number = GITBOOK_DEV_SERVER_PORT) {
    spinner.start('Starting dev server...');
    const manifestSpecPath = await resolveIntegrationManifestPath(getDefaultManifestPath());
    const devConfigPath = resolveFile(manifestSpecPath, GITBOOK_DEV_CONFIG_FILE);
    const devConfig = await readDevConfig(devConfigPath);
    const { path: scriptPath, manifest } = await buildScriptFromManifest(manifestSpecPath);

    /**
     * Create a tunnel to allow the dev server to receive integration events
     * from the GitBook platform
     */
    const tunnelUrl = await createDevTunnel(port);

    /**
     * Start the miniflare dev server. It will automatically reload the script
     * when it detects a change with watch mode
     */
    const mf = new Miniflare({
        scriptPath,
        port,
        liveReload: true,
        watch: true,
    });
    await mf.startServer();

    /**
     * Add the tunnel to the integration for the dev space events in the GitBook platform
     */
    const api = await getAPIClient(true);
    const tunnel = await api.integrations.addIntegrationTunnelForSpace(manifest.name, {
        space: devConfig.space,
        url: tunnelUrl,
    });

    spinner.succeed(`Dev server started on ${port} 🔥`);

    /**
     * Additionally, watch the directory of the script file for changes. When a change is
     * detected, rebuild the script and miniflare will automatically reload it in the dev server.
     */
    chokidar
        .watch(path.dirname(resolveFile(manifestSpecPath, manifest.script)), {
            ignoreInitial: true,
        })
        .on('all', async () => {
            const p1 = performance.now();
            console.log('Detected changes, rebuilding...🛠');
            await buildScriptFromManifest(manifestSpecPath);
            console.log(`\n📦 Rebuilt in ${((performance.now() - p1) / 1000).toFixed(2)}s`);
        });

    /**
     * Remove the tunnel from GitBook platform when the process is being
     * killed (e.g. Ctrl/CMD+C)
     */
    process.on('SIGINT', async () => {
        spinner.start('\nExiting...');
        await api.integrations.removeIntegrationTunnelForSpace(manifest.name, tunnel.data.id);
        process.exit(0);
    });
}

//
// Dev config file for the integrations dev server.
//
interface GitBookDevConfig {
    space: string;
}

/**
 * Read the dev config file from at the given path.
 */
async function readDevConfig(configFilePath: string): Promise<GitBookDevConfig> {
    try {
        const content = await fs.promises.readFile(configFilePath, 'utf8');
        const doc = yaml.load(content);
        const config = await validateDevConfig(doc as object);

        return config;
    } catch (e) {
        throw new Error(
            `Failed to read dev config from ${prettyPath(configFilePath)}: ${e.message}`
        );
    }
}

/**
 * Validate the dev config file.
 */
async function validateDevConfig(data: object): Promise<GitBookDevConfig> {
    const ajv = new Ajv();
    addFormats(ajv);

    const schema: Schema = {
        type: 'object',
        properties: {
            space: {
                type: 'string',
            },
        },
        required: ['space'],
        additionalProperties: false,
    };

    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (!valid) {
        throw new Error(ajv.errorsText(validate.errors));
    }

    return data as GitBookDevConfig;
}