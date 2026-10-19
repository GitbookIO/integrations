import { afterEach, describe, expect, it, mock } from 'bun:test';

import { getFeatureFlags } from '../src/schema';

const originalFetch = globalThis.fetch;

/**
 * Mock the LaunchDarkly "List feature flags" endpoint. With REST API version 20240415, it returns
 * the flags in pages of 20 by default and at most 100. A new access token uses version 20240415
 * when the request does not set the `LD-API-Version` header.
 */
function mockListFeatureFlags(flags: Array<{ key: string }>) {
    const requests: Request[] = [];
    globalThis.fetch = mock(async (input: RequestInfo | URL, init?: RequestInit) => {
        const request = new Request(input, init);
        requests.push(request);
        const url = new URL(request.url);
        const limit = Math.min(Number(url.searchParams.get('limit') ?? 20), 100);
        const offset = Number(url.searchParams.get('offset') ?? 0);
        return Response.json({
            items: flags.slice(offset, offset + limit),
            totalCount: flags.length,
        });
    }) as unknown as typeof fetch;
    return requests;
}

afterEach(() => {
    globalThis.fetch = originalFetch;
});

describe('getFeatureFlags', () => {
    it('returns all the flags of a project, not only the first page', async () => {
        const flags = Array.from({ length: 250 }, (_, i) => ({
            key: `flag-${i}`,
            name: `Flag ${i}`,
            kind: 'boolean',
            variations: [{ value: true }, { value: false }],
        }));
        const requests = mockListFeatureFlags(flags);

        const result = await getFeatureFlags({ projectKey: 'demo', serviceToken: 'api-token' });

        expect(result).toEqual(flags as any);
        for (const request of requests) {
            expect(new URL(request.url).pathname).toBe('/api/v2/flags/demo');
            expect(request.headers.get('Authorization')).toBe('api-token');
            expect(request.headers.get('LD-API-Version')).toBe('20240415');
        }
    });

    it('returns no flags for an empty project', async () => {
        const requests = mockListFeatureFlags([]);

        const result = await getFeatureFlags({ projectKey: 'demo', serviceToken: 'api-token' });

        expect(result).toEqual([]);
        expect(requests).toHaveLength(1);
    });

    it('throws when LaunchDarkly returns an error', async () => {
        globalThis.fetch = mock(
            async () => new Response(null, { status: 401, statusText: 'Unauthorized' }),
        ) as unknown as typeof fetch;

        await expect(
            getFeatureFlags({ projectKey: 'demo', serviceToken: 'api-token' }),
        ).rejects.toThrow('(401) Failed to fetch feature flags: Unauthorized');
    });
});
