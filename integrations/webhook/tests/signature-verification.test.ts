import { describe, it, expect } from 'bun:test';
import { verifyIntegrationSignature } from './utils';

describe('Signature Verification', () => {
    it('should verify valid signatures', async () => {
        const payload = '{"task":{"type":"webhook:retry","payload":{}}}';
        const secret = 'test-secret';
        const timestamp = '1640995200';

        // Generate a valid signature using timestamp.payload format
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign'],
        );
        const signatureBuffer = await crypto.subtle.sign(
            'HMAC',
            key,
            encoder.encode(`${timestamp}.${payload}`),
        );
        const signatureHash = Array.from(new Uint8Array(signatureBuffer))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');

        // Create signature header in the correct format
        const signatureHeader = `t=${timestamp},v1=${signatureHash}`;

        const isValid = await verifyIntegrationSignature(payload, signatureHeader, secret);
        expect(isValid).toBe(true);
    });

    it('should reject invalid signatures', async () => {
        const payload = '{"task":{"type":"webhook:retry","payload":{}}}';
        const secret = 'test-secret';
        const invalidSignatureHeader = 't=1640995200,v1=invalid-signature';

        const isValid = await verifyIntegrationSignature(payload, invalidSignatureHeader, secret);
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
        const timestamp = '1640995200';

        // Generate signature with wrong secret
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(wrongSecret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign'],
        );
        const signatureBuffer = await crypto.subtle.sign(
            'HMAC',
            key,
            encoder.encode(`${timestamp}.${payload}`),
        );
        const wrongSignatureHash = Array.from(new Uint8Array(signatureBuffer))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');

        // Create signature header with wrong signature
        const wrongSignatureHeader = `t=${timestamp},v1=${wrongSignatureHash}`;

        // Verify against the correct secret (should fail)
        const isValid = await verifyIntegrationSignature(payload, wrongSignatureHeader, secret);
        expect(isValid).toBe(false);
    });

    it('should accept signatures with correct secret', async () => {
        const payload = '{"task":{"type":"webhook:retry","payload":{}}}';
        const secret = 'test-secret';
        const timestamp = '1640995200';

        // Generate signature with correct secret
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign'],
        );
        const signatureBuffer = await crypto.subtle.sign(
            'HMAC',
            key,
            encoder.encode(`${timestamp}.${payload}`),
        );
        const correctSignatureHash = Array.from(new Uint8Array(signatureBuffer))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');

        // Create signature header with correct signature
        const correctSignatureHeader = `t=${timestamp},v1=${correctSignatureHash}`;

        // Verify against the correct secret (should pass)
        const isValid = await verifyIntegrationSignature(payload, correctSignatureHeader, secret);
        expect(isValid).toBe(true);
    });
});
