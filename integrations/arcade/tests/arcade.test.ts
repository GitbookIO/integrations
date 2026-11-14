import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';
import type { RuntimeContext } from '@gitbook/runtime';

import { fetchArcadeOEmbedData, type ArcadeOEmbed } from '../src/arcade';
import integration from '../src/index';

const embed = { type: 'rich', title: 'Demo', width: 1280, height: 720 } satisfies ArcadeOEmbed;
const entries = new Map<string, Response>();
const tasks: Promise<unknown>[] = [];
const context: Pick<RuntimeContext, 'waitUntil'> = {
    waitUntil: (promise) => {
        tasks.push(promise);
    },
};
const cache = {
    match: mock(async (key: string) => entries.get(key)?.clone()),
    put: mock(async (key: string, response: Response) => {
        entries.set(key, response.clone());
    }),
};
const originalCaches = Object.getOwnPropertyDescriptor(globalThis, 'caches');
const originalMode = Object.getOwnPropertyDescriptor(globalThis, 'MODE');

beforeEach(() => {
    entries.clear();
    tasks.length = 0;
    cache.match.mockClear();
    cache.put.mockClear();
    Object.defineProperty(globalThis, 'caches', {
        configurable: true,
        value: { open: async () => cache },
    });
    Object.defineProperty(globalThis, 'MODE', { configurable: true, value: 'production' });
    spyOn(console, 'log').mockImplementation(() => {});
    spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(async () => {
    await Promise.all(tasks);
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
    it('reuses a successful lookup and keeps flows separate', async () => {
        const fetch = spyOn(globalThis, 'fetch').mockImplementation(async () =>
            Response.json(embed),
        );

        expect(await fetchArcadeOEmbedData('first', context)).toEqual(embed);
        await Promise.all(tasks);
        expect(await fetchArcadeOEmbedData('first', context)).toEqual(embed);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect([...entries.values()][0].headers.get('cache-control')).toBe('max-age=300');

        await fetchArcadeOEmbedData('second', context);
        expect(fetch).toHaveBeenCalledTimes(2);
        const url = new URL(String(fetch.mock.calls[1][0]));
        expect(url.searchParams.get('url')).toBe('https://app.arcade.software/share/second');
    });

    it('refreshes dimensions when the platform expires the cached entry', async () => {
        const fetch = spyOn(globalThis, 'fetch').mockResolvedValueOnce(Response.json(embed));
        await fetchArcadeOEmbedData('flow', context);
        await Promise.all(tasks);
        entries.clear();
        const updated = { ...embed, height: 960 };
        fetch.mockResolvedValueOnce(Response.json(updated));

        expect(await fetchArcadeOEmbedData('flow', context)).toEqual(updated);
        expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('reports deletion after expiry instead of serving stale data', async () => {
        const fetch = spyOn(globalThis, 'fetch').mockResolvedValueOnce(Response.json(embed));
        await fetchArcadeOEmbedData('flow', context);
        await Promise.all(tasks);
        entries.clear();
        fetch.mockResolvedValueOnce(new Response(null, { status: 404, statusText: 'Not Found' }));

        await expect(fetchArcadeOEmbedData('flow', context)).rejects.toMatchObject({
            name: 'ExposableError',
            code: 404,
        });
        expect(entries.size).toBe(0);
    });

    it.each([404, 422, 500])('does not cache an upstream %i response', async (status) => {
        const fetch = spyOn(globalThis, 'fetch').mockImplementation(
            async () => new Response(null, { status, statusText: 'Upstream error' }),
        );
        for (let attempt = 0; attempt < 2; attempt++) {
            await expect(fetchArcadeOEmbedData('flow', context)).rejects.toMatchObject(
                status < 500
                    ? { name: 'ExposableError', code: status, message: 'Upstream error' }
                    : { name: 'Error', message: '500 Upstream error' },
            );
        }
        expect(fetch).toHaveBeenCalledTimes(2);
        expect(cache.put).not.toHaveBeenCalled();
    });

    it.each([null, { ...embed, height: 0 }, { ...embed, width: '1280' }])(
        'rejects invalid dimensions without caching them: %j',
        async (data) => {
            spyOn(globalThis, 'fetch').mockResolvedValue(Response.json(data));
            await expect(fetchArcadeOEmbedData('flow', context)).rejects.toThrow();
            expect(cache.put).not.toHaveBeenCalled();
        },
    );

    it('preserves network failures without caching them', async () => {
        const error = new TypeError('fetch failed');
        spyOn(globalThis, 'fetch').mockRejectedValue(error);
        await expect(fetchArcadeOEmbedData('flow', context)).rejects.toBe(error);
        expect(cache.put).not.toHaveBeenCalled();
    });

    it('does not cache malformed JSON', async () => {
        spyOn(globalThis, 'fetch').mockResolvedValue(new Response('not json'));
        await expect(fetchArcadeOEmbedData('flow', context)).rejects.toBeInstanceOf(SyntaxError);
        expect(cache.put).not.toHaveBeenCalled();
    });

    it('still looks up the flow if the cache is unavailable', async () => {
        Object.defineProperty(globalThis, 'caches', {
            configurable: true,
            value: { open: async () => Promise.reject(new Error('Cache unavailable')) },
        });
        spyOn(globalThis, 'fetch').mockResolvedValue(Response.json(embed));
        expect(await fetchArcadeOEmbedData('flow', context)).toEqual(embed);
    });

    it('keeps a successful lookup usable if the background cache write fails', async () => {
        cache.put.mockRejectedValueOnce(new Error('Cache unavailable'));
        spyOn(globalThis, 'fetch').mockResolvedValue(Response.json(embed));
        expect(await fetchArcadeOEmbedData('flow', context)).toEqual(embed);
        await expect(Promise.all(tasks)).resolves.toBeDefined();
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

        await expect(fetchArcadeOEmbedData('flow', context)).rejects.toMatchObject({
            name: 'TimeoutError',
        });
        expect(deadline).toHaveBeenCalledWith(10_000);
        expect(cache.put).not.toHaveBeenCalled();
    });
});

it('renders current dimensions and language with a short output cache lifetime', async () => {
    spyOn(globalThis, 'fetch').mockResolvedValue(Response.json(embed));
    const body = new FormData();
    body.set(
        'event',
        JSON.stringify({
            type: 'ui_render',
            eventId: 'test-event',
            componentId: 'embed',
            props: { flowId: 'flow', language: 'pt BR' },
            context: { type: 'document', spaceId: 'test-space' },
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
    const response = await integration.fetch(
        new Request('https://worker.example.com/v1', { method: 'POST', body }),
        {},
        { ...context, passThroughOnException() {}, props: {}, exports: {}, abort() {} },
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('max-age=300');
    expect(await response.json()).toMatchObject({
        element: {
            type: 'block',
            children: [
                {
                    type: 'webframe',
                    aspectRatio: 1280 / 720,
                    source: { url: 'https://demo.arcade.software/flow?embed&language=pt%20BR' },
                },
            ],
        },
    });
});
