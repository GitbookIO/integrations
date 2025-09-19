import { createIntegration, Logger } from '@gitbook/runtime';
import { Event } from '@gitbook/api';

import { configComponent } from './config';
import {
    WebhookRuntimeContext,
    EventType,
    EVENT_TYPES,
    generateHmacSignature,
    deliverWebhook,
} from './common';

const logger = Logger('webhook');

/**
 * Common webhook delivery handler for all event types
 */
const handleWebhookEvent = async (event: Event, context: WebhookRuntimeContext) => {
    const { environment } = context;

    // Get configuration from whichever installation type is available
    const installation = environment.spaceInstallation || environment.siteInstallation;

    // For organization-level installations, check the installation configuration
    let config: any;
    if (installation) {
        config = installation.configuration;
    } else if (environment.installation) {
        config = environment.installation.configuration;
    } else {
        logger.debug('No installation found');
        return;
    }

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
        deliverWebhook(context, event, config.webhookUrl, config.secret, timestamp, signature),
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
        return new Response('Not found', { status: 404 });
    },
});
