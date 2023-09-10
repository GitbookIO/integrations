import {
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

// TODO: schedule task for next hour if rate limit remaining < 100
// write a wrapper to check that and also if the token has expired (so generate new one)

export async function handleIntegrationTask(context: GithubRuntimeContext, task: IntegrationTask) {
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
        await createRepositoryEntity(context, payload.organizationId, repository);

        await Promise.all([
            queueSyncPullRequests(context, {
                ...payload,
                page: 1,
            }),
            queueSyncIssues(context, {
                ...payload,
                page: 1,
            }),
            queueSyncReleases(context, {
                ...payload,
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
        per_page: 20,
        page: payload.page,
        tokenCredentials: {
            access_token: payload.token,
            expires_at: 0,
        },
    });

    if (prs.length > 0) {
        await Promise.all(
            prs.map((pr) => {
                return createPullRequestEntity(
                    context,
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
                page: (task.payload.page || 0) + 1,
            }),
            ...prs.map((pr) => {
                return queueSyncPullRequestComments(context, {
                    ...payload,
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
            per_page: 45,
            page: payload.page,
            tokenCredentials: {
                access_token: payload.token,
                expires_at: 0,
            },
        }
    );

    if (comments.length > 0) {
        await Promise.all(
            comments.map((comment) => {
                return createPullRequestCommentEntity(
                    context,
                    payload.organizationId,
                    payload.pullRequest,
                    comment
                );
            })
        );

        // Next page of pull request comments
        await queueSyncPullRequestComments(context, {
            ...payload,
            page: (task.payload.page || 0) + 1,
        });
    }
}

async function taskSyncIssues(context: GithubRuntimeContext, task: IntegrationTaskSyncIssues) {
    const { payload } = task;
    const issues = await fetchIssues(context, payload.ownerName, payload.repoName, {
        per_page: 20,
        page: payload.page,
        tokenCredentials: {
            access_token: payload.token,
            expires_at: 0,
        },
    });

    if (issues.length > 0) {
        await Promise.all(
            issues.map((issue) => {
                if (issue.pull_request) {
                    return;
                }

                return createIssueEntity(
                    context,
                    payload.organizationId,
                    payload.repositoryId,
                    issue
                );
            })
        );

        await Promise.all([
            queueSyncIssues(context, {
                ...payload,
                page: (task.payload.page || 0) + 1,
            }),
            ...issues.map((issue) => {
                if (issue.pull_request || issue.comments === 0) {
                    return;
                }

                return queueSyncIssueComments(context, {
                    ...payload,
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
    const comments = await fetchPullRequestComments(
        context,
        payload.ownerName,
        payload.repoName,
        payload.issue,
        {
            per_page: 20,
            page: payload.page,
            tokenCredentials: {
                access_token: payload.token,
                expires_at: 0,
            },
        }
    );

    if (comments.length > 0) {
        await Promise.all(
            comments.map((comment) => {
                return createIssueCommentEntity(
                    context,
                    payload.organizationId,
                    payload.issue,
                    comment
                );
            })
        );

        await queueSyncIssueComments(context, {
            ...payload,
            page: (task.payload.page || 0) + 1,
        });
    }
}

async function taskSyncReleases(context: GithubRuntimeContext, task: IntegrationTaskSyncReleases) {
    const { payload } = task;
    const releases = await fetchReleases(context, payload.ownerName, payload.repoName, {
        per_page: 45,
        page: payload.page,
        tokenCredentials: {
            access_token: payload.token,
            expires_at: 0,
        },
    });

    if (releases.length > 0) {
        await Promise.all(
            releases.map((release) => {
                return createReleaseEntity(
                    context,
                    payload.organizationId,
                    payload.repositoryId,
                    release
                );
            })
        );

        await queueSyncReleases(context, {
            ...payload,
            page: (task.payload.page || 0) + 1,
        });
    }
}
