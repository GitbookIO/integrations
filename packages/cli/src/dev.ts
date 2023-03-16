import { spawn } from 'child_process';
import chokidar from 'chokidar';
import { Miniflare } from 'miniflare';
import path from 'path';

import { buildScriptFromManifest } from './build';
import { getDefaultManifestPath, resolveFile, resolveIntegrationManifestPath } from './manifest';

export const GITBOOK_DEV_SERVER_PORT = 8787;

export async function startIntegrationsDevServer(port: number = GITBOOK_DEV_SERVER_PORT) {
    /**
     * Create a tunnel to the dev server
     */
    const tunnelUrl = await createDevTunnel(port);

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
    console.log('Tunnel URL:', tunnelUrl);

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

function createDevTunnel(port: number): Promise<string> {
    return new Promise((resolve, reject) => {
        let tunnelUrl: string;
        let connectionsCount = 0;
        const cloudflared = spawn(path.join(__dirname, 'cloudflared'), [
            'tunnel',
            '--url',
            `http://localhost:${port}`,
        ]);

        cloudflared.stderr.on('data', (data) => {
            const output = data.toString();

            // Store the tunnel URL provided by cloudflare
            const tunnelUrlOutput = output.match(/https:\/\/.*\.trycloudflare\.com/);
            if (tunnelUrlOutput) {
                tunnelUrl = tunnelUrlOutput[0];
            }

            // Count the number of connections to the tunnel
            // We need at least 4 connections to be able to use the tunnel
            const tunnelConnectionOutput = output.match(/Connection .+ registered/);
            if (tunnelConnectionOutput) {
                connectionsCount++;
            }

            if (connectionsCount >= 4) {
                resolve(tunnelUrl);
            }
        });

        cloudflared.on('close', (code) => {
            throw new Error(`cloudflared exited with code ${code}`);
        });
    });
}
