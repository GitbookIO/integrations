import pMap from 'p-map';

import { ExposableError, Logger } from '@gitbook/runtime';
import { GitHubIssuesRuntimeContext } from './types';
import { getGitHubInstallationIds } from './utils';
import { fetchGitHubReposForInstallation, getOctokitClientForInstallation } from './github-client';
import { queueGitHubIssuesIntegrationTask } from './tasks';

const logger = Logger('github-issues:ingest');

/**
 * Trigger the GitBook Agent ingestion of all issues from all of the
 * linked GitHub respositories of a GitBook installation.
 */
export async function triggerInitialIngestionForGitBookInstallation(
    context: GitHubIssuesRuntimeContext,
) {
    const { installation: gitbookInstallation } = context.environment;
    if (!gitbookInstallation) {
        throw new ExposableError('GitBook installation not found');
    }

    const githubInstallationIds = getGitHubInstallationIds(context);
    if (githubInstallationIds.length === 0) {
        throw new ExposableError('No GitHub App installation IDs found');
    }

    let totalRepoToProcess = 0;
    const pendingTasks: Array<Promise<void>> = [];
    await pMap(
        githubInstallationIds,
        async (githubInstallationId) => {
            try {
                const octokit = await getOctokitClientForInstallation(
                    context,
                    githubInstallationId,
                );
                const repos = await fetchGitHubReposForInstallation(octokit, githubInstallationId);

                if (repos.length === 0) {
                    logger.info(
                        `No GitHub repositories found for installation ${githubInstallationId}. Skipping.`,
                    );
                    return;
                }

                totalRepoToProcess += repos.length;
                for (const repo of repos) {
                    pendingTasks.push(
                        queueGitHubIssuesIntegrationTask(context, {
                            type: 'ingest:github-installation:repo-issues',
                            payload: {
                                organization: gitbookInstallation.target.organization,
                                gitbookInstallationId: gitbookInstallation.id,
                                githubInstallationId: Number(githubInstallationId),
                                repository: {
                                    name: repo.name,
                                    owner: repo.owner.login,
                                },
                            },
                        }),
                    );
                }
            } catch (err) {
                logger.error(
                    `Error while fetching repositories for installation ${githubInstallationId}`,
                    err,
                );
                return;
            }
        },
        { concurrency: 5 },
    );

    logger.info(
        `Dispatched ${pendingTasks.length} tasks to ingest a total of ${totalRepoToProcess} github repositories`,
    );

    context.waitUntil(Promise.all(pendingTasks));
}
