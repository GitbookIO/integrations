import { GitSyncOperationState, IntegrationSpaceInstallation } from '@gitbook/api';

import type { GitHubSpaceConfiguration } from './types';

export const BRANCH_REF_PREFIX = 'refs/heads/';

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
    },
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
    spaceInstallation: IntegrationSpaceInstallation,
): GitHubSpaceConfiguration {
    const config = spaceInstallation.configuration as GitHubSpaceConfiguration | undefined;
    assertIsDefined(config, { label: 'spaceInstallationConfiguration' });
    return config;
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
    previewExternalBranches?: boolean,
): string {
    const base = `ins:${installationId}:rep:${repoID}:br:${ref}`;
    return previewExternalBranches ? `${base}:prv:${previewExternalBranches}` : base;
}

export function assertIsDefined<T>(
    value: T,
    options: {
        label: string;
    },
): asserts value is NonNullable<T> {
    if (value === undefined || value === null) {
        throw new Error(`Expected value (${options.label}) to be defined, but received ${value}`);
    }
}

/**
 * Convert an array buffer to a hex string
 */
export function arrayToHex(arr: ArrayBuffer) {
    return [...new Uint8Array(arr)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Constant-time string comparison. Equivalent of `crypto.timingSafeEqual`.
 **/
export function safeCompare(expected: string, actual: string) {
    const lenExpected = expected.length;
    let result = 0;

    if (lenExpected !== actual.length) {
        actual = expected;
        result = 1;
    }

    for (let i = 0; i < lenExpected; i++) {
        result |= expected.charCodeAt(i) ^ actual.charCodeAt(i);
    }

    return result === 0;
}

/**
 * Project directory should be a relative path and not end with a slash.
 * We make sure that the value is normalized.
 */
export function normalizeProjectDirectory(
    projectDirectory: string | undefined,
): string | undefined {
    if (typeof projectDirectory === 'undefined') {
        return projectDirectory;
    }

    let relativeDirectory = projectDirectory.trim();

    while (relativeDirectory.startsWith('/')) {
        relativeDirectory = relativeDirectory.slice(1);
    }

    while (relativeDirectory.endsWith('/')) {
        relativeDirectory = relativeDirectory.slice(0, -1);
    }

    return relativeDirectory;
}
