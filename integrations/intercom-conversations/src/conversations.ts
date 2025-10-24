import { ConversationInput } from '@gitbook/api';
import { Logger } from '@gitbook/runtime';
import { Intercom } from 'intercom-client';
import { getIntercomClient } from './client';
import type { IntercomIntegrationTask, IntercomRuntimeContext } from './types';
import { queueIntercomIntegrationTask } from './tasks';
import pMap from 'p-map';

const logger = Logger('intercom-conversations:ingest');

/**
 * Ingest the last closed conversations from Intercom.
 */
export async function ingestLastClosedIntercomConversations(context: IntercomRuntimeContext) {
    const { installation } = context.environment;
    if (!installation) {
        throw new Error('Installation not found');
    }

    const intercomClient = await getIntercomClient(context);

    let pageIndex = 0;
    const perPage = 100;
    const maxPages = 7; // Keep under ~1000 subrequest limit. Calc: 7 pages * 100 items ≈ 700 detail calls + 7 search page calls ≈ ~707 Intercom calls (+7 GitBook ingests ≈ ~714 total).
    let totalConvsToIngest = 0;

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

    logger.info(
        `Conversation ingestion started. A maximum of ${maxPages * perPage} conversations will be processed.`,
    );

    const tasks: Array<IntercomIntegrationTask> = [];
    while (pageIndex < maxPages) {
        pageIndex += 1;

        const intercomConversations = page.data.map((conversation) => conversation.id);
        totalConvsToIngest += intercomConversations.length;
        tasks.push({
            type: 'ingest:closed-conversations',
            payload: {
                organization: installation.target.organization,
                installation: installation.id,
                conversations: intercomConversations,
            },
        });

        if (!page.hasNextPage()) {
            break;
        }

        page = await page.getNextPage();
    }

    await pMap(tasks, async (task) => queueIntercomIntegrationTask(context, task), {
        concurrency: 3,
    });

    logger.info(
        `Dispatched ${tasks.length} tasks to ingest a total of ${totalConvsToIngest} intercom closed conversations`,
    );
}

/**
 * Parse a fetched intercom conversation into a GitBook conversation format.
 */
export function parseIntercomConversationAsGitBook(
    conversation: Intercom.Conversation,
): ConversationInput {
    if (conversation.state !== 'closed') {
        throw new Error(`Conversation ${conversation.id} is not closed`);
    }

    const resultConversation: ConversationInput = {
        id: conversation.id,
        metadata: {
            url: `https://app.intercom.com/a/inbox/_/inbox/conversation/${conversation.id}`,
            attributes: {},
            createdAt: new Date(conversation.created_at * 1000).toISOString(),
        },
        parts: [],
    };

    if (conversation.source.subject) {
        resultConversation.subject = conversation.source.subject;
    }

    if (conversation.source.body) {
        resultConversation.parts.push({
            type: 'message',
            role: 'user',
            body: conversation.source.body,
        });
    }

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
