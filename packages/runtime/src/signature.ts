import { IntegrationEnvironment } from '@gitbook/api';

export async function verifyIntegrationSignature(
    request: Request,
    environment: IntegrationEnvironment,
): Promise<boolean> {
    const secret = environment.signingSecrets.integration;
    const gitbookSignature = request.headers.get('x-gitbook-integration-signature') ?? '';
    const payload = await request.clone().text();

    if (!gitbookSignature) {
        return false;
    }

    const algorithm = { name: 'HMAC', hash: 'SHA-256' };
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(secret), algorithm, false, [
        'sign',
        'verify',
    ]);
    const signed = await crypto.subtle.sign(algorithm.name, key, enc.encode(payload));
    const expectedSignature = [...new Uint8Array(signed)]
        .map((x) => x.toString(16).padStart(2, '0'))
        .join('');

    // @ts-expect-error - Cloudflare supports timingSafeEqual
    return crypto.subtle.timingSafeEqual(
        enc.encode(expectedSignature),
        enc.encode(gitbookSignature),
    );
}
