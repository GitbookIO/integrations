import { describe, it, expect } from 'bun:test';
import { verifyIntegrationSignature } from './utils';

describe('Signature Verification', () => {
    it('should verify valid signatures', async () => {
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

    it('should reject invalid signatures', async () => {
        const payload = '{"task":{"type":"webhook:retry","payload":{}}}';
        const secret = 'test-secret';
        const invalidSignature = 'invalid-signature';

        const isValid = await verifyIntegrationSignature(payload, invalidSignature, secret);
        expect(isValid).toBe(false);
    });

    it('should reject empty signatures', async () => {
        const payload = '{"task":{"type":"webhook:retry","payload":{}}}';
        const secret = 'test-secret';

        const isValid = await verifyIntegrationSignature(payload, '', secret);
        expect(isValid).toBe(false);
    });

    it('should reject signatures with wrong secret', async () => {
        const payload = '{"task":{"type":"webhook:retry","payload":{}}}';
        const secret = 'test-secret';
        const wrongSecret = 'wrong-secret';

        // Generate signature with wrong secret
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(wrongSecret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign'],
        );
        const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
        const wrongSignature = Array.from(new Uint8Array(signatureBuffer))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');

        // Verify against the correct secret (should fail)
        const isValid = await verifyIntegrationSignature(payload, wrongSignature, secret);
        expect(isValid).toBe(false);
    });

    it('should accept signatures with correct secret', async () => {
        const payload = '{"task":{"type":"webhook:retry","payload":{}}}';
        const secret = 'test-secret';

        // Generate signature with correct secret
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign'],
        );
        const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
        const correctSignature = Array.from(new Uint8Array(signatureBuffer))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');

        // Verify against the correct secret (should pass)
        const isValid = await verifyIntegrationSignature(payload, correctSignature, secret);
        expect(isValid).toBe(true);
    });
});
