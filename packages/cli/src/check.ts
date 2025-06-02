import { Miniflare } from 'miniflare';

import { buildScriptFromManifest } from './build';
import { getMiniflareOptions } from './dev';
import { withEnvironment } from './environments';

/**
 * Check that an integration can build correctly without publishing it.
 */
export async function checkIntegrationBuild(manifestSpecPath: string) {
    // We use a special env "test" to make it easy to configure the integration for testing.
    return withEnvironment('test', async () => {
        const { path: scriptPath } = await buildScriptFromManifest(manifestSpecPath, {
            mode: 'development',
        });

        const mf = new Miniflare(getMiniflareOptions(scriptPath));
        await mf.ready;

        await mf.dispose();
    });
}
