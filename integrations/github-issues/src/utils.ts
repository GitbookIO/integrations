import { GitHubIssuesRuntimeContext } from './types';

/**
 * Get all GitHub installation IDs associated with a GitBook integration installation.
 */
export function getGitHubInstallationIds(context: GitHubIssuesRuntimeContext): string[] {
    const { installation } = context.environment;
    if (!installation) {
        return [];
    }

    return installation.configuration.installation_ids || [];
}
