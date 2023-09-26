import { Logger } from '@gitbook/runtime';

import {
    createAppInstallationAccessToken,
    fetchIssueComments,
    fetchIssues,
    fetchPullRequestComments,
    fetchPullRequests,
    fetchReleases,
    fetchRepository,
} from './api';
import {
    createIssueCommentEntity,
    createIssueEntity,
    createPullRequestCommentEntity,
    createPullRequestEntity,
    createReleaseEntity,
    createRepositoryEntity,
} from './entities';
import {
    queueSyncIssueComments,
    queueSyncIssues,
    queueSyncPullRequestComments,
    queueSyncPullRequests,
    queueSyncReleases,
} from './syncing';
import {
    GithubRuntimeContext,
    IntegrationTask,
    IntegrationTaskSyncIssueComments,
    IntegrationTaskSyncIssues,
    IntegrationTaskSyncPullRequestComments,
    IntegrationTaskSyncPullRequests,
    IntegrationTaskSyncReleases,
    IntegrationTaskSyncRepo,
} from './types';
import { authenticateAsIntegrationInstallation } from './utils';

const logger = Logger('github-lens:tasks');

export async function wrapTaskWithRetry(context: GithubRuntimeContext, task: IntegrationTask) {
    if (task.payload.retriesLeft <= 0) {
        logger.info(`task ${task} failed after all retries`, task);
        return;
    }

    const { data: integrationInstallation } =
        await context.api.integrations.getIntegrationInstallationById(
            context.environment.integration.name,
            task.payload.integrationInstallationId
        );

    if (task.payload.integrationConfigurationId !== integrationInstallation.configuration.key) {
        logger.info(`task ${task} will be skipped as the installation configuration has changed`);
        return;
    }

    try {
        await handleIntegrationTask(context, task);
    } catch (error: any) {
        if (error.credentialsExpired) {
            // Generate a new gh installation access token and retry the task
            const installationAccessToken = await createAppInstallationAccessToken(
                context,
                task.payload.githubInstallationId
            );
            await context.api.integrations.queueIntegrationTask(
                context.environment.integration.name,
                {
                    task: {
                        ...task,
                        payload: {
                            ...task.payload,
                            token: installationAccessToken,
                            retriesLeft: task.payload.retriesLeft - 1,
                        },
                    },
                }
            );
        } else if (error.rateLimitExceeded) {
            // Schedule the task for later if we have hit the rate limit
            const installationAccessToken = await createAppInstallationAccessToken(
                context,
                task.payload.githubInstallationId
            );
            const schedule = Math.ceil(Math.abs(Date.now() - error.rateLimitReset) / 1000);
            await context.api.integrations.queueIntegrationTask(
                context.environment.integration.name,
                {
                    task: {
                        ...task,
                        payload: {
                            ...task.payload,
                            token: installationAccessToken,
                            retriesLeft: task.payload.retriesLeft - 1,
                        },
                    },
                    schedule,
                }
            );
        } else {
            logger.error('failed to handle integration task', task, error);
            throw error;
        }
    }
}

async function handleIntegrationTask(context: GithubRuntimeContext, task: IntegrationTask) {
    switch (task.type) {
        case 'sync:repo':
            await taskSyncRepo(context, task);
            break;
        case 'sync:pull-requests':
            await taskSyncPullRequests(context, task);
            break;
        case 'sync:pull-request-comments':
            await taskSyncPullRequestComments(context, task);
            break;
        case 'sync:issues':
            await taskSyncIssues(context, task);
            break;
        case 'sync:issue-comments':
            await taskSyncIssueComments(context, task);
            break;
        case 'sync:releases':
            await taskSyncReleases(context, task);
            break;
        default:
            throw new Error(`Unknown integration task type: ${task}`);
    }
}

async function taskSyncRepo(context: GithubRuntimeContext, task: IntegrationTaskSyncRepo) {
    const { payload } = task;
    const repository = await fetchRepository(context, payload.repositoryId, {
        tokenCredentials: {
            access_token: payload.token,
            expires_at: 0,
        },
    });

    if (repository) {
        const installationContext = await authenticateAsIntegrationInstallation(
            context,
            context.environment.integration.name,
            payload.integrationInstallationId
        );
        await createRepositoryEntity(installationContext, payload.organizationId, repository);

        await Promise.all([
            queueSyncPullRequests(context, {
                ...payload,
                retriesLeft: 3,
                page: 1,
            }),
            queueSyncIssues(context, {
                ...payload,
                retriesLeft: 3,
                page: 1,
            }),
            queueSyncReleases(context, {
                ...payload,
                retriesLeft: 3,
                page: 1,
            }),
        ]);
    }
}

