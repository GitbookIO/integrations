import { FetchEventCallback } from '@gitbook/runtime';

import { createMessageThreadRecording } from './actions/gitbook';
import { queryLens } from './actions/queryLens';
import { saveThread } from './actions/saveThread';
import { SlackRuntimeContext } from './configuration';
import { isAppMentionSave } from './utils';

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
        const { api, environment } = context;
        // Clone the request so its body is still available to the fallback
        const event = await request.clone().json<{ event?: { type: string }; type?: string }>();

        console.log('event===', JSON.stringify(event));

        const {
            type,
            text,
            bot_id,
            ts,
            thread_ts,
            parent_user_id,
            channel,
            user,
            event_ts,
            team_id,
        } = event.event;

        const isCuration = isAppMentionSave(event.event);
        console.log('isCuration====', isCuration);

        console.log('TYPE', type);
        if (['message', 'app_mention'].includes(type)) {
            const { text } = event.event;

            if (isCuration) {
                await saveThread({
                    teamId: team_id,
                    channelId: channel,
                    thread_ts,
                    userId: user,
                    context,
                });
            } else {
                // stript out the bot-name in the mention and account for user mentions within the query
                const parsedQuery = text
                    .split(new RegExp(`^.+<@${event.authorizations[0]?.user_id}> `))
                    .join('');

                // send to Lens
                const data = await queryLens({
                    teamId: event.team_id,
                    channelId: event.event.channel,
                    threadId: thread_ts,
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

// client_msg_id: '43f363f5-fc93-4611-b9b5-2fcd81d23c49',
// type: 'app_mention',
// text: '<@U05M85YEXQA> test',
// user: 'U03S41KSY8M',
// ts: '1691811465.130489',
// blocks: [ [Object] ],
// team: 'T032HV6MF',
// thread_ts: '1691771028.338399',
// parent_user_id: 'U03S41KSY8M',
// channel: 'C05M1K6RTD4',
// event_ts: '1691811465.130489'
