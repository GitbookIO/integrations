import { describe, expect, it, mock } from 'bun:test';

// The gitbook CLI bundles *.raw.js imports as text (see packages/cli/src/build.ts),
// bun test does not, so provide the file content as module mock.
const rawScript = await Bun.file(new URL('../src/script.raw.js', import.meta.url)).text();
mock.module('../src/script.raw.js', () => ({ default: rawScript }));

const { handleFetchEvent, normalizeSiteId } = await import('../src/index');

const MODULES = 'engage,auto,vitals,clicks,ask';

describe('normalizeSiteId', () => {
    it('accepts a valid site ID', () => {
        expect(normalizeSiteId('pa_Z6RY7F45OA')).toBe('pa_Z6RY7F45OA');
    });

    it('trims whitespace', () => {
        expect(normalizeSiteId('  pa_abc123 \n')).toBe('pa_abc123');
    });

    it('rejects values that could break out of the script', () => {
        expect(normalizeSiteId("pa_abc');alert(1);//")).toBeUndefined();
        expect(normalizeSiteId('pa_abc"><script>')).toBeUndefined();
        expect(normalizeSiteId('pa_abc def')).toBeUndefined();
        expect(normalizeSiteId('pa_abc-def')).toBeUndefined();
    });

    it('rejects missing, empty and wrong prefix values', () => {
        expect(normalizeSiteId(undefined)).toBeUndefined();
        expect(normalizeSiteId(42)).toBeUndefined();
        expect(normalizeSiteId('')).toBeUndefined();
        expect(normalizeSiteId('pa_')).toBeUndefined();
        expect(normalizeSiteId('abc123')).toBeUndefined();
        expect(normalizeSiteId('PA_abc123')).toBeUndefined();
    });
});

describe('fetch_published_script', () => {
    async function generateScript(configuration: Record<string, unknown>) {
        return handleFetchEvent(
            {} as any,
            { environment: { siteInstallation: { configuration } } } as any,
        ) as Promise<Response | undefined>;
    }

    it('injects the site ID and modules into the script', async () => {
        const response = await generateScript({ site_id: 'pa_abc123' });
        expect(response).toBeDefined();
        const script = await response!.text();
        expect(script).toContain("'pa_abc123'");
        expect(script).toContain(`'${MODULES}'`);
        expect(script).toContain('https://privatusstats.com/js/pa.js');
        expect(script).not.toContain('<SITE_ID>');
        expect(script).not.toContain('<MODULES>');
        expect(response!.headers.get('Content-Type')).toBe('application/javascript');
    });

    it('returns nothing when the site ID is missing or invalid', async () => {
        expect(await generateScript({})).toBeUndefined();
        expect(await generateScript({ site_id: 'not-a-site-id' })).toBeUndefined();
        expect(await generateScript({ site_id: "pa_x');alert(1)//" })).toBeUndefined();
    });
});
