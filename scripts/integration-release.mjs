import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { isDeepStrictEqual } from 'node:util';

export async function getReleaseEntries(target, ref, sha, root = 'integrations') {
    if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error('Missing release commit');
    const prod = target === 'production';
    const packageName =
        /^refs\/tags\/(@gitbook\/integration-[a-z0-9.-]+)@[0-9]+\.[0-9]+\.[0-9]+$/.exec(ref)?.[1];
    if (prod ? !packageName : target !== 'staging' || ref !== 'refs/heads/main') {
        throw new Error(`Unexpected ref for ${target}`);
    }

    const entries = new Map();
    const names = new Set();
    for (const dir of await readdir(root, { withFileTypes: true })) {
        if (!dir.isDirectory()) continue;
        const folder = join(root, dir.name);
        const pkg = JSON.parse(await readFile(join(folder, 'package.json'), 'utf8'));
        if (prod && pkg.name !== packageName) continue;
        const command =
            pkg.scripts?.[prod ? 'publish-integrations' : 'publish-integrations-staging'];
        if (!command) continue;
        const match = /^(?:dotenv )?gitbook publish \.(?: --env ([a-z0-9-]+))?$/.exec(command);
        if (!match) throw new Error(`Unsupported publish command for ${pkg.name}`);
        const environment = match[1] ?? 'default';
        const manifestPath = join(folder, 'gitbook-manifest.yaml');
        const base = Bun.YAML.parse(await readFile(manifestPath, 'utf8'));
        const manifest = { ...base };
        const overrides = base.envs?.[environment] ?? {};
        for (const key of ['organization', 'visibility', 'secrets']) {
            if (Object.hasOwn(overrides, key)) manifest[key] = overrides[key];
        }
        if (
            typeof manifest.name !== 'string' ||
            !/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(manifest.name) ||
            typeof manifest.script !== 'string'
        ) {
            throw new Error(`Invalid manifest for ${pkg.name}`);
        }
        const file = dir.name + '.json';
        if (names.has(manifest.name)) {
            throw new Error(`Duplicate release target ${manifest.name}`);
        }
        names.add(manifest.name);
        entries.set(file, {
            manifest,
            manifestPath,
            identity: {
                sha,
                ref,
                target,
                environment,
                packageName: pkg.name,
                name: manifest.name,
                entry: manifest.script,
            },
        });
    }
    if (!entries.size || (prod && entries.size !== 1))
        throw new Error(`Unexpected package count for ${target}`);
    return entries;
}

export async function loadReleaseScripts(entries, directory) {
    const files = await readdir(directory, { withFileTypes: true });
    if (files.length !== entries.size) throw new Error('Incomplete release artifact set');
    const scripts = new Map();
    for (const file of files) {
        const expected = entries.get(file.name);
        if (!expected || !file.isFile()) throw new Error('Unexpected release artifact');
        const artifact = JSON.parse(await readFile(join(directory, file.name), 'utf8'));
        if (
            !isDeepStrictEqual(artifact.identity, expected.identity) ||
            Object.keys(artifact).length !== 2 ||
            typeof artifact.script !== 'string' ||
            !artifact.script.length
        ) {
            throw new Error(`Invalid release artifact for ${expected.identity.packageName}`);
        }
        scripts.set(file.name, artifact.script);
    }
    return scripts;
}
