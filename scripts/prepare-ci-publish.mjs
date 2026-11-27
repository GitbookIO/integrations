import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { buildScriptFromManifest } from '../packages/cli/src/build';
import { withEnvironment } from '../packages/cli/src/environments';
import { getReleaseEntries } from './integration-release.mjs';

const [target, destination] = process.argv.slice(2);
const entries = await getReleaseEntries(target, process.env.GITHUB_REF, process.env.GITHUB_SHA);
await mkdir(destination, { recursive: true });
for (const [file, { identity, manifestPath }] of entries) {
    await withEnvironment(identity.environment, async () => {
        const { script } = await buildScriptFromManifest(manifestPath, {
            mode: 'production',
            resolveSecrets: false,
        });
        await writeFile(join(destination, file), JSON.stringify({ identity, script }), {
            flag: 'wx',
        });
    });
}
