import { GitSyncOperationState } from '@gitbook/api';

import { GitLabRuntimeContext, GitLabSpaceConfiguration } from './types';

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
 * Parse the project ID and project name from the project string
 */
export function parseProject(input: GitLabSpaceConfiguration | string) {
    const project = typeof input === 'string' ? input : input.project;
    if (!project) {
        throw new Error('Expected a project');
    }

    const [projectId, , projectName] = project.split(':');
    return { projectId: parseInt(projectId, 10), projectName };
}

/**
 * Get the space configuration for the current space installation from the context.
 * This will throw an error if the space installation configuration is not defined.
 */
export function getSpaceConfig(context: GitLabRuntimeContext): GitLabSpaceConfiguration {
    const spaceInstallation = context.environment.spaceInstallation;
    assertIsDefined(spaceInstallation);
    return spaceInstallation.configuration;
}

/**
 * Compute the query key for the configuration. This will be useful to list or find
 * all configuration(s) that match this combination of project ID and ref.
 */
export function computeConfigQueryKeyBase(projectId: number, ref: string): string {
    return `${projectId}/${ref}`;
}

/** Create the webhook url for GitLab */
export function createGitLabWebhookURL(context: GitLabRuntimeContext): string {
    return `https://${context.environment.integration.urls.publicEndpoint}/hooks/gitlab?space=${context.environment.spaceInstallation?.space}`;
}

export function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
    if (value === undefined || value === null) {
        throw new Error(`Expected value to be defined, but received ${value}`);
    }
}
