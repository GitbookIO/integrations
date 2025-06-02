import chokidar from 'chokidar';
import getPort from 'get-port';
import { Log, LogLevel, Miniflare, MiniflareOptions } from 'miniflare';
import ora from 'ora';
import * as path from 'path';

import { buildScriptFromManifest } from './build';
import { resolveFile } from './manifest';
import { getAPIClient } from './remote';
import { createDevTunnel } from './tunnel';

/**
 * Get the global miniflare options for an integration.
 */
export function getMiniflareOptions(scriptPath: string): MiniflareOptions {
    return {
        scriptPath,
        modules: true,
        modulesRoot: path.dirname(scriptPath),
        compatibilityDate: '2025-05-25',
        compatibilityFlags: ['nodejs_compat'],
    };
}

/**
 * Start the integrations dev server on a random available port.
 * The dev server will automatically reload changes to the integration script.
 */
export async function startIntegrationsDevServer(
    manifestSpecPath: string,
    options: {
        all?: boolean;
    } = {},
) {
    const { all = false } = options;
    const spinner = ora({ color: 'blue' });

    /**
     * Read the integration manifest and build the integration script so that
     * it can be served by the dev server.
     */
    spinner.start('Building integration script...');
    const { path: scriptPath, manifest } = await buildScriptFromManifest(manifestSpecPath, {
        mode: 'development',
    });
    spinner.succeed(`Integration built`);

    spinner.start('Allocating local port...');
    const port = await getPort();
    spinner.succeed(`Local port ${port} allocated`);

    /**
     * Create a tunnel to allow the dev server to receive integration events
     * from the GitBook platform
     */
    spinner.start('Creating HTTPS tunnel...');
    const tunnelUrl = await createDevTunnel(port);
    spinner.succeed(`Tunnel created ${tunnelUrl}`);

    /**
     * Start the miniflare dev server. It will automatically reload the script
     * when it detects a change with watch mode
     */
    spinner.start('Starting dev server...');
    console.log(scriptPath);
    const miniflareOptions: MiniflareOptions = {
        ...getMiniflareOptions(scriptPath),
        port,
        verbose: true,
        log: new Log(LogLevel.DEBUG, {
            prefix: manifest.name,
        }),
    };
    const mf = new Miniflare(miniflareOptions);
    await mf.ready;
    spinner.succeed(`Dev server started`);

    /**
     * Add the tunnel to the integration for the dev space events in the GitBook platform
     */
    spinner.start(`Enabling development mode for ${manifest.name}...`);
    const api = await getAPIClient(true);
    await api.integrations.setIntegrationDevelopmentMode(manifest.name, { tunnelUrl, all });
    spinner.succeed(`Development mode enabled`);

    spinner.succeed(`Dev server 🔥`);
    spinner.info(
        `Integration events${all ? ` originating from the organization ${manifest.organization}` : ''} will be dispatched to your locally running version of the integration.`,
    );
    spinner.info(`Use the integration in the GitBook application and see the logs here.`);
    spinner.info(`The integration will be updated when code changes.`);
    spinner.info(`Press Ctrl/CMD+C to exit.`);

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
            spinner.start('🛠  Detected changes, rebuilding...');
            try {
                await buildScriptFromManifest(manifestSpecPath, { mode: 'development' });
                await mf.setOptions(miniflareOptions);
                spinner.succeed(`📦 Rebuilt in ${((performance.now() - p1) / 1000).toFixed(2)}s`);
            } catch (error) {
                spinner.fail((error as Error).message);
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
            api.integrations.disableIntegrationDevelopmentMode(manifest.name),
        ]);
        process.exit(0);
    });
}
