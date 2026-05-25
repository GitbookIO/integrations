/**
 * Verify integration task signature using HMAC-SHA256
 * Parses the X-GitBook-Signature header format: t=timestamp,v1=signature
 */
export async function verifyIntegrationSignature(
    payload: string,
    signatureHeader: string,
    secret: string,
): Promise<boolean> {
    if (!signatureHeader) {
        return false;
    }

    try {
        // Parse signature format: t=timestamp,v1=hash
        const parts = signatureHeader.split(',');
        let timestamp: string | undefined;
        let hash: string | undefined;

        for (const part of parts) {
            if (part.startsWith('t=')) {
                timestamp = part.substring(2);
            } else if (part.startsWith('v1=')) {
                hash = part.substring(3);
            }
        }

        if (!timestamp || !hash) {
            return false;
        }

        const algorithm = { name: 'HMAC', hash: 'SHA-256' };
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey('raw', encoder.encode(secret), algorithm, false, [
            'sign',
            'verify',
        ]);

        // Generate expected signature using timestamp.payload format
        const dataToSign = `${timestamp}.${payload}`;
        const signed = await crypto.subtle.sign(algorithm.name, key, encoder.encode(dataToSign));
        const expectedSignature = Array.from(new Uint8Array(signed))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');

        // Use constant-time comparison to prevent timing attacks
        return safeCompare(expectedSignature, hash);
    } catch (error) {
        return false;
    }
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function safeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
        return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
}
