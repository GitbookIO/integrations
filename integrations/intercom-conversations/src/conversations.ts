import pMap from 'p-map';
import { IntercomClient, Intercom } from 'intercom-client';
import { ConversationInput } from '@gitbook/api';
import { IntercomRuntimeContext } from './types';
import { getIntercomClient } from './client';

/**
 * Ingest the last closed conversations from Intercom.
 */
export async function ingestConversations(context: IntercomRuntimeContext) {
    const { installation } = context.environment;
    if (!installation) {
        throw new Error('Installation not found');
    }

    const intercom = await getIntercomClient(context);

    let pageIndex = 0;
    const perPage = 100;
    const maxPages = 10;

    let page = await intercom.conversations.search(
        {
            query: {
                operator: 'AND',
                value: [
                    {
                        field: 'open',
                        operator: '=',
                        // @ts-ignore
                        value: false,
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

    while (pageIndex < maxPages) {
        pageIndex += 1;
        console.log(`Found ${page.data.length} conversations`);

        const gitbookConversations = await pMap(
            page.data,
            async (conversation) => {
                return await parseConversationAsGitBook(context, intercom, conversation);
            },
            {
                concurrency: 3,
            },
        );

        if (gitbookConversations.length > 0) {
            await context.api.orgs.ingestConversation(
                installation.target.organization,
                gitbookConversations,
            );
        }

        if (!page.hasNextPage()) {
            break;
        }
        page = await page.getNextPage();
    }
}

/**
 * Parse an Intercom conversation into a GitBook conversation.
 */
export async function parseConversationAsGitBook(
    context: IntercomRuntimeContext,
    intercom: IntercomClient,
    partialConversation: Intercom.Conversation,
): Promise<ConversationInput> {
    if (partialConversation.state !== 'closed') {
        throw new Error(`Conversation ${partialConversation.id} is not closed`);
    }

    const { installation } = context.environment;
    if (!installation) {
        throw new Error('Installation not found');
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

    const conversation = await intercom.conversations.find(
        {
            conversation_id: partialConversation.id,
        },
        {
            // https://github.com/intercom/intercom-node/issues/460
            headers: { Accept: 'application/json' },
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
