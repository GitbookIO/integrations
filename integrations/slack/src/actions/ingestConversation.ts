import { ConversationInput, ConversationPart, IntegrationInstallation } from '@gitbook/api';
import { SlackInstallationConfiguration, SlackRuntimeContext } from '../configuration';
import {
    getSlackThread,
    parseSlackConversationPermalink,
    slackAPI,
    SlackConversationThread,
} from '../slack';
import { getInstallationApiClient, getIntegrationInstallationForTeam } from '../utils';
import { IngestSlackConversationActionParams, IntegrationTaskIngestConversation } from './types';
import { Logger } from '@gitbook/runtime';

const logger = Logger('slack:actions:ingestConversation');

/**
 * Ingest the slack conversation to GitBook aiming at improving the organization docs.
 */
export async function ingestSlackConversation(params: IngestSlackConversationActionParams) {
    const { responseUrl, channelId, channelName, userId, threadId, context, teamId } = params;

    const installation = await getIntegrationInstallationForTeam(context, teamId);
    if (!installation) {
        throw new Error('Installation not found');
    }

    const accessToken = (installation.configuration as SlackInstallationConfiguration)
        .oauth_credentials?.access_token;

    const conversationToIngest: IngestSlackConversationActionParams['conversationToIngest'] =
        (() => {
            if (params.text) {
                try {
                    return parseSlackConversationPermalink(params.text);
                } catch (error) {
                    logger.debug(
                        `⚠️ We couldn’t understand that link. Please check it and try again.`,
                        error,
                    );
                }
            }

            return params.conversationToIngest;
        })();

    if (!conversationToIngest) {
        await slackAPI(
            context,
            {
                method: 'POST',
                path: 'chat.postMessage',
                payload: {
                    channel: channelId,
                    text: `⚠️ We couldn’t get the conversation details. Please try again.`,
                },
            },
            {
                accessToken,
            },
        );

        return;
    }

    await Promise.all([
        slackAPI(
            context,
            {
                method: 'POST',
                path: 'chat.postMessage',
                payload: {
                    channel: channelId,
                    text: '🚀 Sharing this conversation with Docs Agent to improve your docs...',
                    thread_ts: threadId,
                },
            },
            {
                accessToken,
            },
        ),
        queueIngestSlackConversationTask({
            channelId,
            channelName,
            teamId,
            responseUrl,
            userId,
            threadId,
            context,
            accessToken,
            installation,
            conversationToIngest,
        }),
    ]);
}

/**
 * Queues an integration task to ingest the Slack conversation asynchronously.
 */
async function queueIngestSlackConversationTask(
    params: IngestSlackConversationActionParams & {
        installation: IntegrationInstallation;
        accessToken: string | undefined;
        conversationToIngest: {
            channelId: string;
            messageTs: string;
        };
    },
) {
    const { accessToken, installation, context, conversationToIngest } = params;

    const task: IntegrationTaskIngestConversation = {
        type: 'ingest:conversation',
        payload: {
            channelId: params.channelId,
            teamId: params.teamId,
            channelName: params.channelName,
            responseUrl: params.responseUrl,
            threadId: params.threadId,
            userId: params.userId,
            organizationId: installation.target.organization,
            installationId: installation.id,
            accessToken,
            conversationToIngest,
        },
    };

    await context.api.integrations.queueIntegrationTask(context.environment.integration.name, {
        task,
    });

    logger.info(`Queue task ${task.type} for installation: ${task.payload.installationId})`);
}

/**
 * Handle the integration task to ingest a slack conversation.
 */
export async function handleIngestSlackConversationTask(
    task: IntegrationTaskIngestConversation,
    context: SlackRuntimeContext,
) {
    const {
        payload: {
            channelId,
            userId,
            responseUrl,
            threadId,
            organizationId,
            installationId,
            accessToken,
            conversationToIngest,
        },
    } = task;

    const [client, conversation] = await Promise.all([
        getInstallationApiClient(context, installationId),
        (async () => {
            const slackThread = await getSlackThread(context, conversationToIngest, {
                accessToken,
            });
            return parseSlackThreadAsGitBookConversation(slackThread);
        })(),
    ]);

    try {
        await client.orgs.ingestConversation(organizationId, conversation);
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
