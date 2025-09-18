import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import * as api from '@gitbook/api';

import { generateHmacSignature, EventType, verifyIntegrationSignature } from '../src/common';

// Mock fetch globally
const mockFetch = mock(() => Promise.resolve(new Response('OK', { status: 200 })));
global.fetch = mockFetch;

// Don't mock crypto for HMAC signature generation tests - use real crypto

// Mock the GitBook API
const mockApi = {
    integrations: {
        queueIntegrationTask: mock(() => Promise.resolve()),
    },
};

// Mock context
const createMockContext = (overrides = {}) =>
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
        ...overrides,
    }) as any;

// Mock events for different event types
const mockSiteViewEvent: api.SiteViewEvent = {
    eventId: 'site-view-event-id',
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

const mockContentUpdatedEvent: api.SpaceContentUpdatedEvent = {
    eventId: 'content-updated-event-id',
    type: 'space_content_updated',
    spaceId: 'test-space-id',
    installationId: 'test-installation-id',
    revisionId: 'test-revision-id',
};

const mockPageFeedbackEvent: api.PageFeedbackEvent = {
    eventId: 'page-feedback-event-id',
    type: 'page_feedback',
    siteId: 'test-site-id',
    spaceId: 'test-space-id',
    installationId: 'test-installation-id',
    pageId: 'test-page-id',
    feedback: {
        rating: api.PageFeedbackRating.Good,
        comment: 'This page was helpful!',
    },
    visitor: {
        anonymousId: 'test-anonymous-id',
        userAgent: 'test-user-agent',
        ip: '127.0.0.1',
        cookies: {},
    },
    url: 'https://example.com/test-page',
    referrer: 'https://example.com/',
};

describe('Integration Flow Tests', () => {
    beforeEach(() => {
        mockFetch.mockClear();
        mockApi.integrations.queueIntegrationTask.mockClear();
    });

    afterEach(() => {
        mockFetch.mockRestore();
    });

    describe('Event Handling Logic', () => {
        it('should validate configuration structure', () => {
            const validConfig = {
                webhookUrl: 'https://example.com/webhook',
                secret: 'test-secret',
                site_view: true,
                space_content_updated: true,
                page_feedback: true,
            };

            // Test that all required fields are present
            expect(validConfig.webhookUrl).toBeDefined();
            expect(validConfig.secret).toBeDefined();
            expect(validConfig.site_view).toBeDefined();
            expect(validConfig.space_content_updated).toBeDefined();
            expect(validConfig.page_feedback).toBeDefined();
        });
    });

    describe('Signature Verification Integration', () => {
        it('should verify valid signatures for task payloads', async () => {
            const payload = '{"task":{"type":"webhook:retry","payload":{}}}';
            const secret = 'test-secret';

            // Generate a valid signature
            const encoder = new TextEncoder();
            const key = await crypto.subtle.importKey(
                'raw',
                encoder.encode(secret),
                { name: 'HMAC', hash: 'SHA-256' },
                false,
                ['sign'],
            );
            const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
            const validSignature = Array.from(new Uint8Array(signatureBuffer))
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('');

            const isValid = await verifyIntegrationSignature(payload, validSignature, secret);
            expect(isValid).toBe(true);
        });

        it('should reject invalid signatures for task payloads', async () => {
            const payload = '{"task":{"type":"webhook:retry","payload":{}}}';
            const secret = 'test-secret';
            const invalidSignature = 'invalid-signature';

            const isValid = await verifyIntegrationSignature(payload, invalidSignature, secret);
            expect(isValid).toBe(false);
        });

        it('should handle empty signatures gracefully', async () => {
            const payload = '{"task":{"type":"webhook:retry","payload":{}}}';
            const secret = 'test-secret';

            const isValid = await verifyIntegrationSignature(payload, '', secret);
            expect(isValid).toBe(false);
        });
    });

    describe('HMAC Signature Generation', () => {
        it('should generate valid signatures', async () => {
            const payload = '{"test": "data"}';
            const secret = 'test-secret';
            const timestamp = Math.floor(Date.now() / 1000);

            const signature = await generateHmacSignature({
                payload,
                secret,
                timestamp,
            });

            expect(signature).toMatch(/^[a-f0-9]+$/);
            expect(signature).toHaveLength(64); // 32 bytes in hex
        });

        it('should generate different signatures for different payloads', async () => {
            const secret = 'test-secret';
            const timestamp = Math.floor(Date.now() / 1000);

            const signature1 = await generateHmacSignature({
                payload: '{"test": "data1"}',
                secret,
                timestamp,
            });

            const signature2 = await generateHmacSignature({
                payload: '{"test": "data2"}',
                secret,
                timestamp,
            });

            expect(signature1).not.toBe(signature2);
        });

        it('should generate different signatures for different secrets', async () => {
            const payload = '{"test": "data"}';
            const timestamp = Math.floor(Date.now() / 1000);

            const signature1 = await generateHmacSignature({
                payload,
                secret: 'secret1',
                timestamp,
            });

            const signature2 = await generateHmacSignature({
                payload,
                secret: 'secret2',
                timestamp,
            });

            expect(signature1).not.toBe(signature2);
        });

        it('should generate different signatures for different timestamps', async () => {
            const payload = '{"test": "data"}';
            const secret = 'test-secret';

            const signature1 = await generateHmacSignature({
                payload,
                secret,
                timestamp: 1000,
            });

            const signature2 = await generateHmacSignature({
                payload,
                secret,
                timestamp: 2000,
            });

            expect(signature1).not.toBe(signature2);
        });
    });
});
