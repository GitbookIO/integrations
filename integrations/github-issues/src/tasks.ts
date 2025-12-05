import { Logger } from '@gitbook/runtime';
import {
    getGitHubRepoClosedIssueIdsLast30Days,
    getGitHubRepoIssuesByIds,
    getOctokitClientForInstallation,
} from './github-api';
import {
    GitHubIssuesIntegrationIngestRepoClosedIssues,
    GitHubIssuesIntegrationIngestRepoIssuesBatch,
    GitHubIssuesIntegrationTask,
    GitHubIssuesRuntimeContext,
} from './types';
import pMap from 'p-map';
import { ingestGitHubIssue } from './ingestion';

const logger = Logger('github-issues:tasks');

/**
 * Handle an Github integration dispatched task.
 */
export async function handleGitHubIssuesIntegrationTask(
    task: GitHubIssuesIntegrationTask,
    context: GitHubIssuesRuntimeContext,
): Promise<void> {
    const { type: taskType } = task;
    switch (taskType) {
        case 'ingest:github-repo:closed-issues': {
            await handleIngestGitHubRepoClosedIssuesTask(task, context);
            break;
        }
        case 'ingest:github-repo:issues-batch': {
            await handleIngestGitHubRepoIssuesBatch(task, context);
            break;
        }
        default:
            throw new Error(`Unknown github-issues integration task type: ${task}`);
    }
}

/**
 * Handle the ingestion of all closed issues of a GitHub repository.
 */
async function handleIngestGitHubRepoClosedIssuesTask(
    task: GitHubIssuesIntegrationIngestRepoClosedIssues,
    context: GitHubIssuesRuntimeContext,
) {
    const { payload } = task;
    const octokit = await getOctokitClientForInstallation(context, payload.githubInstallationId);

    let after: string | null = null;
    const limit = 50;

    let hasNextPage = true;

    const pendingTasksPromises: Array<Promise<void>> = [];

    let totalIssuesToIngest = 0;
    while (hasNextPage) {
        const response = await getGitHubRepoClosedIssueIdsLast30Days({
            octokit,
            repository: payload.repository,
            page: { after, limit },
        });

        if (!response.search) {
            break;
        }

        pendingTasksPromises.push(
            context.integration.queueTask({
                task: {
                    type: 'ingest:github-repo:issues-batch',
                    payload: {
                        gitbookInstallationId: payload.gitbookInstallationId,
                        githubInstallationId: payload.githubInstallationId,
                        organization: payload.organization,
                        repository: payload.repository,
                        issuesIds: response.search.nodes.map((issue) => issue.id),
                    },
                },
            }),
        );

        totalIssuesToIngest += response.search.nodes.length;

        hasNextPage = response.search.pageInfo.hasNextPage;
        after = response.search.pageInfo.endCursor ?? null;
    }

    context.waitUntil(Promise.all(pendingTasksPromises));

    logger.info(
        `Dispatched ${totalIssuesToIngest} issues to ingest from ${payload.repository.owner}/${payload.repository.name} (GitBook installation ${payload.gitbookInstallationId})`,
    );
}

/**
 * Handle the ingestion of a batch of issues from a GitHub repository.
 */
async function handleIngestGitHubRepoIssuesBatch(
    task: GitHubIssuesIntegrationIngestRepoIssuesBatch,
    context: GitHubIssuesRuntimeContext,
) {
    const { payload } = task;
    const octokit = await getOctokitClientForInstallation(context, payload.githubInstallationId);

    const response = await getGitHubRepoIssuesByIds({ octokit, issueIds: payload.issuesIds });

    if (!response.nodes || response.nodes.length === 0) {
        logger.info(
            `No GitHub issues found with IDs: ${JSON.stringify(payload.issuesIds)} for GitBook installation ${payload.gitbookInstallationId}`,
        );
        return;
    }

    const issues = response.nodes;
    let totalIngested = 0;

    await pMap(
        issues,
        async (issue) => {
            await ingestGitHubIssue({
                organizationId: payload.organization,
                gitbookInstallationId: payload.gitbookInstallationId,
                issue,
                context,
            });

            totalIngested += 1;
        },
        { concurrency: 5 },
    );

    logger.info(
        `Ingested ${totalIngested} issues from ${payload.repository.owner}/${payload.repository.name} (GitBook installation ${payload.gitbookInstallationId})`,
    );
}
