import {
    ContentVisibility,
    GitSyncOperationState,
    IntegrationSpaceInstallation,
    Revision,
} from '@gitbook/api';
import { Logger } from '@gitbook/runtime';

import {
    getGitCommitURL,
    getGitTreeURL,
    getRepositoryAuth,
    getRepositoryUrl,
    updateCommitStatus,
} from './provider';
import { GitLabRuntimeContext, GitLabSpaceConfiguration } from './types';
import {
    assertIsDefined,
    getGitSyncCommitMessage,
    getGitSyncStateDescription,
    getSpaceConfigOrThrow,
} from './utils';

const logger = Logger('gitlab:sync');

/**
 * Trigger an import to GitBook space.
 */
export async function triggerImport(
    context: GitLabRuntimeContext,
    spaceInstallation: IntegrationSpaceInstallation,
    options: {
        /**
         * To import from the provider a standalone content.
         * Main space content will not be updated.
         */
        standalone?: {
            ref: string;
        };

        /** Force the synchronization even if content has already been imported */
        force?: boolean;

        /** Whether the git info should be updated on the space */
        updateGitInfo?: boolean;

        /**
         * The timestamp of the event that triggers the import.
         *
         * This is to help ensures that Git sync import and export operations are executed
         * in the same order on GitBook and on the remote repository.
         */
        eventTimestamp?: Date;
    } = {},
) {
    const { api } = context;
    const { force = false, updateGitInfo = false, standalone, eventTimestamp } = options;

    const config = getSpaceConfigOrThrow(spaceInstallation);

    const spaceId =
        typeof spaceInstallation.space === 'string'
            ? spaceInstallation.space
            : spaceInstallation.space.id;

    if (!config.key) {
        logger.info(`No configuration found for space ${spaceId}, skipping import`);
        return;
    }

    assertIsDefined(config.branch, { label: 'config.branch' });

    logger.info(`Initiating an import from GitLab to GitBook space ${spaceId}`);

    const repoTreeURL = getGitTreeURL(config);
    const auth = await getRepositoryAuth(config);

    const urlWithAuth = new URL(getRepositoryUrl(config, true));
    urlWithAuth.username = auth.username;
    urlWithAuth.password = auth.password;

    await api.spaces.importGitRepository(spaceId, {
        url: urlWithAuth.toString(),
        ref: standalone?.ref || config.branch,
        repoTreeURL,
        repoCommitURL: getGitCommitURL(config),
        repoProjectDirectory: config.projectDirectory,
        repoCacheID: config.key,
        force,
        timestamp: eventTimestamp && !force ? eventTimestamp.toISOString() : undefined,
        standalone: !!standalone,
        ...(updateGitInfo ? { gitInfo: { provider: 'gitlab', url: repoTreeURL } } : {}),
    });
}

/**
 * Trigger an export to GitLab.
 */
export async function triggerExport(
    context: GitLabRuntimeContext,
    spaceInstallation: IntegrationSpaceInstallation,
    options: {
        /** Force the synchronization even if content has already been exported */
        force?: boolean;

        /** Whether the git info should be updated on the space */
        updateGitInfo?: boolean;

        /**
         * The timestamp of the event that triggers the export.
         *
         * This is to help ensures that Git sync import and export operations are executed
         * in the same order on GitBook and on the remote repository.
         */
        eventTimestamp?: Date;
    } = {},
) {
    const { api } = context;
    const { force = false, updateGitInfo = false, eventTimestamp } = options;

    const config = getSpaceConfigOrThrow(spaceInstallation);

    const spaceId =
        typeof spaceInstallation.space === 'string'
            ? spaceInstallation.space
            : spaceInstallation.space.id;

    if (!config.key) {
        logger.info(`No configuration found for space ${spaceId}, skipping export`);
        return;
    }

    assertIsDefined(config.branch, { label: 'config.branch' });

    logger.info(`Initiating an export from space ${spaceId} to GitLab`);

    const { data: revision } = await api.spaces.getCurrentRevision(spaceId);

    const auth = await getRepositoryAuth(config);
    const repoTreeURL = getGitTreeURL(config);

    const urlWithAuth = new URL(getRepositoryUrl(config, true));
    urlWithAuth.username = auth.username;
    urlWithAuth.password = auth.password;

    await api.spaces.exportToGitRepository(spaceId, {
        url: urlWithAuth.toString(),
        ref: config.branch,
        repoTreeURL,
        repoCommitURL: getGitCommitURL(config),
        repoProjectDirectory: config.projectDirectory,
        repoCacheID: config.key,
        force,
        timestamp: eventTimestamp && !force ? eventTimestamp.toISOString() : undefined,
        commitMessage: getCommitMessageForRevision(config, revision),
        ...(updateGitInfo ? { gitInfo: { provider: 'gitlab', url: repoTreeURL } } : {}),
    });
}

/**
 * Update the commit status on GitLab with the given state.
 * If the space is public, we also add a link to the public content.
 */
export async function updateCommitWithPreviewLinks(
    runtime: GitLabRuntimeContext,
    spaceInstallation: IntegrationSpaceInstallation,
    revisionId: string,
    commitSha: string,
    state: GitSyncOperationState,
) {
    const config = getSpaceConfigOrThrow(spaceInstallation);

    const { data: space } = await runtime.api.spaces.getSpaceById(
        typeof spaceInstallation.space === 'string'
            ? spaceInstallation.space
            : spaceInstallation.space.id,
    );

    const context = `GitBook${config.projectDirectory ? ` (${config.projectDirectory})` : ''}`;

    const mainStatus = updateCommitStatus(config, commitSha, {
        state,
        description: getGitSyncStateDescription(state),
        url: `${space.urls.app}~/revisions/${revisionId}/`,
        context,
    });

    let publicStatus: Promise<any> | undefined;
    if (space.visibility === ContentVisibility.Public) {
        const publicUrl = space.urls.public;
        if (publicUrl) {
            publicStatus = updateCommitStatus(config, commitSha, {
                state,
                description: getGitSyncStateDescription(state),
                url: `${publicUrl}~/revisions/${revisionId}/`,
                context: `${context} - ${new URL(publicUrl).hostname}`,
            });
        }
    }

    await Promise.all([mainStatus, publicStatus]);
}

/**
 * Get the commit message for the export of a revision.
 */
function getCommitMessageForRevision(config: GitLabSpaceConfiguration, revision: Revision): string {
    const changeRequest = revision.type === 'merge' ? revision.mergedFrom : null;

    if (!changeRequest) {
        return `GitBook: No commit message`;
    }

    return getGitSyncCommitMessage(config.commitMessageTemplate, {
        change_request_number: changeRequest.number,
        change_request_subject: changeRequest.subject,
    });
}
