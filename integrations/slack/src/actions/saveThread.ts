import { slackAPI } from '../slack';
import { GeneratedDocLinkBlock, QueryDisplayBlock } from '../ui/blocks';
import { getInstallationConfig } from '../utils';
import { createMessageThreadRecording } from './gitbook';

export async function saveThread({ teamId, channelId, thread_ts, userId, context }) {
    const { environment } = context;

    const { recording, followupQuestions } = await createMessageThreadRecording(context, {
        team_id: teamId,
        channel: channelId,
        thread_ts,
    });

    console.log('recording===', recording, followupQuestions);

    const { accessToken } = await getInstallationConfig(context, teamId);

    await slackAPI(
        context,
        {
            method: 'POST',
            path: 'chat.postMessage',
            payload: {
                channel: channelId,
                blocks: [
                    ...GeneratedDocLinkBlock({ url: recording.url }),
                    ...QueryDisplayBlock({
                        queries: followupQuestions,
                        heading: 'Here some questions this thread can help answer:',
                    }),
                ],
                // attachments: [
                //     {
                //         color: '#346ddb',
                //         blocks: [
                //             ...GeneratedDocLinkBlock({ url: recording.url }),
                //             ...QueryDisplayBlock({
                //                 queries: followupQuestions,
                //                 heading: 'Here some questions this thread can help answer:',
                //             }),
                //         ],
                //     },
                // ],
                thread_ts,
                user: userId,
                unfurl_links: false,
            },
        },
        { accessToken }
    );

    // Add custom header(s)
    return new Response(null, {
        status: 200,
    });
}
