import { GitSyncOperationState } from '@gitbook/api';

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
 * Parse the installation ID and account name from the installation string
 */
export function parseInstallation(input: GitHubSpaceConfiguration | string) {
    const installation = typeof input === 'string' ? input : input.installation;
    if (!installation) {
        throw new Error('Expected an installation');
    }

    const [installationId, accountName] = installation.split(':');
    return { installationId: parseInt(installationId, 10), accountName };
}

/**
 * Parse the repository ID and repository name from the repository string
 */
export function parseRepository(input: GitHubSpaceConfiguration | string) {
    const repository = typeof input === 'string' ? input : input.repository;
    if (!repository) {
        throw new Error('Expected a repository');
    }

    const [repoID, repoName] = repository.split(':');
    return { repoID: parseInt(repoID, 10), repoName };
}

/**
 * Compute the query key for the configuration. This will be useful to list or find
 * all configuration(s) that match this combination of installation, repository and ref.
 */
export function computeConfigQueryKeyBase(
    installationId: number,
    repoID: number,
    ref: string
): string {
    return `${installationId}/${repoID}/${ref}`;
}

/**
 * Same as computeConfigQueryKeyBase, but with the previewExternalBranches flag.
 */
export function computeConfigQueryKeyPreviewExternalBranches(
    installationId: number,
    repoID: number,
    ref: string
): string {
    return `${computeConfigQueryKeyBase(installationId, repoID, ref)}/previewExternalBranches:true`;
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
