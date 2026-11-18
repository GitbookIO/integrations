import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { withEnvironment } from './environments';
import { resolveIntegrationManifestPath } from './manifest';
import { prepareIntegrationPublish } from './publish';

const [target, destination, packageName] = process.argv.slice(2);
if (!destination || (target !== 'production' && target !== 'staging')) {
    throw new Error('Usage: prepare-ci-publish <production|staging> <destination> [package]');
}
if (target === 'production' && !packageName) {
    throw new Error('Production publishes one integration package');
}

const directory = 'integrations';
const npmScript = target === 'production' ? 'publish-integrations' : 'publish-integrations-staging';
await mkdir(destination, { recursive: true });
const names = new Set<string>();

for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const integrationDirectory = join(directory, entry.name);
    const pkg = JSON.parse(await readFile(join(integrationDirectory, 'package.json'), 'utf8'));
    if (packageName && pkg.name !== packageName) continue;

    const command = pkg.scripts?.[npmScript];
    if (!command) continue;

    // Honor the environment selected by each existing package's publish script.
    const match = /^(?:dotenv )?gitbook publish \.(?: --env ([a-z0-9-]+))?$/.exec(command);
    if (!match) throw new Error(`Unsupported publish command for ${pkg.name}`);

    await withEnvironment(match[1], async () => {
        const manifest = await resolveIntegrationManifestPath(integrationDirectory);
        const request = await prepareIntegrationPublish(manifest, { resolveSecrets: false });
        if (names.has(request.name)) throw new Error(`Duplicate integration: ${request.name}`);
        names.add(request.name);
        await writeFile(join(destination, `${request.name}.json`), JSON.stringify(request), {
            flag: 'wx',
        });
    });
}

if (!names.size || (target === 'production' && names.size !== 1)) {
    throw new Error(`Unexpected number of integrations prepared for ${target}: ${names.size}`);
}
