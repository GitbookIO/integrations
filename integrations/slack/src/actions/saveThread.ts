import { SlackRuntimeContext } from '../configuration';
import { slackAPI } from '../slack';
import { ConversationSavedBlock, GeneratedDocSummaryBlock, QueryDisplayBlock } from '../ui';
import { getInstallationConfig } from '../utils';
import { createMessageThreadCapture } from './gitbook';

/**
 *  Save thread in GitBook as a summary (capture)
 */
export async function saveThread(
    {
        teamId,
        channelId,
        thread_ts,
        userId,
    }: {
        teamId: string;
        channelId: string;
        thread_ts: string;
        userId: string;
    },
    context: SlackRuntimeContext
) {
    const { capture, followupQuestions } = await createMessageThreadCapture(
        {
            team_id: teamId,
            channel: channelId,
            thread_ts,
        },
        context
    );

    const { accessToken } = await getInstallationConfig(context, teamId);

    await slackAPI(
        context,
        {
            method: 'POST',
            path: 'chat.postMessage',
            payload: {
                channel: channelId,
                blocks: [
                    ...ConversationSavedBlock(),
                    ...(capture.output.markdown
                        ? GeneratedDocSummaryBlock({
                              summary: capture.output.markdown,
                          })
                        : []),
                    ...QueryDisplayBlock({
                        queries: followupQuestions,
                        heading: 'Here some questions this thread can help answer:',
                    }),
                ],
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
