import type { GitSyncOperationState, IntegrationSpaceInstallation } from '@gitbook/api';

import type { GitLabSpaceConfiguration } from './types';

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
 * Parse the numeric project ID from the project input string or configuration.
 * This will `throw an error` if the project is not defined.
 */
export function parseProjectOrThow(input: string | GitLabSpaceConfiguration): number {
    const project = typeof input === 'string' ? input : input.project;
    assertIsDefined(project, { label: 'project' });
    if (!project) {
        throw new Error('Expected a project');
    }

    return parseInt(project, 10);
}

/**
 * Get the space configuration for the current space installation.
 * This will throw an error if the space installation configuration is not defined.
 */
export function getSpaceConfigOrThrow(
    spaceInstallation: IntegrationSpaceInstallation
): GitLabSpaceConfiguration {
    const config = spaceInstallation.configuration as GitLabSpaceConfiguration | undefined;
    assertIsDefined(config, { label: 'spaceInstallationConfiguration' });
    return config;
}

/**
 * Compute the query key for the configuration. This will be useful to list or find
 * all configuration(s) that match this combination of project ID and ref.
 */
export function computeConfigQueryKey(projectId: number, ref: string): string {
    return JSON.stringify({
        projectId,
        ref,
    });
}

export function assertIsDefined<T>(
    value: T,
    options: { label: string }
): asserts value is NonNullable<T> {
    if (value === undefined || value === null) {
        throw new Error(`Expected value (${options.label}) to be defined, but received ${value}`);
    }
}
