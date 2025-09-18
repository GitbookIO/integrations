import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import type * as api from '@gitbook/api';

import { deliverWebhook, queueWebhookRetryTask, MAX_RETRIES, REQUEST_TIMEOUT } from '../src/common';

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

        it('should queue retry task on 5xx server error', async () => {
            const context = createMockContext();
            const timestamp = Math.floor(Date.now() / 1000);
            const signature = 'test-signature';

            mockFetch.mockResolvedValueOnce(new Response('Internal Server Error', { status: 500 }));

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
            expect(mockApi.integrations.queueIntegrationTask).toHaveBeenCalledTimes(1);
            expect(mockApi.integrations.queueIntegrationTask).toHaveBeenCalledWith('webhook-test', {
                task: {
                    type: 'webhook:retry',
                    payload: {
                        event: mockEvent,
                        webhookUrl: 'https://example.com/webhook',
                        secret: 'test-secret',
                        retryCount: 1,
                        timestamp,
                        signature,
                    },
                },
                schedule: expect.any(Number),
            });
        });

        it('should queue retry task on 429 rate limit error', async () => {
            const context = createMockContext();
            const timestamp = Math.floor(Date.now() / 1000);
            const signature = 'test-signature';

            mockFetch.mockResolvedValueOnce(new Response('Too Many Requests', { status: 429 }));

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
            expect(mockApi.integrations.queueIntegrationTask).toHaveBeenCalledTimes(1);
        });

        it('should queue retry task on network timeout error', async () => {
            const context = createMockContext();
            const timestamp = Math.floor(Date.now() / 1000);
            const signature = 'test-signature';

            const timeoutError = new Error('The operation was aborted');
            timeoutError.name = 'AbortError';
            mockFetch.mockRejectedValueOnce(timeoutError);

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
            expect(mockApi.integrations.queueIntegrationTask).toHaveBeenCalledTimes(1);
        });

        it('should queue retry task on connection refused error', async () => {
            const context = createMockContext();
            const timestamp = Math.floor(Date.now() / 1000);
            const signature = 'test-signature';

            const connectionError = new Error('ECONNREFUSED');
            mockFetch.mockRejectedValueOnce(connectionError);

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
            expect(mockApi.integrations.queueIntegrationTask).toHaveBeenCalledTimes(1);
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
                    MAX_RETRIES,
                ),
            ).rejects.toThrow('Webhook delivery failed: 500');

            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(mockApi.integrations.queueIntegrationTask).not.toHaveBeenCalled();
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
                    MAX_RETRIES,
                ),
            ).rejects.toThrow('The operation was aborted');

            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(mockApi.integrations.queueIntegrationTask).not.toHaveBeenCalled();
        });
    });

    describe('queueWebhookRetryTask', () => {
        it('should calculate exponential backoff delay correctly', async () => {
            const context = createMockContext();
            const task = {
                type: 'webhook:retry' as const,
                payload: {
                    event: mockEvent,
                    webhookUrl: 'https://example.com/webhook',
                    secret: 'test-secret',
                    retryCount: 2,
                    timestamp: Math.floor(Date.now() / 1000),
                    signature: 'test-signature',
                },
            };

            await queueWebhookRetryTask(context, task);

            expect(mockApi.integrations.queueIntegrationTask).toHaveBeenCalledTimes(1);
            const calls = (mockApi.integrations.queueIntegrationTask as any).mock.calls;
            expect(calls.length).toBeGreaterThan(0);
            const call = calls[0];
            const schedule = call[1].schedule;

            // For retryCount = 2, base delay = 1000 * 2^2 = 4000ms
            // With jitter (0-10%), delay should be between 4000-4400ms
            // Converted to seconds and rounded up, should be 4-5 seconds
            expect(schedule).toBeGreaterThanOrEqual(4);
            expect(schedule).toBeLessThanOrEqual(5);
        });
    });
});
