import { createIntegration, Logger } from '@gitbook/runtime';
import { Event } from '@gitbook/api';

import { configComponent } from './config';
import {
    MAX_RETRIES,
    REQUEST_TIMEOUT,
    WebhookRuntimeContext,
    retryWithDelay,
    EventType,
} from './common';

const logger = Logger('webhook');

/**
 * Common webhook delivery handler for all event types
 */
export const handleWebhookEvent = async (args: {
    event: Event;
    context: WebhookRuntimeContext;
    webhookUrl: string;
    secret: string;
    skipEventTypeCheck?: boolean;
}) => {
    const { event, context, webhookUrl, secret, skipEventTypeCheck } = args;
    const { environment } = context;
    const spaceInstallation = environment.spaceInstallation;

    if (!spaceInstallation) {
        logger.debug('No space installation found');
        return;
    }

    const config = spaceInstallation.configuration;

    // Check if this event type is supported and enabled (skip for test webhooks)
    if (!skipEventTypeCheck) {
        if (
            !Object.values(EventType).includes(event.type as EventType) ||
            !config[event.type as EventType]
        ) {
            logger.debug(`Event ${event.type} is not enabled`);
            return;
        }
    }

    // Prepare webhook payload
    const jsonPayload = JSON.stringify({
        event_type: event.type,
        event_data: event,
        timestamp: new Date().toISOString(),
        installation: {
            integration: spaceInstallation.integration,
            installation: spaceInstallation.installation,
            space: spaceInstallation.space,
        },
    });

    // Add HMAC signature for webhook verification
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign'],
    );
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(jsonPayload));
    const signature = Array.from(new Uint8Array(signatureBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

    const sendWebhookWithRetry = async (retryCount = 0): Promise<void> => {
        const startTime = Date.now();
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-GitBook-Signature': `sha256=${signature}`,
                },
                body: jsonPayload,
                signal: AbortSignal.timeout(REQUEST_TIMEOUT),
            });

            if (!response.ok) {
                const errorMessage = `Webhook delivery failed: ${response.status} ${response.statusText}`;
                logger.error(errorMessage, {
                    url: config.webhook_url,
                    eventType: event.type,
                    retryCount,
                    status: response.status,
                    statusText: response.statusText,
                });

                // Retry on server errors (5xx) and rate limiting (429)
                if (
                    retryCount < MAX_RETRIES &&
                    (response.status >= 500 || response.status === 429)
                ) {
                    return retryWithDelay(
                        retryCount,
                        () => sendWebhookWithRetry(retryCount + 1),
                        logger,
                    );
                }

                throw new Error(errorMessage);
            }

            logger.debug(`Webhook delivered successfully for event ${event.type}`, {
                url: config.webhook_url,
                eventType: event.type,
                retryCount,
                responseTime: Date.now() - startTime,
            });
        } catch (error) {
            const errorMessage = `Webhook delivery error: ${error instanceof Error ? error.message : String(error)}`;
            logger.error(errorMessage, {
                url: config.webhook_url,
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
                return retryWithDelay(
                    retryCount,
                    () => sendWebhookWithRetry(retryCount + 1),
                    logger,
                );
            }

            if (retryCount >= MAX_RETRIES) {
                logger.error(
                    `Webhook delivery failed after ${MAX_RETRIES} retries for event ${event.type}`,
                    {
                        url: config.webhook_url,
                        eventType: event.type,
                        finalError: errorMessage,
                    },
                );
            }

            throw error;
        }
    };

    context.waitUntil(sendWebhookWithRetry());
};

/**
 * Wrapper for webhook events that uses saved configuration
 */
const handleConfiguredWebhookEvent = async (event: Event, context: WebhookRuntimeContext) => {
    const { environment } = context;
    const spaceInstallation = environment.spaceInstallation;

    if (!spaceInstallation) {
        logger.debug('No space installation found');
        return;
    }

    return handleWebhookEvent({
        event,
        context,
        webhookUrl: spaceInstallation.configuration.webhook_url,
        secret: spaceInstallation.configuration.secret,
    });
};

export default createIntegration<WebhookRuntimeContext>({
    components: [configComponent],
    events: {
        [EventType.SPACE_CONTENT_UPDATED]: handleConfiguredWebhookEvent,
        [EventType.SPACE_VISIBILITY_UPDATED]: handleConfiguredWebhookEvent,
        [EventType.PAGE_FEEDBACK]: handleConfiguredWebhookEvent,
    },
});
