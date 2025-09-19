import { createIntegration, Logger } from '@gitbook/runtime';
import { Event } from '@gitbook/api';

import { config } from './config';
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

    // Get account-level configuration (webhookUrl and secret)
    const accountConfig = environment.installation?.configuration;
    if (!accountConfig?.webhookUrl || !accountConfig?.secret) {
        logger.debug('Account-level webhook configuration not found');
        return;
    }

    // Get event preferences from space/site installation
    const installation = environment.spaceInstallation || environment.siteInstallation;
    if (!installation) {
        logger.debug('No space or site installation found');
        return;
    }

    const eventConfig = installation.configuration;

    // Check if this event type is supported and enabled
    if (!EVENT_TYPES.includes(event.type as EventType) || !eventConfig[event.type as EventType]) {
        logger.debug(`Event ${event.type} is not enabled`);
        return;
    }

    const timestamp = Math.floor(new Date().getTime() / 1000);

    // Prepare webhook payload
    const jsonPayload = JSON.stringify(event);

    // Generate HMAC signature for webhook verification
    const signature = await generateHmacSignature({
        payload: jsonPayload,
        secret: accountConfig.secret,
        timestamp,
    });

    context.waitUntil(
        deliverWebhook(
            context,
            event,
            accountConfig.webhookUrl,
            accountConfig.secret,
            timestamp,
            signature,
        ),
    );
};

const events: Record<EventType, typeof handleWebhookEvent> = {
    [EventType.SITE_VIEW]: handleWebhookEvent,
    [EventType.CONTENT_UPDATED]: handleWebhookEvent,
    [EventType.PAGE_FEEDBACK]: handleWebhookEvent,
};

export default createIntegration<WebhookRuntimeContext>({
    components: [config],
    events,
});
