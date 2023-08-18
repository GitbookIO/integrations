import { slackAPI } from '../slack';
import { createMessageThreadRecording } from './gitbook';

export async function documentConversation({ team, channelId, message, user, context }) {
    const { environment } = context;

    const recording = await createMessageThreadRecording(context, {
        team_id: team.id,
        channel: channelId,
        thread_ts: message.thread_ts,
    });

    await slackAPI(
        context,
        {
            method: 'POST',
            path: 'chat.postEphemeral',
            payload: {
                channel: channelId,
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
}
