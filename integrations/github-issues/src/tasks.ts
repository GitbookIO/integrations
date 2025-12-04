import { GitHubIssuesIntegrationTask, GitHubIssuesRuntimeContext } from './types';

/**
 * Handles an intercom integration dispatched task.
 */
export async function handleGitHubIssuesIntegrationTask(
    task: GitHubIssuesIntegrationTask,
    context: GitHubIssuesRuntimeContext,
): Promise<void> {
    const { type: taskType } = task;
    switch (taskType) {
        case 'ingest:github-installation:repo-issues':
            //TODO: implement ingestion for repo issues
            break;
        default:
            throw new Error(`Unknown github-issues integration task type: ${task}`);
    }
}

/**
 * Queue a task for the github issues integration.
 */
export async function queueGitHubIssuesIntegrationTask(
    context: GitHubIssuesRuntimeContext,
    task: GitHubIssuesIntegrationTask,
): Promise<void> {
    await context.integration.queueTask({
        task: {
            type: task.type,
            payload: task.payload,
        },
    });
}
