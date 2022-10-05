import { FetchEventCallback } from '@gitbook/runtime';

import { SlackRuntimeContext } from './configuration';

/**
 * Handle an event from Slack.
 */
export function createSlackEventsHandler(handlers: {
    [type: string]: (event: object, context: SlackRuntimeContext) => Promise<any>;
}): FetchEventCallback {
    return async (request, context) => {
        const event = await request.json<{ event?: { type: string }; type?: string }>();

        if (!event.type) {
            return new Response(`Invalid event`, {
                status: 422,
            });
        }

        const eventType = event.event?.type || event.type;
        const handler = handlers[eventType];
        if (!handler) {
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
