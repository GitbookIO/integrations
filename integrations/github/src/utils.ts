import { GitSyncOperationState, IntegrationSpaceInstallation } from '@gitbook/api';

import type { GitHubSpaceConfiguration } from './types';

/**
 * The default commit message to use when a change request is merged in GitBook
 */
export const GITSYNC_DEFAULT_COMMIT_MESSAGE =
    'GITBOOK-{change_request_number}: {change_request_subject}';

/**
 * Get the commit message to use for a change request. This will use the default commit message
 * if no custom template is provided
 */
export function getGitSyncCommitMessage(
    templateInput: string | undefined,
    context: {
        change_request_number: number;
        change_request_subject: string;
    }
): string {
    const usingCustomTemplate = !!templateInput;
    const template = usingCustomTemplate ? templateInput : GITSYNC_DEFAULT_COMMIT_MESSAGE;
    const subject =
        context.change_request_subject ||
        (usingCustomTemplate ? 'No subject' : 'change request with no subject merged in GitBook');

    return template
        .replace('{change_request_number}', String(context.change_request_number || ''))
        .replace('{change_request_subject}', subject);
}

/**
 * Get description for a Git Sync operationstate.
 */
export function getGitSyncStateDescription(state: GitSyncOperationState): string {
    switch (state) {
        case 'success':
            return 'Content is live on GitBook';
        case 'failure':
            return 'Error while updating content, contact GitBook support';
        default:
            return 'Updating content on GitBook...';
    }
}

/**
 * Get the space configuration for the current space installation.
 * This will throw an error if the space installation configuration is not defined.
 */
export function getSpaceConfigOrThrow(
    spaceInstallation: IntegrationSpaceInstallation
): GitHubSpaceConfiguration {
    const config = spaceInstallation.configuration as GitHubSpaceConfiguration | undefined;
    assertIsDefined(config, { label: 'spaceInstallationConfiguration' });
    return config;
}

/**
 * Parse the GitHub installation ID and account name from the installation string.
 * This will `throw an error` if the installation is not defined.
 */
export function parseInstallationOrThrow(input: GitHubSpaceConfiguration | string): number {
    const installation = typeof input === 'string' ? input : input.installation;
    assertIsDefined(installation, { label: 'installation' });

    return parseInt(installation, 10);
}

/**
 * Parse the repository ID from the repository string.
 * This will `throw an error` if the repository is not defined.
 */
export function parseRepositoryOrThrow(input: GitHubSpaceConfiguration | string): number {
    const repository = typeof input === 'string' ? input : input.repository;
    assertIsDefined(repository, { label: 'repository' });

    return parseInt(repository, 10);
}

/**
 * Compute the query key for the configuration. This will be useful to list or find
 * all configuration(s) that match this combination of installationId, repositoryId
 * ref and previewExternalBranches flag.
 */
export function computeConfigQueryKey(
    installationId: number,
    repoID: number,
    ref: string,
    previewExternalBranches?: boolean
): string {
    return JSON.stringify({
        installationId,
        repoID,
        ref,
        ...(typeof previewExternalBranches === 'boolean' ? { previewExternalBranches } : {}),
    });
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
