import * as path from 'path';

type EnsureCloudflaredInstalled = (
    onInstall?: () => void,
    onComplete?: () => void,
) => Promise<string>;

export async function ensureCloudflaredInstalled(
    onInstall?: () => void,
    onComplete?: () => void,
): Promise<string> {
    // This file is bundled into dist/cli.js, so resolve the helper from the
    // published package root at runtime rather than bundling it into the CLI.
    const installer = require(path.resolve(
        __dirname,
        '../installCloudflared.js',
    )) as EnsureCloudflaredInstalled;
    return installer(onInstall, onComplete);
}
