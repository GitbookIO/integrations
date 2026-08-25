import { describe, expect, it, mock } from 'bun:test';

// The gitbook CLI bundles *.raw.js imports as text (see packages/cli/src/build.ts),
// bun test does not, so provide the file content as module mock.
const rawScript = await Bun.file(new URL('../src/amplitudeScript.raw.js', import.meta.url)).text();
mock.module('../src/amplitudeScript.raw.js', () => ({ default: rawScript }));

const { handleFetchEvent } = await import('../src/index');

async function generateScript(configuration: Record<string, unknown>): Promise<string> {
    const response = (await handleFetchEvent(
        {} as any,
        {
            environment: {
                siteInstallation: {
                    configuration,
                },
            },
        } as any,
    )) as Response;
    return response.text();
}

describe('fetch_published_script', () => {
    it('should load the SDK from the US CDN by default', async () => {
        const script = await generateScript({ amplitude_api_key: 'fake-api-key' });
        expect(script).toContain("'cdn.amplitude.com'");
        expect(script).toContain("'fake-api-key'");
        expect(script).not.toContain('serverZone');
        expect(script).not.toContain('serverUrl');
    });

    it('should load the SDK from the EU CDN when the EU server region is selected', async () => {
        const script = await generateScript({
            amplitude_api_key: 'fake-api-key',
            server_region: 'EU',
        });
        expect(script).toContain("'cdn.eu.amplitude.com'");
        expect(script).toContain('"serverZone":"EU"');
    });

    it('should not pass on a server URL matching the default of the selected region', async () => {
        const usScript = await generateScript({
            amplitude_api_key: 'fake-api-key',
            server_url: 'https://api2.amplitude.com/2/httpapi',
        });
        expect(usScript).not.toContain('serverUrl');

        const euScript = await generateScript({
            amplitude_api_key: 'fake-api-key',
            server_region: 'EU',
            server_url: 'https://api.eu.amplitude.com/2/httpapi',
        });
        expect(euScript).not.toContain('serverUrl');

        const euScriptWithUsDefault = await generateScript({
            amplitude_api_key: 'fake-api-key',
            server_region: 'EU',
            server_url: 'https://api2.amplitude.com/2/httpapi',
        });
        expect(euScriptWithUsDefault).not.toContain('serverUrl');
    });

    it('should pass on a custom server URL in any region', async () => {
        const usScript = await generateScript({
            amplitude_api_key: 'fake-api-key',
            server_url: 'https://example.com/proxy/2/httpapi',
        });
        expect(usScript).toContain('"serverUrl":"https://example.com/proxy/2/httpapi"');

        const euScript = await generateScript({
            amplitude_api_key: 'fake-api-key',
            server_region: 'EU',
            server_url: 'https://example.com/proxy/2/httpapi',
        });
        expect(euScript).toContain('"serverUrl":"https://example.com/proxy/2/httpapi"');
        expect(euScript).toContain('"serverZone":"EU"');
    });
});
