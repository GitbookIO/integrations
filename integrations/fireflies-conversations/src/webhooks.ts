import type { IRequest } from 'itty-router';

import { ExposableError, Logger } from '@gitbook/runtime';
import { FirefliesRuntimeContext, FirefliesWebhookPayload } from './types';
import { fetchTranscriptById } from './conversations';
import { parseTranscriptAsGitBook } from './conversations';

const logger = Logger('fireflies-conversations:webhooks');

/**
 * Constant-time string comparison to prevent timing attacks.
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

/**
 * Verify Fireflies webhook signature using SHA-256 HMAC.
 * The signature is in the x-hub-signature header as a hex-encoded HMAC SHA-256 hash.
 */
async function verifyFirefliesWebhookSignature(
    payload: string,
    signature: string,
    secret: string,
): Promise<boolean> {
    if (!signature || !secret) {
        return false;
    }

    try {
        const encoder = new TextEncoder();
        const algorithm = { name: 'HMAC', hash: 'SHA-256' };
        const key = await crypto.subtle.importKey('raw', encoder.encode(secret), algorithm, false, [
            'sign',
        ]);

        const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
        const hashArray = Array.from(new Uint8Array(signatureBuffer));
        const computedSignature = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

        return safeCompare(computedSignature, signature);
    } catch (error) {
        logger.error('Failed to verify webhook signature', {
            error: error instanceof Error ? error.message : String(error),
        });
        return false;
    }
}

/**
 * Handle webhook request from Fireflies.
 */
export async function handleFirefliesWebhookRequest(
    request: IRequest,
    context: FirefliesRuntimeContext,
) {
    const { installation } = context.environment;
    if (!installation) {
        throw new ExposableError('Installation not found');
    }

    const webhookSecret = installation.configuration?.webhook_secret;
    if (!webhookSecret) {
        logger.warn('Webhook secret not configured, rejecting webhook request');
        return new Response('Webhook secret not configured', { status: 401 });
    }

    // Get the raw body for signature verification
    const rawBody = await request.text();
    if (!rawBody) {
        logger.warn('Empty webhook payload received');
        return new Response('Empty payload', { status: 400 });
    }

    // Verify webhook signature
    const signature = request.headers.get('x-hub-signature');
    if (!signature) {
        logger.warn('Missing x-hub-signature header');
        return new Response('Missing signature', { status: 401 });
    }

    const isValidSignature = await verifyFirefliesWebhookSignature(
        rawBody,
        signature,
        webhookSecret,
    );

    if (!isValidSignature) {
        logger.warn('Invalid webhook signature');
        return new Response('Invalid signature', { status: 401 });
    }

    // Parse webhook payload
    let payload: FirefliesWebhookPayload;
    try {
        payload = JSON.parse(rawBody) as FirefliesWebhookPayload;
    } catch (error) {
        logger.error('Failed to parse webhook payload', {
            error: error instanceof Error ? error.message : String(error),
        });
        return new Response('Invalid JSON payload', { status: 400 });
    }

    // Only process "Transcription completed" events
    if (payload.eventType !== 'Transcription completed') {
        logger.debug(`Ignoring webhook event type: ${payload.eventType}`);
        return new Response('OK', { status: 200 });
    }

    const meetingId = payload.meetingId;
    if (!meetingId) {
        logger.warn('Webhook payload missing meetingId');
        return new Response('Missing meetingId', { status: 400 });
    }

    logger.info(`Processing webhook for transcript ${meetingId}`, {
        eventType: payload.eventType,
        clientReferenceId: payload.clientReferenceId,
    });

    try {
        // Fetch the transcript from Fireflies
        const transcript = await fetchTranscriptById(context, meetingId);
        if (!transcript) {
            logger.warn(`Transcript not found: ${meetingId}`);
            return new Response('Transcript not found', { status: 404 });
        }

        // Convert to GitBook conversation format
        const gitbookConversation = await parseTranscriptAsGitBook(context, transcript);

        // Ingest the conversation
        await context.api.orgs.ingestConversation(installation.target.organization, [
            gitbookConversation,
        ]);

        logger.info(`Successfully ingested transcript ${meetingId} from webhook`);
        return new Response('OK', { status: 200 });
    } catch (error) {
        logger.error('Failed to process webhook', {
            meetingId,
            error: error instanceof Error ? error.message : String(error),
        });
        return new Response('Internal server error', { status: 500 });
    }
}
