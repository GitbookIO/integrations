import type { Octokit } from 'octokit';

import { Logger } from '@gitbook/runtime';
import { GitHubIssuesRepository } from '../types';

const logger = Logger('github-issues:github-client');

/**
 * Fetch repositories with issues from a specific GitHub App installation
 */
export async function getGitHubReposForInstallation(
    octokit: Octokit,
    installationId: string,
): Promise<GitHubIssuesRepository[]> {
    try {
        const response = await octokit.request('GET /installation/repositories', {
            per_page: 100,
        });

        const repositories = response.data.repositories;

        return repositories.filter((repo) => repo.has_issues);
    } catch (error) {
        logger.error(
            `Failed to fetch GitHub repositories with issue for installation ${installationId}: `,
            error instanceof Error ? error.message : String(error),
        );
        return [];
    }
}
