import { RuntimeContext, RuntimeEnvironment, Logger } from '@gitbook/runtime';

// Event types enum - only events that match our scopes
export enum EventType {
    SPACE_CONTENT_UPDATED = 'space_content_updated',
    SPACE_VISIBILITY_UPDATED = 'space_visibility_updated',
    PAGE_FEEDBACK = 'page_feedback',
}

// All Available events - mapped from enum to display names
export const AVAILABLE_EVENTS: Record<EventType, string> = {
    [EventType.SPACE_CONTENT_UPDATED]: 'Space Content Updated',
    [EventType.SPACE_VISIBILITY_UPDATED]: 'Space Visibility Updated',
    [EventType.PAGE_FEEDBACK]: 'Page Feedback',
} as const;

// Events enabled by default - focusing on actionable events
export const DEFAULT_EVENTS: Record<EventType, boolean> = {
    [EventType.SPACE_CONTENT_UPDATED]: true,
    [EventType.SPACE_VISIBILITY_UPDATED]: true,
    [EventType.PAGE_FEEDBACK]: true,
};

// Description shown under the config toggles.
export const EVENT_DESCRIPTIONS: Record<EventType, string> = {
    [EventType.SPACE_CONTENT_UPDATED]: 'Occurs when the main content is updated.',
    [EventType.SPACE_VISIBILITY_UPDATED]: 'Occurs on space visibility changes.',
    [EventType.PAGE_FEEDBACK]: 'Occurs when users leave feedback on a page.',
};

// Retry configuration (delay and timeout are in ms)
export const MAX_RETRIES = 3;
export const BASE_DELAY = 1000;
export const REQUEST_TIMEOUT = 10000;

export type WebhookState = {
    webhook_url: string;
    events: Record<EventType, boolean>;
    secret: string;
};

export type WebhookRuntimeContext = RuntimeContext<RuntimeEnvironment<{}, WebhookState>>;

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
