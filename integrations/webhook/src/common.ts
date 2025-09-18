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

// Task types for webhook retry
export type IntegrationTaskType = 'webhook:retry';

export type BaseIntegrationTask<Type extends IntegrationTaskType, Payload extends object> = {
    type: Type;
    payload: Payload;
};

export type IntegrationTaskWebhookRetry = BaseIntegrationTask<
    'webhook:retry',
    {
        event: Event;
        webhookUrl: string;
        secret: string;
        retryCount: number;
        timestamp: number;
        signature: string;
    }
>;

export type IntegrationTask = IntegrationTaskWebhookRetry;

export type WebhookRuntimeContext = RuntimeContext<RuntimeEnvironment<{}, WebhookConfiguration>>;

/**
 * Queue a webhook retry task using the integration task system
 */
export async function queueWebhookRetryTask(
    context: WebhookRuntimeContext,
    task: IntegrationTaskWebhookRetry,
): Promise<void> {
    const { api, environment } = context;

    // Calculate delay in seconds (exponential backoff with jitter)
    const baseDelayMs = BASE_DELAY * Math.pow(2, task.payload.retryCount);
    const jitter = Math.random() * 0.1 * baseDelayMs;
    const delayMs = Math.floor(baseDelayMs + jitter);
    const delaySeconds = Math.ceil(delayMs / 1000);

    await api.integrations.queueIntegrationTask(environment.integration.name, {
        task: {
            type: task.type,
            payload: task.payload,
        },
        schedule: delaySeconds,
    });
}

/**
 * Shared webhook delivery logic
 */
export async function deliverWebhook(
    context: WebhookRuntimeContext,
    event: Event,
    webhookUrl: string,
    secret: string,
    timestamp: number,
    signature: string,
    retryCount: number,
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
                retryCount,
                status: response.status,
                statusText: response.statusText,
            });

            // Retry on server errors (5xx) and rate limiting (429)
            if (retryCount < MAX_RETRIES && (response.status >= 500 || response.status === 429)) {
                await queueWebhookRetryTask(context, {
                    type: 'webhook:retry',
                    payload: {
                        event,
                        webhookUrl,
                        secret,
                        retryCount: retryCount + 1,
                        timestamp,
                        signature,
                    },
                });
                return;
            }

            throw new Error(errorMessage);
        }

        logger.debug(`Webhook delivered successfully for event ${event.type}`, {
            url: webhookUrl,
            eventType: event.type,
            retryCount,
            responseTime: Date.now() - startTime,
        });
    } catch (error) {
        const errorMessage = `Webhook delivery error: ${error instanceof Error ? error.message : String(error)}`;
        logger.error(errorMessage, {
            url: webhookUrl,
            eventType: event.type,
            retryCount,
            errorName: error instanceof Error ? error.name : 'Unknown',
        });

        // Retry on network errors and timeouts
        if (
            retryCount < MAX_RETRIES &&
            error instanceof Error &&
            (error.name === 'AbortError' ||
                error.name === 'TimeoutError' ||
                error.message.includes('fetch') ||
                error.message.includes('ECONNREFUSED') ||
                error.message.includes('ENOTFOUND') ||
                error.message.includes('ETIMEDOUT') ||
                error.message.includes('ECONNRESET'))
        ) {
            await queueWebhookRetryTask(context, {
                type: 'webhook:retry',
                payload: {
                    event,
                    webhookUrl,
                    secret,
                    retryCount: retryCount + 1,
                    timestamp,
                    signature,
                },
            });
            return;
        }

        if (retryCount >= MAX_RETRIES) {
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

/**
 * Verify integration task signature using HMAC-SHA256
 */
export async function verifyIntegrationSignature(
    payload: string,
    signature: string,
    secret: string,
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
        const signed = await crypto.subtle.sign(algorithm.name, key, encoder.encode(payload));
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
