import { RuntimeContext, RuntimeEnvironment, Logger } from '@gitbook/runtime';
import { Event } from '@gitbook/api';

// Event types enum - only events that match our scopes
export enum EventType {
    SITE_VIEW = 'site_view',
    CONTENT_UPDATED = 'space_content_updated',
    PAGE_FEEDBACK = 'page_feedback',
}

// All Available events - mapped from enum to display names
export const AVAILABLE_EVENTS: Record<EventType, string> = {
    [EventType.SITE_VIEW]: 'Site views',
    [EventType.CONTENT_UPDATED]: 'Content updates',
    [EventType.PAGE_FEEDBACK]: 'Page feedbacks',
} as const;

// All event types as an array for iteration
export const EVENT_TYPES = Object.values(EventType);

// Retry configuration (delay and timeout are in ms)
export const MAX_RETRIES = 3;
export const BASE_DELAY = 1000;
export const REQUEST_TIMEOUT = 10000;

export type WebhookConfiguration = {
    webhookUrl: string;
    secret: string;
} & Record<EventType, boolean>;

export type WebhookRuntimeContext = RuntimeContext<RuntimeEnvironment<{}, WebhookConfiguration>>;

/**
 * Shared webhook delivery logic with built-in retry mechanism
 */
export async function deliverWebhook(
    context: WebhookRuntimeContext,
    event: Event,
    webhookUrl: string,
    secret: string,
    timestamp: number,
    signature: string,
    retriesLeft: number = MAX_RETRIES,
): Promise<void> {
    const logger = Logger('webhook');
    const jsonPayload = JSON.stringify(event);
    const startTime = Date.now();

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'GitBook-Webhook',
                'X-GitBook-Signature': `t=${timestamp},v1=${signature}`,
            },
            body: jsonPayload,
            signal: AbortSignal.timeout(REQUEST_TIMEOUT),
        });

        if (!response.ok) {
            const errorMessage = `Webhook delivery failed: ${response.status} ${response.statusText}`;
            logger.error(errorMessage, {
                url: webhookUrl,
                eventType: event.type,
                retriesLeft,
                status: response.status,
                statusText: response.statusText,
            });

            // Retry on server errors (5xx) and rate limiting (429)
            if (retriesLeft > 0 && (response.status >= 500 || response.status === 429)) {
                await retryWithDelay(
                    context,
                    event,
                    webhookUrl,
                    secret,
                    timestamp,
                    signature,
                    retriesLeft - 1,
                );
                return;
            }

            throw new Error(errorMessage);
        }

        logger.debug(`Webhook delivered successfully for event ${event.type}`, {
            url: webhookUrl,
            eventType: event.type,
            retriesLeft,
            responseTime: Date.now() - startTime,
        });
    } catch (error) {
        const errorMessage = `Webhook delivery error: ${error instanceof Error ? error.message : String(error)}`;
        logger.error(errorMessage, {
            url: webhookUrl,
            eventType: event.type,
            retriesLeft,
            errorName: error instanceof Error ? error.name : 'Unknown',
        });

        // Retry on network errors and timeouts
        if (
            retriesLeft > 0 &&
            error instanceof Error &&
            (error.name === 'AbortError' ||
                error.name === 'TimeoutError' ||
                error.message.includes('fetch') ||
                error.message.includes('ECONNREFUSED') ||
                error.message.includes('ENOTFOUND') ||
                error.message.includes('ETIMEDOUT') ||
                error.message.includes('ECONNRESET'))
        ) {
            await retryWithDelay(
                context,
                event,
                webhookUrl,
                secret,
                timestamp,
                signature,
                retriesLeft - 1,
            );
            return;
        }

        if (retriesLeft === 0) {
            logger.error(
                `Webhook delivery failed after ${MAX_RETRIES} retries for event ${event.type}`,
                {
                    url: webhookUrl,
                    eventType: event.type,
                    finalError: errorMessage,
                },
            );
        }

        throw error;
    }
}

/**
 * Retry webhook delivery with exponential backoff delay
 */
async function retryWithDelay(
    context: WebhookRuntimeContext,
    event: Event,
    webhookUrl: string,
    secret: string,
    timestamp: number,
    signature: string,
    retriesLeft: number,
): Promise<void> {
    const logger = Logger('webhook');

    // Calculate delay with exponential backoff and jitter
    const attemptNumber = MAX_RETRIES - retriesLeft + 1;
    const baseDelayMs = BASE_DELAY * Math.pow(2, attemptNumber - 1);
    const jitter = Math.random() * 0.1 * baseDelayMs;
    const delayMs = Math.floor(baseDelayMs + jitter);

    logger.debug(
        `Retrying webhook delivery in ${delayMs}ms (attempt ${attemptNumber + 1}/${MAX_RETRIES + 1})`,
        {
            url: webhookUrl,
            eventType: event.type,
            retriesLeft,
            delayMs,
        },
    );

    // Wait for the delay
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    // Recursively call deliverWebhook with decremented retries
    await deliverWebhook(context, event, webhookUrl, secret, timestamp, signature, retriesLeft);
}

export function generateSecret(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    const b64 = btoa(String.fromCharCode(...bytes));

    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function generateHmacSignature(args: {
    payload: string;
    secret: string;
    timestamp: number;
}): Promise<string> {
    const { payload, secret, timestamp } = args;

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
    const signature = Array.from(new Uint8Array(signatureBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

    return signature;
}
