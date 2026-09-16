import { describe, expect, it, mock } from 'bun:test';

// The gitbook CLI bundles *.raw.js imports as text (see packages/cli/src/build.ts),
// bun test does not, so provide the file content as module mock.
const rawScript = await Bun.file(new URL('../src/script.raw.js', import.meta.url)).text();
mock.module('../src/script.raw.js', () => ({ default: rawScript }));

const { handleFetchEvent, resolveConfigUrl } = await import('../src/index');

const BASE = 'https://cdn.gravito.net/cmpconfigs/';

describe('resolveConfigUrl', () => {
    it('decodes a base64 token into the config URL', () => {
        expect(resolveConfigUrl(btoa('customer-1/config-2/'))).toBe(
            `${BASE}customer-1/config-2/config.json`,
        );
    });

    it('adds the trailing slash and trims whitespace', () => {
        expect(resolveConfigUrl(`  ${btoa('customer-1/config-2')} `)).toBe(
            `${BASE}customer-1/config-2/config.json`,
        );
    });

    it('accepts an already decoded path when it is not base64', () => {
        expect(resolveConfigUrl('customer-1/config-2/')).toBe(
            `${BASE}customer-1/config-2/config.json`,
        );
    });

    it('rejects base64 typos instead of using them as a path', () => {
        expect(resolveConfigUrl('test')).toBeUndefined();
        expect(resolveConfigUrl('abcd')).toBeUndefined();
    });

    it('rejects decoded paths with unexpected characters', () => {
        expect(resolveConfigUrl(btoa('a+b/c/'))).toBeUndefined();
        expect(resolveConfigUrl(btoa('cust omer/cfg/'))).toBeUndefined();
        expect(resolveConfigUrl(btoa('a/b?x=1'))).toBeUndefined();
        expect(resolveConfigUrl(btoa('https://evil.com/'))).toBeUndefined();
    });

    it('rejects path traversal', () => {
        expect(resolveConfigUrl(btoa('../etc/'))).toBeUndefined();
        expect(resolveConfigUrl(btoa('a/../b/'))).toBeUndefined();
    });

    it('rejects empty and invalid input', () => {
        expect(resolveConfigUrl('')).toBeUndefined();
        expect(resolveConfigUrl('   ')).toBeUndefined();
        expect(resolveConfigUrl('!!!')).toBeUndefined();
    });
});

describe('fetch_published_script', () => {
    async function generateScript(configuration: Record<string, unknown>) {
        return handleFetchEvent(
            {} as any,
            { environment: { siteInstallation: { configuration } } } as any,
        ) as Promise<Response | undefined>;
    }

    it('injects the resolved config URL into the script', async () => {
        const response = await generateScript({ config_token: btoa('customer-1/config-2/') });
        expect(response).toBeDefined();
        const script = await response!.text();
        expect(script).toContain(`'${BASE}customer-1/config-2/config.json'`);
        expect(script).not.toContain('<CONFIG_URL>');
        expect(response!.headers.get('Content-Type')).toBe('application/javascript');
    });

    it('returns nothing when the token is missing or invalid', async () => {
        expect(await generateScript({})).toBeUndefined();
        expect(await generateScript({ config_token: 'test' })).toBeUndefined();
    });
});
