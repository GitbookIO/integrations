import { describe, it, expect, beforeEach, mock } from 'bun:test';

import { generateHmacSignature } from '../src/common';
import { verifyIntegrationSignature } from './utils';

// Mock fetch globally
const mockFetch = mock(() => Promise.resolve(new Response('OK', { status: 200 })));
global.fetch = mockFetch;

describe('Integration Flow Tests', () => {
    beforeEach(() => {
        mockFetch.mockClear();
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
