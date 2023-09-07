import { FetchEventCallback } from '@gitbook/runtime';

import { SlackRuntimeContext } from '../configuration';
import { parseEventPayload } from '../utils';

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
        const eventPayload = await parseEventPayload(request);
        const { type, bot_id } = eventPayload.event;

        const handler = handlers[type];

        // check if we are handling this event at this stage. if not, forward on to the fallback
        if (!handler) {
            if (fallback) {
                return fallback(request, context);
            }

            return new Response(`No handler for event type "${type}"`, {
                status: 404,
            });
        }

        // check for bot_id so that the bot doesn't trigger itself
        if (bot_id) {
            return new Response(null, {
                status: 200,
            });
        }

        const handlerPromise = handler(eventPayload, context);

        context.waitUntil(handlerPromise);
    };
}
