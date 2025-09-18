import { createIntegration, Logger, FetchEventCallback, ExposableError } from '@gitbook/runtime';
import { Event } from '@gitbook/api';

import { configComponent } from './config';
import {
    MAX_RETRIES,
    WebhookRuntimeContext,
    EventType,
    EVENT_TYPES,
    generateHmacSignature,
    IntegrationTask,
    deliverWebhook,
    verifyIntegrationSignature,
} from './common';

const logger = Logger('webhook');

/**
 * Handle webhook retry tasks
 */
export const handleWebhookRetryTask = async (
    task: IntegrationTask,
    context: WebhookRuntimeContext,
) => {
    const { payload } = task;
    const { event, webhookUrl, secret, retryCount, timestamp, signature } = payload;

    logger.debug(
        `Processing webhook retry task for event ${event.type} (attempt ${retryCount + 1}/${MAX_RETRIES})`,
    );

    await deliverWebhook(context, event, webhookUrl, secret, timestamp, signature, retryCount);
};

/**
 * Common webhook delivery handler for all event types
 */
const handleWebhookEvent = async (event: Event, context: WebhookRuntimeContext) => {
    const { environment } = context;
    const spaceInstallation = environment.spaceInstallation;

    if (!spaceInstallation) {
        logger.debug('No space installation found');
        return;
    }

    const config = spaceInstallation.configuration;

    // Check if this event type is supported and enabled
    if (!EVENT_TYPES.includes(event.type as EventType) || !config[event.type as EventType]) {
        logger.debug(`Event ${event.type} is not enabled`);
        return;
    }

    const timestamp = Math.floor(new Date().getTime() / 1000);

    // Prepare webhook payload
    const jsonPayload = JSON.stringify(event);

    // Generate HMAC signature for webhook verification
    const signature = await generateHmacSignature({
        payload: jsonPayload,
        secret: config.secret,
        timestamp,
    });

    context.waitUntil(
        deliverWebhook(context, event, config.webhookUrl, config.secret, timestamp, signature, 0),
    );
};

const events: Record<EventType, typeof handleWebhookEvent> = {
    [EventType.SITE_VIEW]: handleWebhookEvent,
    [EventType.CONTENT_UPDATED]: handleWebhookEvent,
    [EventType.PAGE_FEEDBACK]: handleWebhookEvent,
};

export default createIntegration<WebhookRuntimeContext>({
    components: [configComponent],
    events,
    fetch: async (request, context) => {
        const { environment } = context;
        const url = new URL(request.url);

        if (url.pathname === '/tasks' && request.method === 'POST') {
            const signature = request.headers.get('x-gitbook-integration-signature') ?? '';
            const payloadString = await request.text();

            // Verify the signature cryptographically
            const verified = await verifyIntegrationSignature(
                payloadString,
                signature,
                environment.signingSecrets.integration,
            );

            if (!verified) {
                const message = `Invalid signature for integration task`;
                logger.error(message);
                throw new ExposableError(message);
            }

            const { task } = JSON.parse(payloadString) as { task: IntegrationTask };
            logger.debug('received integration task', task);

            context.waitUntil(
                (async () => {
                    await handleWebhookRetryTask(task, context);
                })(),
            );

            return new Response(JSON.stringify({ acknowledged: true }), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        }

        return new Response('Not found', { status: 404 });
    },
});
