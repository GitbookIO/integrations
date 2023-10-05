import { SlackRuntimeContext } from '../configuration';
import { slackAPI } from '../slack';
import { ConversationSavedBlock, GeneratedDocSummaryBlock, QueryDisplayBlock } from '../ui';
import { getInstallationApiClient, getInstallationConfig } from '../utils';

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
                    ...ConversationSavedBlock(capture.urls.app),
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

function slackTimestampToISOFormat(slackTs) {
    const timestampInMilliseconds = parseFloat(slackTs) * 1000;

    const date = new Date(timestampInMilliseconds);

    const formattedDate = date.toISOString();

    return formattedDate;
}

/**
 * Creates a capture from a message thread
 *
 * 1. Get all messages in a thread
 * 2. Start capture
 * 3. Add all messages in a thread as capture events
 * 4. Stop capture
 */
async function createMessageThreadCapture(slackEvent, context: SlackRuntimeContext) {
    const { api } = context;

    const { team_id, channel, thread_ts } = slackEvent;
    const { client: installationApiClient, installation } = await getInstallationApiClient(
        api,
        team_id
    );
    const orgId = installation.target.organization;

    const { accessToken } = await getInstallationConfig(context, team_id);

    const messageReplies = await slackAPI(
        context,
        {
            method: 'GET',
            path: 'conversations.replies',
            payload: {
                channel,
                ts: thread_ts,
            },
        },
        { accessToken }
    );
    const { messages = [] } = messageReplies;

    // get a permalink to the thread
    const permalinkRes = (await slackAPI(
        context,
        {
            method: 'GET',
            path: 'chat.getPermalink',
            payload: {
                channel,
                message_ts: thread_ts,
            },
        },
        {
            accessToken,
        }
    )) as { ok: boolean; permalink: string };

    // TODO what's to be done with new permissions needed "capture:write" and users needing to re-auth

    // start capture
    const startCaptureRes = await installationApiClient.orgs.startCapture(orgId, {
        context: 'thread',
        externalId: thread_ts,
        ...(permalinkRes.ok ? { externalURL: permalinkRes.permalink } : {}),
    });

    const capture = startCaptureRes.data;

    const events = messages.map((message) => {
        const { text, ts, thread_ts } = message;

        return {
            type: 'thread.message',
            text,
            timestamp: slackTimestampToISOFormat(ts),
            ...(ts === thread_ts ? { isFirst: true } : {}),
        };
    });

    // add all messages in a thread to a capture
    await installationApiClient.orgs.addEventsToCapture(orgId, capture.id, {
        events,
    });

    // stop capture
    const stopCaptureRes = await installationApiClient.orgs.stopCapture(
        orgId,
        capture.id,
        {}, // remove in api
        {
            format: 'markdown',
        }
    );

    const outputCapture = stopCaptureRes.data;

    return outputCapture;
}

export async function notifyOnlySupportedThreads(context, team, channel, user) {
    const { accessToken } = await getInstallationConfig(context, team);

    await slackAPI(
        context,
        {
            method: 'POST',
            path: 'chat.postMessage',
            payload: {
                channel,
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: `Sorry I'm only supported in threads for now :sweat_smile:`,
                        },
                    },
                ],
                user,
                unfurl_links: false,
            },
        },
        { accessToken }
    );
}
