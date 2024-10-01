import Ajv, { Schema } from 'ajv';
import addFormats from 'ajv-formats';
import chokidar from 'chokidar';
import * as fs from 'fs';
import getPort from 'get-port';
import * as yaml from 'js-yaml';
import { Miniflare } from 'miniflare';
import ora from 'ora';
import * as path from 'path';

import { buildScriptFromManifest } from './build';
import { prettyPath } from './files';
import { getDefaultManifestPath, resolveFile, resolveIntegrationManifestPath } from './manifest';
import { getAPIClient } from './remote';
import { createDevTunnel } from './tunnel';

export const GITBOOK_DEV_CONFIG_FILE = '.gitbook-dev.yaml';

const spinner = ora({ color: 'blue' });

/**
 * Start the integrations dev server on a random available port.
 * The dev server will automatically reload changes to the integration script.
 */
export async function startIntegrationsDevServer(space: string | undefined) {
    spinner.start('Starting dev server...\n');
    const port = await getPort();
    /**
     * Read the integration manifest and build the integration script so that
     * it can be served by the dev server.
     */
    const manifestSpecPath = await resolveIntegrationManifestPath(getDefaultManifestPath());
    const { path: scriptPath, manifest } = await buildScriptFromManifest(manifestSpecPath, {
        mode: 'development',
    });

    /**
     * Also, read the dev config file to get the space to use for the dev server.
     * If a space is provided as an argument, it will override the space in the dev config file.
     */
    const devConfigPath = resolveFile(manifestSpecPath, GITBOOK_DEV_CONFIG_FILE);
    if (space) {
        await writeDevConfig(devConfigPath, { space });
    }
    const devConfig = await readDevConfig(devConfigPath);

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
    });
    await mf.ready;

    /**
     * Add the tunnel to the integration for the dev space events in the GitBook platform
     */
    const api = await getAPIClient(true);
    await api.integrations.updateIntegrationDevSpace(manifest.name, devConfig.space, {
        tunnelUrl,
    });

    spinner.succeed(`Dev server started on ${port} 🔥`);
    spinner.info(
        `Integration events originating from space (${devConfig.space}) will be dispatched to your locally running version of the integration.`,
    );

    /**
     * Additionally, watch the directory of the script file for changes. When a change is
     * detected, rebuild the script and miniflare will automatically reload it in the dev server.
     */
    const watcher = chokidar
        .watch(path.dirname(resolveFile(manifestSpecPath, manifest.script)), {
            ignoreInitial: true,
        })
        .on('all', async () => {
            const p1 = performance.now();
            console.log('🛠 Detected changes, rebuilding...');
            try {
                await buildScriptFromManifest(manifestSpecPath, { mode: 'development' });
                await mf.setOptions({ scriptPath });
                console.log(`📦 Rebuilt in ${((performance.now() - p1) / 1000).toFixed(2)}s`);
            } catch (error) {
                console.log(error);
            }
        });

    /**
     * Remove the tunnel from GitBook platform when the process is being
     * killed (e.g. Ctrl/CMD+C)
     */
    process.on('SIGINT', async () => {
        spinner.start('Exiting...\n');
        await Promise.all([
            watcher.close(),
            api.integrations.removeIntegrationDevSpace(manifest.name, devConfig.space),
        ]);
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
    } catch (error) {
        throw new Error(
            `Failed to read dev config from ${prettyPath(configFilePath)}: ${(error as Error).message}`,
        );
    }
}

/**
 * Write the dev config file to the given path.
 */
async function writeDevConfig(configFilePath: string, config: GitBookDevConfig): Promise<void> {
    try {
        const normalized = await validateDevConfig(config);
        const configContent = yaml.dump(normalized);
        await fs.promises.writeFile(configFilePath, configContent, 'utf8');
    } catch (error) {
        throw new Error(
            `Failed to write dev config to ${prettyPath(configFilePath)}: ${(error as Error).message}`,
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
