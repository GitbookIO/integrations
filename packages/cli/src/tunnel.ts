import { spawn } from 'child_process';

export interface DevTunnel {
    tunnelUrl: string;
    close(): void;
}

/**
 * Create a tunnel using `cloudflared` mapped to `localhost:{port}`
 */
export function createDevTunnel(port: number, cloudflaredPath: string): Promise<DevTunnel> {
    return new Promise((resolve, reject) => {
        let tunnelUrl: string;
        let connectionsCount = 0;
        let resolved = false;
        const cloudflared = spawn(cloudflaredPath, [
            'tunnel',
            '--no-autoupdate',
            '--url',
            `http://localhost:${port}`,
        ]);

        const close = () => {
            if (cloudflared.exitCode === null && !cloudflared.killed) {
                cloudflared.kill('SIGTERM');
            }
        };

        const resolveWhenReady = () => {
            if (resolved || !tunnelUrl || connectionsCount < 1) {
                return;
            }

            resolved = true;
            resolve({
                tunnelUrl,
                close,
            });
        };

        cloudflared.stderr.on('data', (data) => {
            const output = data.toString();

            // Store the tunnel URL provided by cloudflare
            const tunnelUrlOutput = output.match(/https:\/\/.*\.trycloudflare\.com/);
            if (tunnelUrlOutput) {
                tunnelUrl = tunnelUrlOutput[0];
            }

            // Count the number of connections to the tunnel
            // We need at least 1 connection to be able to use the tunnel
            const tunnelConnectionOutput = output.match(/Registered tunnel/);
            if (tunnelConnectionOutput) {
                connectionsCount++;
            }

            resolveWhenReady();
        });

        cloudflared.on('close', (code) => {
            if (!resolved && code !== 0) {
                reject(new Error(`cloudflared exited with code ${code}`));
            }
        });

        cloudflared.on('error', (error) => {
            if (!resolved) {
                reject(error);
            }
        });
    });
}
