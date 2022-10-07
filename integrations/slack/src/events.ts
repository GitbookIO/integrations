import { FetchEventCallback } from '@gitbook/runtime';

import { SlackRuntimeContext } from './configuration';

/**
 * Handle an event from Slack.
 */
export function createSlackEventsHandler(
    handlers: {
        [type: string]: (event: object, context: SlackRuntimeContext) => Promise<any>;
    },
    fallback?: FetchEventCallback
): FetchEventCallback {
    return async (request, context) => {
        // Clone the request so its body is still available to the fallback
        const event = await request.clone().json<{ event?: { type: string }; type?: string }>();

        if (!event.type) {
            return new Response(`Invalid event`, {
                status: 422,
            });
        }

        const eventType = event.event?.type || event.type;
        // Find the handle for the event type, or use the fallback if that's missing
        const handler = handlers[eventType];
        if (!handler) {
            if (fallback) {
                return fallback(request, context);
            }

            return new Response(`No handler for event type "${eventType}"`, {
                status: 404,
            });
        }

        const data = await handler(event, context);

        if (typeof data === 'string') {
            return new Response(data, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
        }

        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    };
}
