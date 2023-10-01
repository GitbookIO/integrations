import {
    GithubRuntimeContext,
    IntegrationTaskSyncIssueComments,
    IntegrationTaskSyncIssues,
    IntegrationTaskSyncPullRequestComments,
    IntegrationTaskSyncPullRequests,
    IntegrationTaskSyncReleases,
    IntegrationTaskSyncRepo,
    IntegrationTaskSyncRepos,
} from './types';

export async function queueSyncRepositories(
    context: GithubRuntimeContext,
    payload: IntegrationTaskSyncRepos['payload']
) {
    const { api, environment } = context;
    await api.integrations.queueIntegrationTask(environment.integration.name, {
        task: {
            type: 'sync:repos',
            payload,
        },
        schedule: 10,
    });
}

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
            type: 'sync:repo',
            payload,
        },
        schedule: 10,
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
        schedule: 10,
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
        schedule: 10,
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
        schedule: 10,
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
        schedule: 10,
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
        schedule: 10,
    });
}
