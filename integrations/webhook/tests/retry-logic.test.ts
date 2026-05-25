// tests/retry-logic.test.ts
import { describe, beforeEach, afterEach, afterAll, it, expect, mock, spyOn } from 'bun:test';
import * as api from '@gitbook/api';

// fake-timers v11+ API
const FakeTimers = require('@sinonjs/fake-timers');
let clock: any;

// delay import of module-under-test until after shims
let deliverWebhook: (typeof import('../src/common'))['deliverWebhook'];
let REQUEST_TIMEOUT: number;

// Mock fetch globally
const mockFetch = mock(() => Promise.resolve(new Response('OK', { status: 200 })));
(globalThis as any).fetch = mockFetch;

// Mock context
const createMockContext = () =>
    ({
        api: {},
        environment: {
            integration: { name: 'webhook-test' },
            spaceInstallation: {
                configuration: {
                    webhookUrl: 'https://example.com/webhook',
                    secret: 'test-secret',
                    site_view: true,
                    space_content_updated: true,
                    page_feedback: true,
                },
            },
            secrets: {},
            signingSecrets: { integration: 'test-integration-secret' },
            apiEndpoint: 'https://api.gitbook.com',
            apiToken: 'test-api-token',
            apiTokens: {},
        },
        waitUntil: mock((p: Promise<any>) => p),
    }) as any;

// Mock event
const mockEvent: api.SiteViewEvent = {
    eventId: 'test-event-id',
    type: 'site_view',
    siteId: 'test-site-id',
    installationId: 'test-installation-id',
    visitor: {
        anonymousId: 'test-anonymous-id',
        userAgent: 'test-user-agent',
        ip: '127.0.0.1',
        cookies: {},
    },
    url: 'https://example.com/test',
    referrer: 'https://example.com/',
};

