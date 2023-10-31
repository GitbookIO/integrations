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
    return `prj:${projectId}/br:${ref}`;
}

/**
 * Sign a message with a secret key by using HMAC-SHA256 algorithm.
 */
export async function signResponse(message: string, secret: string): Promise<string> {
    const key = await importKey(secret);
    const signed = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
    return arrayToHex(signed);
}

/**
 * Verify that a message matches a signature by using HMAC-SHA256 algorithm.
 */
export async function verifySignature(
    message: string,
    signature: string,
    secret: string
): Promise<boolean> {
    const key = await importKey(secret);
    const sigBuf = hexToArray(signature);
    return await crypto.subtle.verify('HMAC', key, sigBuf, new TextEncoder().encode(message));
}

export function assertIsDefined<T>(
    value: T,
    options: { label: string }
): asserts value is NonNullable<T> {
    if (value === undefined || value === null) {
        throw new Error(`Expected value (${options.label}) to be defined, but received ${value}`);
    }
}

/**
 * Import a secret CryptoKey to use for signing.
 */
async function importKey(secret: string): Promise<CryptoKey> {
    return await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify']
    );
}

/**
 * Convert an array buffer to a hex string
 */
function arrayToHex(arr: ArrayBuffer) {
    return [...new Uint8Array(arr)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export default function hexToArray(input: string) {
    if (input.length % 2 !== 0) {
        throw new RangeError('Expected string to be an even number of characters');
    }

    const view = new Uint8Array(input.length / 2);

    for (let i = 0; i < input.length; i += 2) {
        view[i / 2] = parseInt(input.substring(i, i + 2), 16);
    }

    return view.buffer;
}
