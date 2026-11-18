import { execFileSync } from 'node:child_process';
import { createPublishBody } from '../packages/cli/src/publish-body';
import { getReleaseEntries, loadReleaseScripts } from './integration-release.mjs';

const [target, directory, mode] = process.argv.slice(2);
const destinations = {
    production: { endpoint: 'https://api.gitbook.com', organization: 'gitbook' },
    staging: { endpoint: 'https://api.gitbook-staging.com', organization: 'gitbookio' },
};
if (!Object.hasOwn(destinations, target) || !directory || (mode && mode !== '--check')) {
    throw new Error('Usage: publish-prepared-integrations <production|staging> <directory>');
}

const { endpoint, organization } = destinations[target];
const entries = await getReleaseEntries(target, process.env.GITHUB_REF, process.env.GITHUB_SHA);
const scripts = await loadReleaseScripts(entries, directory);
if (mode === '--check') {
    console.log(`Validated ${scripts.size} integration scripts for ${target}`);
    process.exit(0);
}
for (const [file, { identity, manifestPath, manifest }] of entries) {
    const name = identity.name;
    const body = await createPublishBody(manifestPath, manifest, scripts.get(file));

    if (body.secrets !== undefined) {
        if (!body.secrets || typeof body.secrets !== 'object' || Array.isArray(body.secrets)) {
            throw new Error(`Invalid secret references for ${name}`);
        }
        body.secrets = Object.fromEntries(
            Object.entries(body.secrets).map(([key, value]) => {
                if (typeof value !== 'string') {
                    throw new Error(`Invalid secret reference for ${name}`);
                }
                const resolved = value.replace(
                    /\$\{\{\s*(?:env\.([A-Z0-9_]+)|"(op:\/\/[^"\s]+)"|(op:\/\/[^\s}]+))\s*\}\}/g,
                    (_, variable, quotedRef, bareRef) => {
                        if (variable) {
                            const secret = process.env[`PUBLISH_SECRET_${variable}`];
                            if (!secret)
                                throw new Error(`Missing publish secret ${variable} for ${name}`);
                            return secret;
                        }
                        const ref = quotedRef ?? bareRef;
                        if (!ref.startsWith('op://gitbook-integrations/')) {
                            throw new Error(`Invalid 1Password vault for ${name}`);
                        }
                        try {
                            return execFileSync('op', ['read', '--no-newline', ref], {
                                encoding: 'utf8',
                                stdio: ['ignore', 'pipe', 'pipe'],
                                env: {
                                    PATH: process.env.PATH,
                                    OP_SERVICE_ACCOUNT_TOKEN: process.env.OP_SERVICE_ACCOUNT_TOKEN,
                                },
                            });
                        } catch {
                            throw new Error(`Could not resolve a 1Password secret for ${name}`);
                        }
                    },
                );
                return [key, resolved];
            }),
        );
    }

    const url = new URL(process.env.ACTIONS_ID_TOKEN_REQUEST_URL);
    url.searchParams.set('audience', endpoint);
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN}` },
        redirect: 'error',
    });
    if (!response.ok) throw new Error(`GitHub OIDC request failed with HTTP ${response.status}`);
    const { value: token } = await response.json();
    if (typeof token !== 'string' || !token) throw new Error('GitHub OIDC response has no token');
    console.log(`::add-mask::${token}`);

    const publish = await fetch(`${endpoint}/v1/integrations/${encodeURIComponent(name)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, organization }),
        redirect: 'error',
    });
    if (!publish.ok) throw new Error(`Publishing ${name} failed with HTTP ${publish.status}`);
    console.log(`Published ${name}`);
}
