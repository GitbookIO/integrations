import { FetchEventCallback } from '@gitbook/runtime';

import { queryLens } from './actions/queryLens';
import { saveThread } from './actions/saveThread';
import { SlackRuntimeContext } from './configuration';
import { isSaveThreadEvent, parseEventPayload, stripBotName } from './utils';

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

        const { type, text, bot_id, thread_ts, channel, user, team_id } = eventPayload.event;

        const saveThreadEvent = isSaveThreadEvent(type, text);

        // check for bot_id so that the bot doesn't trigger itself
        if (['message', 'app_mention'].includes(type) && !bot_id) {
            if (saveThreadEvent) {
                const data = await saveThread({
                    teamId: team_id,
                    channelId: channel,
                    thread_ts,
                    userId: user,
                    context,
                });
            } else {
                // strip out the bot-name in the mention and account for user mentions within the query
                const parsedQuery = stripBotName(text, eventPayload.authorizations[0]?.user_id);

                // send to Lens
                await queryLens({
                    teamId: team_id,
                    channelId: channel,
                    threadId: thread_ts,
                    userId: user,
                    messageType: 'permanent',
                    text: parsedQuery,
                    context,
                });
            }
        }

        // Add custom header(s)
        return new Response(null, {
            status: 200,
        });
    };
}
