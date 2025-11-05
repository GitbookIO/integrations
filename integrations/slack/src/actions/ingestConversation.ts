import { ConversationInput, ConversationPart, IntegrationInstallation } from '@gitbook/api';
import { SlackInstallationConfiguration, SlackRuntimeContext } from '../configuration';
import { getSlackThread, slackAPI, SlackConversationThread } from '../slack';
import { getInstallationApiClient, getIntegrationInstallationForTeam } from '../utils';
import { IngestSlackConversationActionParams } from './types';
import { Logger } from '@gitbook/runtime';

const logger = Logger('slack:actions:ingestConversation');

/**
 * Ingest the slack conversation to GitBook aiming at improving the organization docs.
 */
export async function ingestSlackConversation(params: IngestSlackConversationActionParams) {
    const { channelId, threadId, context, teamId, conversationToIngest } = params;

    const installation = await getIntegrationInstallationForTeam(context, teamId);
    if (!installation) {
        throw new Error('Installation not found');
    }

    const accessToken = (installation.configuration as SlackInstallationConfiguration)
        .oauth_credentials?.access_token;

    await Promise.all([
        slackAPI(
            context,
            {
                method: 'POST',
                path: 'chat.postMessage',
                payload: {
                    channel: channelId,
                    text: `🚀 Sharing this conversation with Docs Agent to improve your docs...`,
                    thread_ts: threadId,
                },
            },
            {
                accessToken,
            },
        ),
        handleIngestSlackConversationAction(
            {
                channelId,
                threadId,
                installation,
                accessToken,
                conversationToIngest,
            },
            context,
        ),
    ]);
}

/**
 * Handle the integration action to ingest a slack conversation.
 */
export async function handleIngestSlackConversationAction(
    params: {
        channelId: IngestSlackConversationActionParams['channelId'];
        threadId: IngestSlackConversationActionParams['threadId'];
        installation: IntegrationInstallation;
        accessToken: string | undefined;
        conversationToIngest: {
            channelId: string;
            messageTs: string;
        };
    },
    context: SlackRuntimeContext,
) {
    const { channelId, threadId, installation, accessToken, conversationToIngest } = params;

    const [client, conversation] = await Promise.all([
        getInstallationApiClient(context, installation.id),
        (async () => {
            const slackThread = await getSlackThread(context, conversationToIngest, {
                accessToken,
            });
            return parseSlackThreadAsGitBookConversation(slackThread);
        })(),
    ]);

    try {
        await client.orgs.ingestConversation(installation.target.organization, conversation);
        await slackAPI(
            context,
            {
                method: 'POST',
                path: 'chat.postMessage',
                payload: {
                    channel: channelId,
                    text: `🤖 Got it! Docs Agent is on it. We'll analyze this and suggest changes if needed.`,
                    thread_ts: threadId,
                },
            },
            {
                accessToken,
            },
        );
    } catch {
        await slackAPI(
            context,
            {
                method: 'POST',
                path: 'chat.postMessage',
                payload: {
                    channel: channelId,
                    text: `⚠️ Something went wrong while sending this conversation to Docs Agent.`,
                    thread_ts: threadId,
                },
            },
            {
                accessToken,
            },
        );
    }
}

/**
 * Parse a Slack threaded conversation into a GitBook conversation.
 */
function parseSlackThreadAsGitBookConversation(
    slackThread: SlackConversationThread,
): ConversationInput {
    return {
        id: `${slackThread.channelId}-${slackThread.messageTs}`,
        metadata: {
            url: slackThread.link,
            attributes: {
                channelId: slackThread.channelId,
                messageTs: slackThread.messageTs,
            },
            createdAt: new Date(slackThread.createdAt).toISOString(),
        },
        parts: slackThread.messages
            .map((message) =>
                message.text
                    ? ({
                          type: 'message',
                          role: 'user',
                          body: message.text,
                      } as ConversationPart)
                    : null,
            )
            .filter((part) => part !== null),
    };
}
