import { ConversationInput } from '@gitbook/api';
import { ExposableError, Logger } from '@gitbook/runtime';
import { Intercom, IntercomClient } from 'intercom-client';
import pMap from 'p-map';
import { getIntercomClient } from './client';
import { IntercomRuntimeContext } from './types';

const logger = Logger('intercom-conversations');

/**
 * Ingest the last closed conversations from Intercom.
 */
export async function ingestConversations(context: IntercomRuntimeContext) {
    const { installation } = context.environment;
    if (!installation) {
        throw new ExposableError('Installation not found');
    }

    const intercomClient = await getIntercomClient(context);

    let pageIndex = 0;
    const perPage = 100;
    const maxPages = 8; // Reduce to stay under ~1000 subrequest limit (8 pages = ~800 conversations + ~810 total calls)
    let totalProcessed = 0;

    let page = await intercomClient.conversations.search(
        {
            query: {
                operator: 'AND',
                value: [
                    {
                        field: 'state',
                        operator: '=',
                        value: 'closed',
                    },
                ],
            },
            pagination: { per_page: perPage },
        },
        {
            // https://github.com/intercom/intercom-node/issues/460
            headers: { Accept: 'application/json' },
        },
    );

    logger.info(`Conversation ingestion started`);

    while (pageIndex < maxPages) {
        pageIndex += 1;

        // Process conversations with fail-safe error handling
        const gitbookConversations = (
            await pMap(
                page.data,
                async (conversation) => {
                    try {
                        return await parseConversationAsGitBook(intercomClient, conversation);
                    } catch {
                        return null;
                    }
                },
                {
                    concurrency: 3,
                },
            )
        ).filter((conversation) => conversation !== null);

        // Ingest conversations to GitBook
        if (gitbookConversations.length > 0) {
            try {
                await context.api.orgs.ingestConversation(
                    installation.target.organization,
                    gitbookConversations,
                );
                totalProcessed += gitbookConversations.length;
                logger.info(
                    `Successfully ingested ${gitbookConversations.length} conversations from page ${pageIndex}`,
                );
            } catch (error) {
                logger.error(
                    `Failed to ingest ${gitbookConversations.length} conversations from page ${pageIndex}: ${error}`,
                );
            }
        }

        if (!page.hasNextPage()) {
            break;
        }

        page = await page.getNextPage();
    }

    logger.info(`Conversation ingestion completed. Processed ${totalProcessed} conversations`);
}

/**
 * Fetch the the full conversation details and parse it into a GitBook conversation format.
 */
export async function parseConversationAsGitBook(
    intercom: IntercomClient,
    partialConversation: Intercom.Conversation,
): Promise<ConversationInput> {
    if (partialConversation.state !== 'closed') {
        throw new Error(`Conversation ${partialConversation.id} is not closed`);
    }

    const resultConversation: ConversationInput = {
        id: partialConversation.id,
        metadata: {
            url: `https://app.intercom.com/a/inbox/_/inbox/conversation/${partialConversation.id}`,
            attributes: {},
            createdAt: new Date(partialConversation.created_at * 1000).toISOString(),
        },
        parts: [],
    };

    if (partialConversation.source.subject) {
        resultConversation.subject = partialConversation.source.subject;
    }

    if (partialConversation.source.body) {
        resultConversation.parts.push({
            type: 'message',
            role: 'user',
            body: partialConversation.source.body,
        });
    }

    // Fetch full conversation details
    const conversation = await intercom.conversations.find(
        { conversation_id: partialConversation.id },
        {
            headers: { Accept: 'application/json' },
            timeoutInSeconds: 3,
        },
    );

    for (const part of conversation.conversation_parts?.conversation_parts ?? []) {
        if (part.author.type === 'bot') {
            continue;
        }

        switch (part.part_type) {
            case 'open':
            case 'comment': {
                if (part.body) {
                    resultConversation.parts.push({
                        type: 'message',
                        role: part.author.type === 'user' ? 'user' : 'assistant',
                        body: part.body,
                    });
                }
                break;
            }
        }
    }

    return resultConversation;
}
