import { spawn } from 'child_process';
import * as path from 'path';

/**
 * Create a tunnel using `cloudflared` mapped to `localhost:{port}`
 */
export function createDevTunnel(port: number): Promise<string> {
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
            if (code !== 0) {
                throw new Error(`cloudflared exited with code ${code}`);
            }
        });
    });
}
