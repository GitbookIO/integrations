import type { Octokit } from 'octokit';

import { Logger } from '@gitbook/runtime';
import { GitHubIssuesRepository } from '../types';
import { GITHUB_API_VERSION } from './utils';

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
            headers: {
                'X-GitHub-Api-Version': GITHUB_API_VERSION,
            },
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