describe('Webhook Retry Logic', () => {
    beforeEach(async () => {
        // 1) install controllable timers for globals
        clock = FakeTimers.withGlobal(globalThis).install({
            toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'],
            now: Date.now(),
        });

        // 2) route Bun.sleep through the fake clock if your code uses it
        if ((Bun as any).sleep) {
            spyOn(Bun as any, 'sleep').mockImplementation((ms: number) => clock.tickAsync(ms));
        }

        // 3) route node:timers/promises.setTimeout through the fake clock
        mock.module('node:timers/promises', () => ({
            setTimeout: (ms: number, value?: any) => clock.tickAsync(ms).then(() => value),
        }));

        mockFetch.mockClear();

        // 4) import the code under test after shims
        const mod = await import('../src/common');
        deliverWebhook = mod.deliverWebhook;
        REQUEST_TIMEOUT = mod.REQUEST_TIMEOUT;
    });

    afterEach(() => {
        // restore bun:test mocks and spies
        mock.restore();
        if (clock) clock.uninstall();
        clock = undefined;
    });

    afterAll(() => {
        mockFetch.mockRestore();
    });

    it('sanity: fake timers advance', async () => {
        let fired = false;
        setTimeout(() => (fired = true), 1000);
        await clock.tickAsync(1000);
        expect(fired).toBe(true);
    });

    it('delivers on first attempt', async () => {
        const ctx = createMockContext();
        const timestamp = Math.floor(Date.now() / 1000);
        const signature = 'test-signature';

        mockFetch.mockResolvedValueOnce(new Response('OK', { status: 200 }));

        await deliverWebhook(
            ctx,
            mockEvent,
            'https://example.com/webhook',
            'test-secret',
            timestamp,
            signature,
            0,
        );

        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith('https://example.com/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'GitBook-Webhook',
                'X-GitBook-Signature': `t=${timestamp},v1=${signature}`,
            },
            body: JSON.stringify(mockEvent),
            signal: AbortSignal.timeout(REQUEST_TIMEOUT),
        });
    });

    it('retries on 5xx', async () => {
        const ctx = createMockContext();
        const ts = Math.floor(Date.now() / 1000);
        const sig = 'test';

        mockFetch
            .mockResolvedValueOnce(new Response('Internal Server Error', { status: 500 }))
            .mockResolvedValueOnce(new Response('OK', { status: 200 }));

        const p = deliverWebhook(
            ctx,
            mockEvent,
            'https://example.com/webhook',
            'test-secret',
            ts,
            sig,
        );

        // advance all pending timers regardless of jitter
        await clock.runAllAsync();
        await p;

        expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('retries on 429', async () => {
        const ctx = createMockContext();
        const ts = Math.floor(Date.now() / 1000);
        const sig = 'test';

        mockFetch
            .mockResolvedValueOnce(new Response('Too Many Requests', { status: 429 }))
            .mockResolvedValueOnce(new Response('OK', { status: 200 }));

        const p = deliverWebhook(
            ctx,
            mockEvent,
            'https://example.com/webhook',
            'test-secret',
            ts,
            sig,
        );

        await clock.runAllAsync();
        await p;

        expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('retries on network timeout error', async () => {
        const ctx = createMockContext();
        const ts = Math.floor(Date.now() / 1000);
        const sig = 'test';

        const timeoutError = new Error('The operation was aborted');
        timeoutError.name = 'AbortError';

        mockFetch
            .mockRejectedValueOnce(timeoutError)
            .mockResolvedValueOnce(new Response('OK', { status: 200 }));

        const p = deliverWebhook(
            ctx,
            mockEvent,
            'https://example.com/webhook',
            'test-secret',
            ts,
            sig,
        );

        await clock.runAllAsync();
        await p;

        expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('retries on connection refused error', async () => {
        const ctx = createMockContext();
        const ts = Math.floor(Date.now() / 1000);
        const sig = 'test';

        const connectionError = new Error('ECONNREFUSED');

        mockFetch
            .mockRejectedValueOnce(connectionError)
            .mockResolvedValueOnce(new Response('OK', { status: 200 }));

        const p = deliverWebhook(
            ctx,
            mockEvent,
            'https://example.com/webhook',
            'test-secret',
            ts,
            sig,
        );

        await clock.runAllAsync();
        await p;

        expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('does not retry on 4xx (except 429)', async () => {
        const ctx = createMockContext();
        const ts = Math.floor(Date.now() / 1000);
        const sig = 'test';

        mockFetch.mockResolvedValueOnce(new Response('Bad Request', { status: 400 }));

        await expect(
            deliverWebhook(
                ctx,
                mockEvent,
                'https://example.com/webhook',
                'test-secret',
                ts,
                sig,
                0,
            ),
        ).rejects.toThrow('Webhook delivery failed: 400');

        expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('stops when no retries left (500)', async () => {
        const ctx = createMockContext();
        const ts = Math.floor(Date.now() / 1000);
        const sig = 'test';

        mockFetch.mockResolvedValueOnce(new Response('Internal Server Error', { status: 500 }));

        await expect(
            deliverWebhook(
                ctx,
                mockEvent,
                'https://example.com/webhook',
                'test-secret',
                ts,
                sig,
                0,
            ),
        ).rejects.toThrow('Webhook delivery failed: 500');

        expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('throws after no retries left (AbortError)', async () => {
        const ctx = createMockContext();
        const ts = Math.floor(Date.now() / 1000);
        const sig = 'test';

        const timeoutError = new Error('The operation was aborted');
        timeoutError.name = 'AbortError';
        mockFetch.mockRejectedValueOnce(timeoutError);

        await expect(
            deliverWebhook(
                ctx,
                mockEvent,
                'https://example.com/webhook',
                'test-secret',
                ts,
                sig,
                0,
            ),
        ).rejects.toThrow('The operation was aborted');

        expect(mockFetch).toHaveBeenCalledTimes(1);
    });
});
