import { afterEach, beforeEach, expect, test } from 'bun:test';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { getReleaseEntries, loadReleaseScripts } from '../../../scripts/integration-release.mjs';

const sha = 'a'.repeat(40);
let root, artifacts, entries;
beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), 'integration-release-'));
    const integrations = join(root, 'integrations');
    artifacts = join(root, 'artifacts');
    await mkdir(artifacts);
    for (const [folder, name] of [
        ['azure', 'VA-Azure'],
        ['slack', 'slack'],
    ]) {
        const dir = join(integrations, folder);
        await mkdir(dir, { recursive: true });
        await writeFile(
            join(dir, 'package.json'),
            JSON.stringify({
                name: '@gitbook/integration-' + folder,
                scripts: {
                    'publish-integrations': 'gitbook publish . --env prod',
                    'publish-integrations-staging': 'gitbook publish . --env staging',
                },
            }),
        );
        await writeFile(
            join(dir, 'gitbook-manifest.yaml'),
            JSON.stringify({
                name,
                script: './src/index.ts',
                secrets: { key: 'default' },
                envs: {
                    staging: { secrets: { key: 'staging' } },
                    prod: { secrets: { key: 'production' } },
                },
            }),
        );
    }
    entries = await getReleaseEntries('staging', 'refs/heads/main', sha, integrations);
    for (const [file, { identity }] of entries)
        await writeFile(
            join(artifacts, file),
            JSON.stringify({ identity, script: 'export default {}' }),
        );
});
afterEach(async () => {
    await rm(root, { recursive: true, force: true });
});

test('selects the reviewed package, manifest case and production secret mapping from the tag', async () => {
    const targets = await getReleaseEntries(
        'production',
        'refs/tags/@gitbook/integration-azure@1.2.3',
        sha,
        join(root, 'integrations'),
    );
    expect([...targets.keys()]).toEqual(['azure.json']);
    expect(targets.get('azure.json').manifest).toMatchObject({
        name: 'VA-Azure',
        secrets: { key: 'production' },
    });
    expect((await loadReleaseScripts(entries, artifacts)).size).toBe(2);
});

test('refuses an artifact containing its own credentials or destination metadata', async () => {
    const { identity } = entries.get('azure.json');
    await writeFile(
        join(artifacts, 'azure.json'),
        JSON.stringify({ identity, script: 'code', secrets: { key: 'wrong' } }),
    );
    await expect(loadReleaseScripts(entries, artifacts)).rejects.toThrow(
        'Invalid release artifact',
    );
});

test('refuses swapped package artifacts even when the file count matches', async () => {
    await writeFile(
        join(artifacts, 'azure.json'),
        JSON.stringify({ identity: entries.get('slack.json').identity, script: 'code' }),
    );
    await expect(loadReleaseScripts(entries, artifacts)).rejects.toThrow(
        'Invalid release artifact',
    );
});

test('refuses missing or extra files', async () => {
    await writeFile(join(artifacts, 'extra.json'), '{}');
    await expect(loadReleaseScripts(entries, artifacts)).rejects.toThrow(
        'Incomplete release artifact set',
    );
    await rm(join(artifacts, 'extra.json'));
    await rm(join(artifacts, 'azure.json'));
    await expect(loadReleaseScripts(entries, artifacts)).rejects.toThrow(
        'Incomplete release artifact set',
    );
});
