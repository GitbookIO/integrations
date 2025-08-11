import pMap from 'p-map';
import { ConversationInput } from '@gitbook/api';
import { ExposableError, Logger } from '@gitbook/runtime';
import {
    HubSpotRuntimeContext,
    HubSpotConversationsResponse,
    HubSpotMessagesResponse,
    HubSpotConversation,
} from './types';
import { hubspotApiRequest } from './client';

const logger = Logger('hubspot-conversations:conversations');

/**
 * Ingest the last closed conversations from HubSpot.
 */
export async function ingestConversations(context: HubSpotRuntimeContext) {
    const { installation } = context.environment;
    if (!installation) {
        throw new ExposableError('Installation not found');
    }

    let after: string | undefined;
    const limit = 100;
    const maxPages = 10;
    let pageIndex = 0;

    while (pageIndex < maxPages) {
        pageIndex += 1;

        // Get conversations from HubSpot
        const response = await hubspotApiRequest<HubSpotConversationsResponse>(
            context,
            '/conversations/v3/conversations/threads',
            {
                method: 'GET',
                params: {
                    limit: limit.toString(),
                    ...(after && { after }),
                    archived: 'false',
                },
            },
        );

        const conversations = response.results || [];
        logger.info('Found conversations', { count: conversations.length, page: pageIndex });

        if (conversations.length === 0) {
            break;
        }

        // Filter for closed conversations only
        const closedConversations = conversations.filter(
            (conv) => conv.latestMessageTimestamp && conv.status === 'CLOSED',
        );

        logger.info('Found closed conversations', { count: closedConversations.length });

        if (closedConversations.length > 0) {
            const gitbookConversations = await pMap(
                closedConversations,
                async (conversation) => {
                    return await parseConversationAsGitBook(context, conversation);
                },
                {
                    concurrency: 3,
                },
            );

            if (gitbookConversations.length > 0) {
                logger.info('Ingesting closed conversations into GitBook', {
                    count: gitbookConversations.length,
                });
                await context.api.orgs.ingestConversation(
                    installation.target.organization,
                    gitbookConversations,
                );
                logger.info('Successfully ingested conversations', {
                    count: gitbookConversations.length,
                });
            }
        }

        // Check if there are more pages
        if (!response.paging?.next?.after) {
            break;
        }
        after = response.paging.next.after;
    }
}

/**
 * Parse a HubSpot conversation into a GitBook conversation.
 */
export async function parseConversationAsGitBook(
    context: HubSpotRuntimeContext,
    hubspotConversation: HubSpotConversation,
): Promise<ConversationInput> {
    const { installation } = context.environment;
    if (!installation) {
        throw new ExposableError('Installation not found');
    }

    const resultConversation: ConversationInput = {
        id: hubspotConversation.id,
        metadata: {
            url: `https://app.hubspot.com/conversations/${hubspotConversation.id}`,
            attributes: {
                threadId: hubspotConversation.id,
                status: hubspotConversation.status,
            },
            createdAt: new Date(hubspotConversation.createdAt).toISOString(),
        },
        parts: [],
    };

    // Get messages for this conversation thread
    try {
        const messagesResponse = await hubspotApiRequest<HubSpotMessagesResponse>(
            context,
            `/conversations/v3/conversations/threads/${hubspotConversation.id}/messages`,
            { method: 'GET' },
        );

        logger.debug('Fetched messages for conversation', {
            conversationId: hubspotConversation.id,
            messageCount: messagesResponse.results?.length || 0,
        });
        
        const messages = messagesResponse.results || [];
        if (messages.length === 0) {
            logger.info('No messages found for conversation, skipping', {
                conversationId: hubspotConversation.id,
            });
            // Return conversation with empty parts rather than throwing error
            // This allows conversations without messages to be tracked
        }
        
        for (const message of messages) {
            if (message.text || message.richText) {
                const messageBody = message.richText || message.text;
                if (messageBody) {
                    logger.debug('Processing message', {
                        conversationId: hubspotConversation.id,
                        senderType: message.senderActorType,
                    });

                    resultConversation.parts.push({
                        type: 'message',
                        role: message.senderActorType === 'VISITOR' ? 'user' : 'team-member',
                        body: messageBody,
                    });
                }
            }
        }
    } catch (error) {
        logger.error('Failed to fetch messages for conversation, including conversation without messages', {
            conversationId: hubspotConversation.id,
            error: error instanceof Error ? error.message : String(error),
        });
        // Continue with empty parts rather than failing the entire conversation
        // This ensures we don't lose conversation metadata even if messages fail to fetch
    }

    return resultConversation;
}
