import { SlackRuntimeContext } from '../configuration';
import { slackAPI } from '../slack';
import { ConversationSavedBlock, QueryDisplayBlock } from '../ui';
import { getInstallationApiClient, getInstallationConfig, isSaveThreadMessage } from '../utils';

const RUNTIME_TIME_LIMIT = 30000;
const APP_ORG_URL = 'https://app.gitbook.com/o/';

/**
 *  Save thread in GitBook as a summary (snippet)
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
    const { accessToken, installation } = await getInstallationConfig(context, teamId);

    // acknowledge the request to the user
    notifySavingThread({ channel: channelId, thread_ts, userId }, context, accessToken);

    const snippetsURL = `${APP_ORG_URL}${installation.target.organization}/snippets`;
    // In some cases, the runtime limit is reached before the capture is finished (e.g large threads)
    // we notify the user before the runtime limit is reached that the capture
    const timeoutId = registerNotifyBeforeRuntimeLimit(
        {
            channel: channelId,
            thread_ts,
            userId,
        },
        snippetsURL,
        context,
        accessToken
    );

    const { capture, followupQuestions } = await createMessageThreadCapture(
        {
            team_id: teamId,
            channel: channelId,
            thread_ts,
        },
        context
    );

    // managed to avoid the timeout, clear the timeout
    clearTimeout(timeoutId);

    await slackAPI(
        context,
        {
            method: 'POST',
            path: 'chat.postMessage',
            payload: {
                channel: channelId,
                blocks: [
                    ...ConversationSavedBlock(capture.urls.app),
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

    const events = messages
        .filter((message) => {
            // ignore messages in thread from any bot (todo: potentially limit to gitbook only)
            if (message.bot_id) {
                return false;
            }

            if (isSaveThreadMessage(message.text)) {
                return false;
            }

            return true;
        })
        .map((message) => {
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

async function notifySavingThread(
    {
        channel,
        thread_ts,
        userId,
    }: {
        channel: string;
        thread_ts: string;
        userId: string;
    },
    context: SlackRuntimeContext,
    accessToken: string
) {
    // acknowledge the request to the user
    await slackAPI(
        context,
        {
            method: 'POST',
            path: 'chat.postEphemeral', // probably alwasy ephemeral? or otherwise have replies in same thread
            payload: {
                channel,
                text: `_Saving to GitBook..._`,
                ...(userId ? { user: userId } : {}), // actually shouldn't be optional
                thread_ts,
            },
        },
        {
            accessToken,
        }
    );
}

function registerNotifyBeforeRuntimeLimit(
    {
        channel,
        thread_ts,
        userId,
    }: {
        channel: string;
        thread_ts: string;
        userId: string;
    },
    snippetsUrl: string,
    context: SlackRuntimeContext,
    accessToken: string
) {
    const timeoutId = setTimeout(async () => {
        // acknowledge the request to the user
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
                                text: `Thread is being saved. You'll find the snippet in <${snippetsUrl}|GitBook> shortly.`,
                            },
                        },
                    ],
                    ...(userId ? { user: userId } : {}), // actually shouldn't be optional
                    thread_ts,
                },
            },
            {
                accessToken,
            }
        );

        // Set to a value slightly less than the actual runtime limit to notify just before
    }, RUNTIME_TIME_LIMIT - 1000);

    return timeoutId;
}
