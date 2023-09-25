import { IntegrationInstallation } from '@gitbook/api';

import type { GitHubAccountConfiguration } from './types';

/**
 * Get the account configuration for the current installation.
 * This will throw an error if the installation configuration is not defined.
 */
export function getAccountConfigOrThrow(
    installation: IntegrationInstallation
): GitHubAccountConfiguration {
    const config = installation.configuration as GitHubAccountConfiguration | undefined;
    assertIsDefined(config, { label: 'installationConfiguration' });
    return config;
}

/**
 * Parse the GitHub installation ID from the installation string.
 * This will `throw an error` if the installation is not defined.
 */
export function parseInstallationOrThrow(input: GitHubAccountConfiguration | string): number {
    const installation = typeof input === 'string' ? input : input.installation;
    assertIsDefined(installation, { label: 'installation' });

    return parseInt(installation, 10);
}

export function generateGitHubRepoFullName(owner: string, repo: string): string {
    return `${owner}/${repo}`;
}

export function generateGitHubRepoHtmlUrl(owner: string, repo: string): string {
    return `https://github.com/${generateGitHubRepoFullName(owner, repo)}`;
}

export function assertIsDefined<T>(
    value: T,
    options: {
        label: string;
    }
): asserts value is NonNullable<T> {
    if (value === undefined || value === null) {
        throw new Error(`Expected value (${options.label}) to be defined, but received ${value}`);
    }
}
