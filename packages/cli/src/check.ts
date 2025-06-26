import { Miniflare } from 'miniflare';

import { buildScriptFromManifest } from './build';
import { getMiniflareOptions } from './dev';

/**
 * Check that an integration can build correctly without publishing it.
 */
export async function checkIntegrationBuild(manifestSpecPath: string) {
    const { path: scriptPath } = await buildScriptFromManifest(manifestSpecPath, {
        mode: 'development',
    });

    const mf = new Miniflare(getMiniflareOptions(scriptPath));
    await mf.ready;

    await mf.dispose();
}
