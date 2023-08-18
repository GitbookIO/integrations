import { slackAPI } from '../slack';
import { QueryDisplayBlock } from '../ui/blocks';
import { getInstallationConfig } from '../utils';
import { createMessageThreadRecording } from './gitbook';

export async function documentConversation({ team, channelId, thread_ts, user, context }) {
    const { environment } = context;
    console.log('start recording=======');

    const recording = await createMessageThreadRecording(context, {
        team_id: team.id,
        channel: channelId,
        thread_ts,
    });

    console.log('end recording=======', recording);

    const { accessToken } = await getInstallationConfig(context, team.id);

    await slackAPI(
        context,
        {
            method: 'POST',
            path: 'chat.postMessage',
            payload: {
                channel: user.id,
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: 'Thread saved successfully! :tada:\n',
                        },
                    },
                    ...QueryDisplayBlock({
                        queries: recording.followupQuestions,
                        heading: 'Try it out to with one of these questsions:',
                    }),
                ],

                thread_ts,
                user: user.id,
            },
        },
        { accessToken }
    );

    // Add custom header(s)
    return new Response(null, {
        status: 200,
    });
}
