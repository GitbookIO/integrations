import { FetchEventCallback } from '@gitbook/runtime';

import { recordThread } from './actions/gitbook';
import { SlackRuntimeContext } from './configuration';
import { slackAPI } from './slack';

/**

 * Handle an event from Slack.
 */
export function createSlackShortcutsHandler(
    handlers: {
        [type: string]: (event: object, context: SlackRuntimeContext) => Promise<any>;
    },
    fallback?: FetchEventCallback
): FetchEventCallback {
    return async (request, context) => {
        const { api, environment } = context;
        const requestText = await request.text();
        const shortcutEvent = Object.fromEntries(new URLSearchParams(requestText).entries());
        const shortcutPayload = JSON.parse(shortcutEvent.payload);
        // Clone the request so its body is still available to the fallback
        // const event = await request.clone().json<{ event?: { type: string }; type?: string }>();

        console.log('shortcutPayload', shortcutPayload);
        const { channel, message, team, user, response_url } = shortcutPayload;

        // console.log('event', event);

        // await addRecording(api, event.event, environment.secrets.BOT_TOKEN);

        const recordThreadRes = await recordThread(context, {
            team_id: team.id,
            channel: channel.id,
            thread_ts: message.thread_ts,
        });

        const res = await slackAPI(
            context,
            {
                method: 'POST',
                path: 'chat.postEphemeral',
                payload: {
                    channel: channel.id,
                    blocks: [
                        {
                            type: 'section',
                            text: {
                                type: 'mrkdwn',
                                text: 'Your new docs are ready :tada\n',
                            },
                        },
                        {
                            type: 'section',
                            text: {
                                type: 'mrkdwn',
                                text: 'Have a look for your yourself and share in the thread',
                            },
                            accessory: {
                                type: 'button',
                                text: {
                                    type: 'plain_text',
                                    text: 'Preview',
                                    emoji: true,
                                },
                                value: 'click_me_123',
                                action_id: 'button-action',
                            },
                        },
                        {
                            type: 'divider',
                        },
                        {
                            type: 'actions',
                            elements: [
                                {
                                    type: 'button',
                                    text: {
                                        type: 'plain_text',
                                        emoji: true,
                                        text: 'Approve',
                                    },
                                    style: 'primary',
                                    value: 'click_me_123',
                                },
                                {
                                    type: 'button',
                                    text: {
                                        type: 'plain_text',
                                        emoji: true,
                                        text: 'Delete',
                                    },
                                    style: 'danger',
                                    value: 'click_me_123',
                                },
                            ],
                        },
                    ],

                    // text: `All done, check it out ${recordThreadRes.url}`,
                    thread_ts: message.thread_ts,
                    user: user.id,
                },
            },
            { accessToken: environment.secrets.BOT_TOKEN }
        );

        // Add custom header(s)
        return new Response(null, {
            status: 200,
        });
    };
}

//   token: '1W4r987ZaX2XbnrkVvfdEzQQ',
//   action_ts: '1692187902.226777',
//   team: { id: 'T032HV6MF', domain: 'gitbook' },
//   user: {
//     id: 'U03S41KSY8M',
//     username: 'valentino',
//     team_id: 'T032HV6MF',
//     name: 'valentino'
//   },
//   channel: { id: 'C05M1K6RTD4', name: 'tmp-slack-integration-valentino' },
//   is_enterprise_install: false,
//   enterprise: null,
//   callback_id: 'generate_docs',
//   trigger_id: '5749554069538.3085992729.84e5c8b2c3f206a0a64417a02cb6270d',
//   response_url: 'https://hooks.slack.com/app/T032HV6MF/5735015787015/6zzBIWRLpw6sm438oUpTxC2h',
//   message_ts: '1692106894.378009',
//   message: {
//     bot_id: 'B05MND68QVC',
//     type: 'message',
//     text: 'Hm, I had the case where it would hang at this point, but it was related to changes to our mySQL database and the CLI was waiting for a prompt answer (y/n) higher in the logs.\n' +
//       'Can you check if you have anything earlier that could be blocking too?',
//     user: 'U03S41KSY8M',
//     ts: '1692106894.378009',
//     app_id: 'A05M82VRGPM',
//     blocks: [ [Object] ],
//     team: 'T032HV6MF',
//     bot_profile: {
//       id: 'B05MND68QVC',
//       deleted: false,
//       name: 'GitBook (valentino-dev)',
//       updated: 1692103834,
//       app_id: 'A05M82VRGPM',
//       icons: [Object],
//       team_id: 'T032HV6MF'
//     },
//     thread_ts: '1692106894.088119',
//     parent_user_id: 'U03S41KSY8M'
