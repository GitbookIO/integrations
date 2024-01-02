import type { GithubRuntimeContext, IntegrationTask, IntegrationTaskImportSpaces } from './types';
import { handleImportDispatchForSpaces } from './webhooks';

/**
 * Queue a task for the integration to import spaces.
 */
export async function queueTaskForImportSpaces(
    context: GithubRuntimeContext,
    task: IntegrationTaskImportSpaces
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
 * Handle an integration task.
 */
export async function handleIntegrationTask(
    context: GithubRuntimeContext,
    task: IntegrationTask
): Promise<void> {
    switch (task.type) {
        case 'import:spaces':
            await handleImportDispatchForSpaces(context, task.payload);
            break;
        default:
            throw new Error(`Unknown integration task type: ${task}`);
    }
}
