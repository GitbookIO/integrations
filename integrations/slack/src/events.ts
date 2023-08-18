import { FetchEventCallback } from '@gitbook/runtime';

import { createMessageThreadRecording } from './actions/gitbook';
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
        const { api, environment } = context;
        // Clone the request so its body is still available to the fallback
        const event = await request.clone().json<{ event?: { type: string }; type?: string }>();

        // console.log('event', event);

        const { ts, thread_ts, parent_user_id, channel, event_ts, team_id } = event.event;

        const recording = await createMessageThreadRecording(context, {
            team_id,
            channel,
            thread_ts,
        });

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
