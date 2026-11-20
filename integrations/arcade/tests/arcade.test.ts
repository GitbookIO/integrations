import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';

import { fetchArcadeOEmbedData as fetchDimensions } from '../src/arcade';
import integration from '../src/index';

const dimensions = { width: 1280, height: 720 };
const embed = { type: 'rich', title: 'Demo', ...dimensions };
const entries = new Map<string, Response>();
const tasks: Promise<unknown>[] = [];
const context = {
    waitUntil: (promise: Promise<unknown>) => {
        tasks.push(promise);
    },
};
const cache = {
    match: async (key: string) => entries.get(key)?.clone(),
    put: async (key: string, response: Response) => {
        entries.set(key, response.clone());
    },
};
const openCache = mock(async () => cache);
const originalCaches = Object.getOwnPropertyDescriptor(globalThis, 'caches');
const originalMode = Object.getOwnPropertyDescriptor(globalThis, 'MODE');

beforeEach(() => {
    openCache.mockClear();
    Object.defineProperty(globalThis, 'caches', {
        configurable: true,
        value: { open: openCache },
    });
    Object.defineProperty(globalThis, 'MODE', { configurable: true, value: 'production' });
    spyOn(console, 'log').mockImplementation(() => {});
    spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(async () => {
    await Promise.all(tasks);
    tasks.length = 0;
    entries.clear();
    mock.restore();
    for (const [name, descriptor] of [
        ['caches', originalCaches],
        ['MODE', originalMode],
    ] as const) {
        if (descriptor) {
            Object.defineProperty(globalThis, name, descriptor);
        } else {
            Reflect.deleteProperty(globalThis, name);
        }
    }
});

describe('Arcade oEmbed lookups', () => {
    it('reuses validated dimensions by flow in the named cache', async () => {
        const secondDimensions = { ...dimensions, height: 960 };
        const fetch = spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce(Response.json(embed))
            .mockResolvedValueOnce(Response.json({ ...embed, ...secondDimensions }));

        expect(await fetchArcadeOEmbedData('first-flow')).toEqual(dimensions);
        await Promise.all(tasks);
        expect(await fetchArcadeOEmbedData('first-flow')).toEqual(dimensions);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(openCache).toHaveBeenCalledWith('arcade-oembed');
        const stored = entries.values().next().value;
        if (!stored) {
            throw new Error('Expected the lookup to be cached');
        }
        expect(stored.headers.get('cache-control')).toBe('max-age=300');
        expect(await stored.clone().json<typeof dimensions>()).toEqual(dimensions);

        expect(await fetchArcadeOEmbedData('second-flow')).toEqual(secondDimensions);
        expect(fetch).toHaveBeenCalledTimes(2);
        const url = new URL(String(fetch.mock.calls[1][0]));
        expect(url.searchParams.get('url')).toBe('https://app.arcade.software/share/second-flow');
    });

    it('refreshes dimensions when the cache no longer holds the entry', async () => {
        const updated = { ...dimensions, height: 960 };
        const fetch = spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce(Response.json(embed))
            .mockResolvedValueOnce(Response.json(updated));

        expect(await fetchArcadeOEmbedData('expiring-flow')).toEqual(dimensions);
        await Promise.all(tasks);
        entries.clear();

        expect(await fetchArcadeOEmbedData('expiring-flow')).toEqual(updated);
        expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('reports deletion after expiry', async () => {
        const fetch = spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce(Response.json(embed))
            .mockResolvedValueOnce(new Response(null, { status: 404, statusText: 'Not Found' }));

        await fetchArcadeOEmbedData('deleted-flow');
        await Promise.all(tasks);
        entries.clear();

        await expect(fetchArcadeOEmbedData('deleted-flow')).rejects.toMatchObject({
            name: 'IntegrationError',
            reason: 'invalid_input',
            code: 422,
        });
        expect(fetch).toHaveBeenCalledTimes(2);
        expect(entries.size).toBe(0);
    });

    it('fetches dimensions when the cache is unavailable', async () => {
        openCache.mockRejectedValueOnce(new Error('Cache unavailable'));
        spyOn(globalThis, 'fetch').mockResolvedValueOnce(Response.json(embed));

        expect(await fetchArcadeOEmbedData('cache-unavailable')).toEqual(dimensions);
    });

    it('keeps a successful lookup usable when the cache write fails', async () => {
        spyOn(cache, 'put').mockRejectedValueOnce(new Error('Cache unavailable'));
        spyOn(globalThis, 'fetch').mockResolvedValueOnce(Response.json(embed));

        expect(await fetchArcadeOEmbedData('write-failure')).toEqual(dimensions);
        await Promise.all(tasks);
    });

    it.each([404, 422, 500])('does not cache an upstream %i response', async (status) => {
        const fetch = spyOn(globalThis, 'fetch').mockImplementation(
            async () => new Response(null, { status, statusText: 'Upstream error' }),
        );
        const flowId = 'upstream-error-' + status;

        await expect(fetchArcadeOEmbedData(flowId)).rejects.toThrow();
        await expect(fetchArcadeOEmbedData(flowId)).rejects.toThrow();
        expect(fetch).toHaveBeenCalledTimes(2);
    });

    it.each([
        ['missing data', null],
        ['zero height', { ...embed, height: 0 }],
        ['string width', { ...embed, width: '1280' }],
    ] as const)('rejects %s and fetches again', async (caseName, data) => {
        const fetch = spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce(Response.json(data))
            .mockResolvedValueOnce(Response.json(embed));

        await expect(fetchArcadeOEmbedData(caseName)).rejects.toThrow(
            'Invalid Arcade oEmbed dimensions',
        );
        expect(await fetchArcadeOEmbedData(caseName)).toEqual(dimensions);
        expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('preserves network failures and fetches again', async () => {
        const error = new TypeError('fetch failed');
        const fetch = spyOn(globalThis, 'fetch')
            .mockRejectedValueOnce(error)
            .mockResolvedValueOnce(Response.json(embed));

        await expect(fetchArcadeOEmbedData('network-failure')).rejects.toBe(error);
        expect(await fetchArcadeOEmbedData('network-failure')).toEqual(dimensions);
        expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('rejects malformed JSON and fetches again', async () => {
        const fetch = spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce(new Response('not json'))
            .mockResolvedValueOnce(Response.json(embed));

        await expect(fetchArcadeOEmbedData('malformed-response')).rejects.toBeInstanceOf(
            SyntaxError,
        );
        expect(await fetchArcadeOEmbedData('malformed-response')).toEqual(dimensions);
        expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('aborts a stalled lookup with a ten second deadline', async () => {
        const timeout = AbortSignal.timeout.bind(AbortSignal);
        const deadline = spyOn(AbortSignal, 'timeout').mockImplementation(() => timeout(5));
        spyOn(globalThis, 'fetch').mockImplementation(async (_url, init) => {
            const signal = init?.signal;
            if (!signal) {
                throw new Error('Missing lookup deadline');
            }
            return new Promise<Response>((_resolve, reject) => {
                signal.addEventListener('abort', () => reject(signal.reason), { once: true });
            });
        });

        await expect(fetchArcadeOEmbedData('stalled-flow')).rejects.toMatchObject({
            name: 'TimeoutError',
        });
        expect(deadline).toHaveBeenCalledWith(10_000);
    });
});

it('reuses the lookup across render contexts while preserving language and render caching', async () => {
    const fetch = spyOn(globalThis, 'fetch').mockImplementation(async () => Response.json(embed));

    const first = await renderEmbed('first-space', 'pt BR');
    await Promise.all(tasks);
    const second = await renderEmbed('other-space', 'en');

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(first.status).toBe(200);
    expect(first.headers.get('cache-control')).toBe('max-age=300');
    expect(await first.json()).toMatchObject({
        element: {
            type: 'block',
            children: [
                {
                    type: 'webframe',
                    aspectRatio: 1280 / 720,
                    source: {
                        url: 'https://demo.arcade.software/render-flow?embed&language=pt%20BR',
                    },
                },
            ],
        },
    });
    expect(second.status).toBe(200);
    expect(second.headers.get('cache-control')).toBe('max-age=300');
    expect(await second.json()).toMatchObject({
        element: {
            children: [
                {
                    type: 'webframe',
                    aspectRatio: 1280 / 720,
                    source: { url: 'https://demo.arcade.software/render-flow?embed&language=en' },
                },
            ],
        },
    });
});

async function renderEmbed(spaceId: string, language: string) {
    const body = new FormData();
    body.set(
        'event',
        JSON.stringify({
            type: 'ui_render',
            eventId: 'test-event',
            componentId: 'embed',
            props: { flowId: 'render-flow', language },
            context: { type: 'document', spaceId },
        }),
    );
    body.set(
        'environment',
        JSON.stringify({
            apiEndpoint: 'https://api.example.com',
            apiTokens: {},
            integration: { name: 'arcade', version: 'test', urls: {} },
        }),
    );
    return integration.fetch(
        new Request('https://worker.example.com/v1', { method: 'POST', body }),
        {},
        { ...context, passThroughOnException() {}, props: {}, exports: {}, abort() {} },
    );
}

function fetchArcadeOEmbedData(flowId: string) {
    return fetchDimensions(flowId, context);
}