async function taskSyncPullRequests(
    context: GithubRuntimeContext,
    task: IntegrationTaskSyncPullRequests
) {
    const { payload } = task;
    const prs = await fetchPullRequests(context, payload.ownerName, payload.repoName, {
        walkPagination: false,
        per_page: 20,
        page: payload.page,
        tokenCredentials: {
            access_token: payload.token,
            expires_at: 0,
        },
    });

    if (prs.length > 0) {
        const installationContext = await authenticateAsIntegrationInstallation(
            context,
            context.environment.integration.name,
            payload.integrationInstallationId
        );
        await Promise.all(
            prs.map((pr) => {
                return createPullRequestEntity(
                    installationContext,
                    payload.organizationId,
                    payload.repositoryId,
                    pr
                );
            })
        );

        await Promise.all([
            // Next page of pull requests
            queueSyncPullRequests(context, {
                ...payload,
                retriesLeft: 3,
                page: (task.payload.page || 0) + 1,
            }),
            ...prs.map((pr) => {
                return queueSyncPullRequestComments(context, {
                    ...payload,
                    page: 1,
                    retriesLeft: 3,
                    pullRequest: pr.number,
                });
            }),
        ]);
    }
}

async function taskSyncPullRequestComments(
    context: GithubRuntimeContext,
    task: IntegrationTaskSyncPullRequestComments
) {
    const { payload } = task;
    const comments = await fetchPullRequestComments(
        context,
        payload.ownerName,
        payload.repoName,
        payload.pullRequest,
        {
            walkPagination: false,
            per_page: 45,
            page: payload.page,
            tokenCredentials: {
                access_token: payload.token,
                expires_at: 0,
            },
        }
    );

    if (comments.length > 0) {
        const installationContext = await authenticateAsIntegrationInstallation(
            context,
            context.environment.integration.name,
            payload.integrationInstallationId
        );
        await Promise.all(
            comments.map((comment) => {
                return createPullRequestCommentEntity(
                    installationContext,
                    payload.organizationId,
                    payload.pullRequest,
                    comment
                );
            })
        );

        // Next page of pull request comments
        await queueSyncPullRequestComments(context, {
            ...payload,
            retriesLeft: 3,
            page: (task.payload.page || 0) + 1,
        });
    }
}

async function taskSyncIssues(context: GithubRuntimeContext, task: IntegrationTaskSyncIssues) {
    const { payload } = task;
    const issues = await fetchIssues(context, payload.ownerName, payload.repoName, {
        walkPagination: false,
        per_page: 20,
        page: payload.page,
        tokenCredentials: {
            access_token: payload.token,
            expires_at: 0,
        },
    });

    if (issues.length > 0) {
        const installationContext = await authenticateAsIntegrationInstallation(
            context,
            context.environment.integration.name,
            payload.integrationInstallationId
        );

        await Promise.all(
            issues.map((issue) => {
                return createIssueEntity(
                    installationContext,
                    payload.organizationId,
                    payload.repositoryId,
                    issue
                );
            })
        );

        await Promise.all([
            queueSyncIssues(context, {
                ...payload,
                retriesLeft: 3,
                page: (task.payload.page || 0) + 1,
            }),
            ...issues.map((issue) => {
                if (issue.comments === 0) {
                    return;
                }

                return queueSyncIssueComments(context, {
                    ...payload,
                    page: 1,
                    retriesLeft: 3,
                    issue: issue.number,
                });
            }),
        ]);
    }
}

async function taskSyncIssueComments(
    context: GithubRuntimeContext,
    task: IntegrationTaskSyncIssueComments
) {
    const { payload } = task;
    const comments = await fetchIssueComments(
        context,
        payload.ownerName,
        payload.repoName,
        payload.issue,
        {
            walkPagination: false,
            per_page: 20,
            page: payload.page,
            tokenCredentials: {
                access_token: payload.token,
                expires_at: 0,
            },
        }
    );

    if (comments.length > 0) {
        const installationContext = await authenticateAsIntegrationInstallation(
            context,
            context.environment.integration.name,
            payload.integrationInstallationId
        );
        await Promise.all(
            comments.map((comment) => {
                return createIssueCommentEntity(
                    installationContext,
                    payload.organizationId,
                    payload.issue,
                    comment
                );
            })
        );

        await queueSyncIssueComments(context, {
            ...payload,
            retriesLeft: 3,
            page: (task.payload.page || 0) + 1,
        });
    }
}

async function taskSyncReleases(context: GithubRuntimeContext, task: IntegrationTaskSyncReleases) {
    const { payload } = task;
    const releases = await fetchReleases(context, payload.ownerName, payload.repoName, {
        walkPagination: false,
        per_page: 45,
        page: payload.page,
        tokenCredentials: {
            access_token: payload.token,
            expires_at: 0,
        },
    });

    if (releases.length > 0) {
        const installationContext = await authenticateAsIntegrationInstallation(
            context,
            context.environment.integration.name,
            payload.integrationInstallationId
        );
        await Promise.all(
            releases.map((release) => {
                return createReleaseEntity(
                    installationContext,
                    payload.organizationId,
                    payload.repositoryId,
                    release
                );
            })
        );

        await queueSyncReleases(context, {
            ...payload,
            retriesLeft: 3,
            page: (task.payload.page || 0) + 1,
        });
    }
}
