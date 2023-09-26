import { Logger } from '@gitbook/runtime';

import { createAppInstallationAccessToken } from './api';
import {
    GitHubRepositoriesWithMetadata,
    GithubRuntimeContext,
    IntegrationTaskSyncIssueComments,
    IntegrationTaskSyncIssues,
    IntegrationTaskSyncPullRequestComments,
    IntegrationTaskSyncPullRequests,
    IntegrationTaskSyncReleases,
    IntegrationTaskSyncRepo,
} from './types';
import { authenticateAsIntegration } from './utils';

const logger = Logger('github-lens:syncing');

export async function syncRepositoriesToOrganization(
    context: GithubRuntimeContext,
    organizationId: string,
    integrationInstallationId: string,
    integrationConfigurationId: string,
    githubInstallationId: string,
    repositories: GitHubRepositoriesWithMetadata
) {
    const githubInstallationAccessToken = await createAppInstallationAccessToken(
        context,
        githubInstallationId
    );

    for (const repository of repositories) {
        const integrationContext = await authenticateAsIntegration(context);
        await queueSyncRepository(integrationContext, {
            repositoryId: parseInt(repository.repoId, 10),
            organizationId,
            integrationInstallationId,
            integrationConfigurationId,
            githubInstallationId,
            ownerName: repository.repoOwner,
            repoName: repository.repoName,
            token: githubInstallationAccessToken,
            retriesLeft: 3,
        });
        logger.info(`Queued repository ${repository} for syncing`);
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
