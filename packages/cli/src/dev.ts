import chokidar from 'chokidar';
import getPort from 'get-port';
import { Miniflare } from 'miniflare';
import ora from 'ora';
import * as path from 'path';

import { buildScriptFromManifest } from './build';
import { getDefaultManifestPath, resolveFile, resolveIntegrationManifestPath } from './manifest';
import { getAPIClient } from './remote';
import { createDevTunnel } from './tunnel';

const spinner = ora({ color: 'blue' });

/**
 * Start the integrations dev server on a random available port.
 * The dev server will automatically reload changes to the integration script.
 */
export async function startIntegrationsDevServer(
    options: {
        all?: boolean;
    } = {},
) {
    const { all = false } = options;

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
    await api.integrations.setIntegrationDevelopmentMode(manifest.name, { tunnelUrl, all });

    spinner.succeed(`Dev server started on ${port} 🔥`);
    spinner.info(
        `Integration events${all ? ` originating from the organization ${manifest.organization}` : ''} will be dispatched to your locally running version of the integration.`,
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
            api.integrations.disableIntegrationDevelopmentMode(manifest.name),
        ]);
        process.exit(0);
    });
}
