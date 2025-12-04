import { Logger } from '@gitbook/runtime';
import { GitHubIssuesRuntimeContext } from './types';

const logger = Logger('github-issues:webhook');

/**
 * Verify a GitHub webhook signature.
 *
 * {@link https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries}
 */
export async function verifyGitHubWebhookSignature(
    request: Request,
    rawBody: string,
    context: GitHubIssuesRuntimeContext,
): Promise<boolean> {
    const signature = request.headers.get('x-hub-signature-256');
    const webhookSecret = context.environment.secrets.WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
        return false;
    }

    try {
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(webhookSecret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign'],
        );

        const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
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
