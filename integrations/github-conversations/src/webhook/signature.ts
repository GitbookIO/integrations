import { Logger } from '@gitbook/runtime';
import { GitHubRuntimeContext } from '../types';

const logger = Logger('github-conversations');

/**
 * Verify webhook signature and return error Response if verification fails
 * Returns null if verification succeeds
 */
export async function verifyWebhookSignature(
    request: Request,
    rawBody: string,
    context: GitHubRuntimeContext,
): Promise<Response | null> {
    const signature = request.headers.get('x-hub-signature-256');
    const webhookSecret = context.environment.secrets.WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
        logger.error('Missing required signature or webhook secret');
        return new Response('Unauthorized', { status: 401 });
    }

    const isValidSignature = await verifyGitHubSignature(signature, rawBody, webhookSecret);
    if (!isValidSignature) {
        logger.error('Invalid webhook signature received');
        return new Response('Unauthorized', { status: 401 });
    }

    return null; // Verification succeeded
}

/**
 * Verify GitHub webhook signature
 * https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries
 */
async function verifyGitHubSignature(
    signature: string,
    body: string,
    secret: string,
): Promise<boolean> {
    try {
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign'],
        );

        const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
        const hashArray = Array.from(new Uint8Array(signatureBuffer));
        const computedSignature =
            'sha256=' + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

        return computedSignature === signature;
    } catch (error) {
        logger.error('Failed to verify webhook signature', {
            error: error instanceof Error ? error.message : String(error),
        });
        return false;
    }
}
