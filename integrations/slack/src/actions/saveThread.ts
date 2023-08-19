import { slackAPI } from '../slack';
import { QueryDisplayBlock } from '../ui/blocks';
import { getInstallationConfig } from '../utils';
import { createMessageThreadRecording } from './gitbook';

export async function saveThread({ teamId, channelId, thread_ts, userId, context }) {
    const { environment } = context;

    const recording = await createMessageThreadRecording(context, {
        team_id: teamId,
        channel: channelId,
        thread_ts,
    });

    const { accessToken } = await getInstallationConfig(context, teamId);

    await slackAPI(
        context,
        {
            method: 'POST',
            path: 'chat.postMessage',
            payload: {
                channel: channelId,
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: 'Thread saved in GitBook :white_check_mark:',
                        },
                    },
                    ...QueryDisplayBlock({
                        queries: recording.followupQuestions,
                        heading: 'Here some questions this thread can help answer:',
                        displayFullQuery: true,
                    }),
                ],

                thread_ts,
                user: userId,
            },
        },
        { accessToken }
    );

    // Add custom header(s)
    return new Response(null, {
        status: 200,
    });
}
