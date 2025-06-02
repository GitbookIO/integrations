import { Miniflare } from 'miniflare';

import { buildScriptFromManifest } from './build';
import { getDefaultManifestPath, resolveIntegrationManifestPath } from './manifest';
import { getMiniflareOptions } from './dev';

/**
 * Check that an integration can build correctly without publishing it.
 */
export async function checkIntegrationBuild() {
    const manifestSpecPath = await resolveIntegrationManifestPath(getDefaultManifestPath());
    const { path: scriptPath } = await buildScriptFromManifest(manifestSpecPath, {
        mode: 'development',
    });

    const mf = new Miniflare(getMiniflareOptions(scriptPath));
    await mf.ready;

    await mf.dispose();
}
