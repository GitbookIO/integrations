import pMap from 'p-map';
import { getIntercomClient } from './client';
import type { IntercomIntegrationTask, IntercomRuntimeContext } from './types';
import { parseIntercomConversationAsGitBook } from './conversations';
import { Logger } from '@gitbook/runtime';
import { GitBookAPI } from '@gitbook/api';

const logger = Logger('intercom-conversations:tasks');

/**
 * Queue a task for the intercom integration.
 */
export async function queueIntercomIntegrationTask(
    context: IntercomRuntimeContext,
    task: IntercomIntegrationTask,
): Promise<void> {
    const { api, environment } = context;
    await api.integrations.queueIntegrationTask(environment.integration.name, {
        task: {
            type: task.type,
            payload: task.payload,
        },
    });
}

/**
 * Handles an intercom integration dispatched task.
 */
export async function handleIntercomIntegrationTask(
    context: IntercomRuntimeContext,
    task: IntercomIntegrationTask,
): Promise<void> {
    const { type: taskType } = task;
    switch (taskType) {
        case 'ingest:closed-conversations':
            await handleClosedConversationsTask(context, task);
            break;
        default:
            throw new Error(`Unknown intercom integration task type: ${task}`);
    }
}

/**
 * Handle an ingest intercom closed conversations task.
 */
async function handleClosedConversationsTask(
    context: IntercomRuntimeContext,
    task: IntercomIntegrationTask,
): Promise<void> {
    const { environment } = context;

    const { data: installation } = await context.api.integrations.getIntegrationInstallationById(
        environment.integration.name,
        task.payload.installation,
    );

    const installationContext: IntercomRuntimeContext = {
        ...context,
        environment: {
            ...context.environment,
            installation,
        },
    };

    const intercomClient = await getIntercomClient(installationContext);

    // Process conversations with fail-safe error handling
    const gitbookConversations = (
        await pMap(
            task.payload.conversations,
            async (conversationId) => {
                try {
                    const intercomConversation = await intercomClient.conversations.find(
                        { conversation_id: conversationId },
                        {
                            headers: { Accept: 'application/json' },
                            timeoutInSeconds: 3,
                        },
                    );
                    return parseIntercomConversationAsGitBook(intercomConversation);
                } catch {
                    return null;
                }
            },
            {
                concurrency: 3,
            },
        )
    ).filter((conversation) => conversation !== null);

    // Ingest intercom conversations to GitBook
    if (gitbookConversations.length > 0) {
        try {
            const installationApiClient = await context.api.createInstallationClient(
                context.environment.integration.name,
                installation.id,
            );
            await installationApiClient.orgs.ingestConversation(
                task.payload.organization,
                gitbookConversations,
            );
            logger.info(`Successfully ingested ${gitbookConversations.length} conversations.`);
        } catch (error) {
            logger.error(`Failed to ingest ${gitbookConversations.length} conversations: ${error}`);
        }
    }
}
