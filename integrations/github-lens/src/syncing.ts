import { Logger } from '@gitbook/runtime';

import { fetchRepository, createAppInstallationAccessToken } from './api';
import {
    GithubRuntimeContext,
    IntegrationTaskSyncIssueComments,
    IntegrationTaskSyncIssues,
    IntegrationTaskSyncPullRequestComments,
    IntegrationTaskSyncPullRequests,
    IntegrationTaskSyncReleases,
    IntegrationTaskSyncRepo,
} from './types';

const logger = Logger('github-lens:syncing');

export async function syncRepositoriesToOrganization(
    context: GithubRuntimeContext,
    organizationId: string,
    integrationInstallationId: string,
    githubInstallationId: string,
    repositories: number[]
) {
    const installationAccessToken = await createAppInstallationAccessToken(
        context,
        githubInstallationId
    );

    for (const repositoryId of repositories) {
        const repo = await fetchRepository(context, repositoryId);
        await queueSyncRepository(context, {
            repositoryId,
            organizationId,
            integrationInstallationId,
            githubInstallationId,
            ownerName: repo.owner.login,
            repoName: repo.name,
            token: installationAccessToken,
        });
        logger.info('syncing repository', { repositoryId });
    }
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
