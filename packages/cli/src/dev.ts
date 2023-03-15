import chokidar from 'chokidar';
import { Miniflare } from 'miniflare';
import path from 'path';

import { buildScriptFromManifest } from './build';
import { getDefaultManifestPath, resolveFile, resolveIntegrationManifestPath } from './manifest';

export const GITBOOK_DEV_SERVER_PORT = 8787;

export async function startIntegrationsDevServer(port: number = GITBOOK_DEV_SERVER_PORT) {
    const manifestSpecPath = await resolveIntegrationManifestPath(getDefaultManifestPath());
    const { path: scriptPath, manifest } = await buildScriptFromManifest(manifestSpecPath);

    /**
     * Start the miniflare dev server. It will automatically reload the script
     * when it detects a change (watch: true)
     */
    const mf = new Miniflare({
        scriptPath,
        port,
        liveReload: true,
        watch: true,
    });

    await mf.startServer();
    console.log('Integrations dev server started on:', port);

    /**
     * Watch the directory of the script file for changes. When a change is
     * detected, rebuild the script and miniflare will automatically reload it in the dev server.
     */
    chokidar
        .watch(path.dirname(resolveFile(manifestSpecPath, manifest.script)), {
            ignoreInitial: true,
        })
        .on('all', async () => {
            const p1 = performance.now();
            console.log('🛠 Rebuilding...');
            await buildScriptFromManifest(manifestSpecPath);
            console.log(`\n📦 Rebuilt in ${((performance.now() - p1) / 1000).toFixed(2)}s`);
        });
}
