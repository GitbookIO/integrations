import {
    GithubRuntimeContext,
    IntegrationTaskSyncIssueComments,
    IntegrationTaskSyncIssues,
    IntegrationTaskSyncPullRequestComments,
    IntegrationTaskSyncPullRequests,
    IntegrationTaskSyncReleases,
    IntegrationTaskSyncRepo,
} from './types';

/**
 * Sync a GitHub repository & it's entities with GitBook.
 */
export async function queueSyncRepository(
    context: GithubRuntimeContext,
    payload: IntegrationTaskSyncRepo['payload']
) {
    const { api, environment } = context;
    await api.integrations.queueIntegrationTask(environment.integration.name, {
        task: {
            type: 'sync:pull-requests',
            payload,
        },
    });
}

export async function queueSyncPullRequests(
    context: GithubRuntimeContext,
    payload: IntegrationTaskSyncPullRequests['payload']
) {
    const { api, environment } = context;
    await api.integrations.queueIntegrationTask(environment.integration.name, {
        task: {
            type: 'sync:pull-requests',
            payload,
        },
    });
}

export async function queueSyncPullRequestComments(
    context: GithubRuntimeContext,
    payload: IntegrationTaskSyncPullRequestComments['payload']
) {
    const { api, environment } = context;
    await api.integrations.queueIntegrationTask(environment.integration.name, {
        task: {
            type: 'sync:pull-request-comments',
            payload,
        },
    });
}

export async function queueSyncIssues(
    context: GithubRuntimeContext,
    payload: IntegrationTaskSyncIssues['payload']
) {
    const { api, environment } = context;
    await api.integrations.queueIntegrationTask(environment.integration.name, {
        task: {
            type: 'sync:issues',
            payload,
        },
    });
}

export async function queueSyncIssueComments(
    context: GithubRuntimeContext,
    payload: IntegrationTaskSyncIssueComments['payload']
) {
    const { api, environment } = context;
    await api.integrations.queueIntegrationTask(environment.integration.name, {
        task: {
            type: 'sync:issue-comments',
            payload,
        },
    });
}

export async function queueSyncReleases(
    context: GithubRuntimeContext,
    payload: IntegrationTaskSyncReleases['payload']
) {
    const { api, environment } = context;
    await api.integrations.queueIntegrationTask(environment.integration.name, {
        task: {
            type: 'sync:releases',
            payload,
        },
    });
}
