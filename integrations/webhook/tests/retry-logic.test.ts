import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import type * as api from '@gitbook/api';

import { deliverWebhook, MAX_RETRIES, REQUEST_TIMEOUT } from '../src/common';

// Mock fetch globally
const mockFetch = mock(() => Promise.resolve(new Response('OK', { status: 200 })));
global.fetch = mockFetch;

// Mock crypto for HMAC signature generation (but keep real crypto for signature verification tests)
const mockCrypto = {
    getRandomValues: mock((arr: Uint8Array) => {
        for (let i = 0; i < arr.length; i++) {
            arr[i] = Math.floor(Math.random() * 256);
        }
        return arr;
    }),
    subtle: {
        importKey: mock(() => Promise.resolve({})),
        sign: mock(() => Promise.resolve(new ArrayBuffer(32))),
    },
};
// Only mock crypto for the main tests, not for signature verification tests

// Mock the GitBook API
const mockApi = {
    integrations: {
        queueIntegrationTask: mock(() => Promise.resolve()),
    },
};

// Mock context
const createMockContext = () =>
    ({
        api: mockApi,
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
            signingSecrets: {
                integration: 'test-integration-secret',
            },
            apiEndpoint: 'https://api.gitbook.com',
            apiToken: 'test-api-token',
            apiTokens: {},
        },
        waitUntil: mock((promise: Promise<any>) => promise),
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
    beforeEach(() => {
        mockFetch.mockClear();
        mockApi.integrations.queueIntegrationTask.mockClear();
    });

    afterEach(() => {
        mockFetch.mockRestore();
    });

    describe('deliverWebhook', () => {
        it('should deliver webhook successfully on first attempt', async () => {
            const context = createMockContext();
            const timestamp = Math.floor(Date.now() / 1000);
            const signature = 'test-signature';

            mockFetch.mockResolvedValueOnce(new Response('OK', { status: 200 }));

            await deliverWebhook(
                context,
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
            expect(mockApi.integrations.queueIntegrationTask).not.toHaveBeenCalled();
        });

        it('should retry on 5xx server error', async () => {
            const context = createMockContext();
            const timestamp = Math.floor(Date.now() / 1000);
            const signature = 'test-signature';

            // Mock first call fails, second call succeeds
            mockFetch
                .mockResolvedValueOnce(new Response('Internal Server Error', { status: 500 }))
                .mockResolvedValueOnce(new Response('OK', { status: 200 }));

            await deliverWebhook(
                context,
                mockEvent,
                'https://example.com/webhook',
                'test-secret',
                timestamp,
                signature,
            );

            expect(mockFetch).toHaveBeenCalledTimes(2);
        });

        it('should retry on 429 rate limit error', async () => {
            const context = createMockContext();
            const timestamp = Math.floor(Date.now() / 1000);
            const signature = 'test-signature';

            // Mock first call fails, second call succeeds
            mockFetch
                .mockResolvedValueOnce(new Response('Too Many Requests', { status: 429 }))
                .mockResolvedValueOnce(new Response('OK', { status: 200 }));

            await deliverWebhook(
                context,
                mockEvent,
                'https://example.com/webhook',
                'test-secret',
                timestamp,
                signature,
            );

            expect(mockFetch).toHaveBeenCalledTimes(2);
        });

        it('should retry on network timeout error', async () => {
            const context = createMockContext();
            const timestamp = Math.floor(Date.now() / 1000);
            const signature = 'test-signature';

            const timeoutError = new Error('The operation was aborted');
            timeoutError.name = 'AbortError';

            // Mock first call fails, second call succeeds
            mockFetch
                .mockRejectedValueOnce(timeoutError)
                .mockResolvedValueOnce(new Response('OK', { status: 200 }));

            await deliverWebhook(
                context,
                mockEvent,
                'https://example.com/webhook',
                'test-secret',
                timestamp,
                signature,
            );

            expect(mockFetch).toHaveBeenCalledTimes(2);
        });

        it('should retry on connection refused error', async () => {
            const context = createMockContext();
            const timestamp = Math.floor(Date.now() / 1000);
            const signature = 'test-signature';

            const connectionError = new Error('ECONNREFUSED');

            // Mock first call fails, second call succeeds
            mockFetch
                .mockRejectedValueOnce(connectionError)
                .mockResolvedValueOnce(new Response('OK', { status: 200 }));

            await deliverWebhook(
                context,
                mockEvent,
                'https://example.com/webhook',
                'test-secret',
                timestamp,
                signature,
            );

            expect(mockFetch).toHaveBeenCalledTimes(2);
        });

        it('should not retry on 4xx client errors (except 429)', async () => {
            const context = createMockContext();
            const timestamp = Math.floor(Date.now() / 1000);
            const signature = 'test-signature';

            mockFetch.mockResolvedValueOnce(new Response('Bad Request', { status: 400 }));

            await expect(
                deliverWebhook(
                    context,
                    mockEvent,
                    'https://example.com/webhook',
                    'test-secret',
                    timestamp,
                    signature,
                    0,
                ),
            ).rejects.toThrow('Webhook delivery failed: 400');

            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(mockApi.integrations.queueIntegrationTask).not.toHaveBeenCalled();
        });

        it('should stop retrying after MAX_RETRIES attempts', async () => {
            const context = createMockContext();
            const timestamp = Math.floor(Date.now() / 1000);
            const signature = 'test-signature';

            mockFetch.mockResolvedValueOnce(new Response('Internal Server Error', { status: 500 }));

            await expect(
                deliverWebhook(
                    context,
                    mockEvent,
                    'https://example.com/webhook',
                    'test-secret',
                    timestamp,
                    signature,
                    0, // No retries left
                ),
            ).rejects.toThrow('Webhook delivery failed: 500');

            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        it('should throw error after MAX_RETRIES attempts', async () => {
            const context = createMockContext();
            const timestamp = Math.floor(Date.now() / 1000);
            const signature = 'test-signature';

            const timeoutError = new Error('The operation was aborted');
            timeoutError.name = 'AbortError';
            mockFetch.mockRejectedValueOnce(timeoutError);

            await expect(
                deliverWebhook(
                    context,
                    mockEvent,
                    'https://example.com/webhook',
                    'test-secret',
                    timestamp,
                    signature,
                    0, // No retries left
                ),
            ).rejects.toThrow('The operation was aborted');

            expect(mockFetch).toHaveBeenCalledTimes(1);
        });
    });
});
