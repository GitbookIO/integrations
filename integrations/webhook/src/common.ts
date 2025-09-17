import { RuntimeContext, RuntimeEnvironment, Logger } from '@gitbook/runtime';

// Event types enum - only events that match our scopes
export enum EventType {
    SPACE_CONTENT_UPDATED = 'space_content_updated',
    SPACE_VISIBILITY_UPDATED = 'space_visibility_updated',
    PAGE_FEEDBACK = 'page_feedback',
}

// All Available events - mapped from enum to display names
export const AVAILABLE_EVENTS: Record<EventType, string> = {
    [EventType.SPACE_CONTENT_UPDATED]: 'Space content updated',
    [EventType.SPACE_VISIBILITY_UPDATED]: 'Space visibility updated',
    [EventType.PAGE_FEEDBACK]: 'Page feedback',
} as const;

// All event types as an array for iteration
export const EVENT_TYPES = Object.values(EventType);

// Retry configuration (delay and timeout are in ms)
export const MAX_RETRIES = 3;
export const BASE_DELAY = 1000;
export const REQUEST_TIMEOUT = 10000;

export type WebhookConfiguration = {
    webhook_url: string;
    secret: string;
} & Record<EventType, boolean>;

export type WebhookRuntimeContext = RuntimeContext<RuntimeEnvironment<{}, WebhookConfiguration>>;

export const retryWithDelay = async (
    retryCount: number,
    sendWebhook: () => Promise<void>,
    logger: ReturnType<typeof Logger>,
): Promise<void> => {
    const baseDelay = BASE_DELAY * Math.pow(2, retryCount);
    const jitter = Math.random() * 0.1 * baseDelay;
    const delay = Math.floor(baseDelay + jitter);

    logger.debug(
        `Retrying webhook delivery in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`,
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
    return sendWebhook();
};
