import { ContentKitSelectOption, GitSyncOperationState } from '@gitbook/api';

import type { GithubRuntimeContext, GitHubSpaceConfiguration } from './types';

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
 * Get the space configuration for the current space installation from the context.
 * This will throw an error if the space installation configuration is not defined.
 */
export function getSpaceConfigOrThrow(context: GithubRuntimeContext): GitHubSpaceConfiguration {
    const spaceInstallation = context.environment.spaceInstallation;
    assertIsDefined(spaceInstallation, { label: 'spaceInstallation' });
    return spaceInstallation.configuration;
}

/**
 * Parse the GitHub installation ID and account name from the installation string.
 * This will `throw an error` if the installation is not defined.
 */
export function parseInstallationOrThrow(input: GitHubSpaceConfiguration | string) {
    const installation = typeof input === 'string' ? input : input.installation;
    assertIsDefined(installation, { label: 'installation' });

    // Split at first occurrence of colon
    const [installationId, ...rest] = installation.split(':');
    const accountName = rest.join(':');
    return { installationId: parseInt(installationId, 10), accountName };
}

/**
 * Parse the repository ID and repository name from the repository string.
 * This will `throw an error` if the repository is not defined.
 */
export function parseRepositoryOrThrow(input: GitHubSpaceConfiguration | string) {
    const repository = typeof input === 'string' ? input : input.repository;
    assertIsDefined(repository, { label: 'repository' });

    // Split at first occurrence of colon
    const [repoID, ...rest] = repository.split(':');
    const repoName = rest.join(':');
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
 * Utility to map an array of data items to an array of select options.
 *
 * It also takes an optional predicate to push a default option to the result
 * if the predicate is **not** satisfied by any of the data items.
 *
 * The predicate is satisfied if the value of the key in the data item
 * is equal to the value provided in the predicate.
 */
export function mapDataToOptions<T extends object>(
    data: T[],
    mapper: (item: T) => ContentKitSelectOption,
    defaultPredicate?: {
        key: keyof T;
        value: T[keyof T];
        option: ContentKitSelectOption;
    }
): ContentKitSelectOption[] {
    const options: ContentKitSelectOption[] = [];
    let satisfiesPredicate = false;

    for (const item of data) {
        options.push(mapper(item));

        if (defaultPredicate && item[defaultPredicate.key] === defaultPredicate.value) {
            satisfiesPredicate = true;
        }
    }

    // If the predicate is not satisfied, we push the default option
    if (defaultPredicate && !satisfiesPredicate) {
        options.push(defaultPredicate.option);
    }

    return options;
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
