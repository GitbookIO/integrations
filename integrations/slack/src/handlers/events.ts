import { FetchEventCallback } from '@gitbook/runtime';

import { SlackRuntimeContext } from '../configuration';
import { isAllowedToRespond, parseEventPayload } from '../utils';

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

        // url_verification doesn't have an event object
        const { type } = eventPayload.event ?? eventPayload;

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
        // check whether this was triggered from an external channel
        if (!isAllowedToRespond(eventPayload)) {
            return new Response(null, {
                status: 200,
            });
        }

        // a bit special case the `url_verification` event since it needs to return a `challenge`
        if (type === 'url_verification') {
            const handleResponse = await handler(eventPayload, context);
            return new Response(JSON.stringify(handleResponse), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        }

        const handlerPromise = handler(eventPayload, context);

        context.waitUntil(handlerPromise);
    };
}
