import { FetchEventCallback } from '@gitbook/runtime';

import { recordThread } from './actions/gitbook';
import { SlackRuntimeContext } from './configuration';

function slackTimestampToISOFormat(slackTs) {
    const timestampInMilliseconds = parseFloat(slackTs) * 1000;

    const date = new Date(timestampInMilliseconds);

    const formattedDate = date.toISOString();

    return formattedDate;
}

async function addRecording(api, slackEvent, slackBotToken) {
    const { team_id, channel, thread_ts } = slackEvent;
    // Lookup the concerned installations
    const {
        data: { items: installations },
    } = await api.integrations.listIntegrationInstallations('slack', {
        externalId: team_id,
    });

    const installation = installations[0];
    if (!installation) {
        return {};
    }

    // console.log('installation id ', installation.id);
    // Authentify as the installation
    const installationApiClient = await api.createInstallationClient('slack', installation.id);

    const slackRes = await fetch(
        `https://slack.com/api/conversations.replies?channel=${channel}&ts=${thread_ts}`,
        {
            headers: {
                Authorization: `Bearer ${slackBotToken}`,
            },
        }
    );

    const threadPosts = (await slackRes.json()).messages ?? [];
    // console.log('threaded messages', threadPosts);

    const orgId = 'TdvOhBZeNlhXIANE35Zl';
    const spaceId = 'sobfe0QALfpHjq2hgfhd';

    // const spacesRes = await api.orgs.listSpacesInOrganizationById(orgId);
    // const spaces = spacesRes.data;

    // console.log('spaces', spaces);
    // start recording
    console.log('startRecording ======');
    const startRecordingRes = await installationApiClient.orgs.startRecording(orgId, {
        space: spaceId,
        context: 'chat',
    });

    const recording = startRecordingRes.data;

    // console.log('recording', recording);

    const events = threadPosts.map((post) => {
        const { text, user, ts, thread_ts } = post;

        let messageType = 'message.reply';
        if (ts === thread_ts) {
            messageType = 'message';
        }

        return { type: messageType, text, user, timestamp: slackTimestampToISOFormat(ts) };
    });

    // console.log('events', events);

    await installationApiClient.orgs.addEventsToRecording(orgId, recording.id, {
        events,
    });

    // stop recording
    const stopRecordingRes = await installationApiClient.orgs.stopRecording(orgId, recording.id, {
        space: spaceId,
    });
    const stopRecording = stopRecordingRes.data;
    console.log('stopRecording', stopRecording);

    const params = new URLSearchParams();
    params.set('channel', channel);
    params.set('thread_ts', thread_ts);
    params.set('text', stopRecording.url);
    console.log('post message start === ');
    const slackPostRes = await fetch(`https://slack.com/api/chat.postMessage`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${slackBotToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });
    console.log('post message end === ', slackPostRes);
}

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
        const { ts, thread_ts, parent_user_id, channel, event_ts, team_id } = event.event;

        // await addRecording(api, event.event, environment.secrets.BOT_TOKEN);

        const recordingOutput = await recordThread(
            api,
            {
                team_id,
                channel,
                thread_ts,
            },
            environment.secrets.BOT_TOKEN
        );

        recordingOutput.url;

        // Add custom header(s)
        return new Response(null, {
            status: 200,
        });

        // const eventType = event.event?.type || event.type;
        // // Find the handle for the event type, or use the fallback if that's missing
        // const handler = handlers[eventType];
        // if (!handler) {
        //     if (fallback) {
        //         return fallback(request, context);
        //     }

        //     return new Response(`No handler for event type "${eventType}"`, {
        //         status: 404,
        //     });
        // }

        // const data = await handler(event, context);

        // if (typeof data === 'string') {
        //     return new Response(data, {
        //         headers: {
        //             'Content-Type': 'text/plain',
        //         },
        //     });
        // }

        // return new Response(JSON.stringify(data), {
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        // });
    };
}
