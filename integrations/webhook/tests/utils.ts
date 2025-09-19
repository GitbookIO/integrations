/**
 * Verify integration task signature using HMAC-SHA256
 */
export async function verifyIntegrationSignature(
    payload: string,
    signature: string,
    secret: string,
    timestamp?: number,
): Promise<boolean> {
    if (!signature) {
        return false;
    }

    try {
        const algorithm = { name: 'HMAC', hash: 'SHA-256' };
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey('raw', encoder.encode(secret), algorithm, false, [
            'sign',
            'verify',
        ]);

        // Use timestamp.payload format if timestamp is provided, otherwise just payload
        const dataToSign = timestamp ? `${timestamp}.${payload}` : payload;
        const signed = await crypto.subtle.sign(algorithm.name, key, encoder.encode(dataToSign));
        const expectedSignature = Array.from(new Uint8Array(signed))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');

        // Use constant-time comparison to prevent timing attacks
        return safeCompare(expectedSignature, signature);
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
