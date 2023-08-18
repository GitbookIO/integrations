import { ContentVisibility, GitSyncOperationState, Revision } from '@gitbook/api';
import { Logger } from '@gitbook/runtime';

import {
    getGitCommitURL,
    getGitRef,
    getGitTreeURL,
    getRepositoryAuth,
    getRepositoryUrl,
    updateCommitStatus,
} from './provider';
import { GitLabRuntimeContext, GitLabSpaceConfiguration } from './types';
import { assertIsDefined, getGitSyncCommitMessage, getGitSyncStateDescription } from './utils';

const logger = Logger('gitlab:sync');

/**
 * Trigger an import to GitBook space.
 */
export async function triggerImport(
    context: GitLabRuntimeContext,
    config: GitLabSpaceConfiguration,
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
    } = {}
) {
    const { environment, api } = context;
    const { force = false, updateGitInfo = false, standalone } = options;

    const spaceInstallation = environment.spaceInstallation;
    assertIsDefined(spaceInstallation);

    logger.info(`Initiating an import from GitLab to GitBook space ${spaceInstallation.space}`);

    const repoURL = getRepositoryUrl(config, true);
    const auth = await getRepositoryAuth(config);

    const urlWithAuth = new URL(repoURL);
    urlWithAuth.username = auth.username;
    urlWithAuth.password = auth.password;

    await api.spaces.importGitRepository(spaceInstallation.space, {
        url: urlWithAuth.toString(),
        ref: standalone?.ref ?? getGitRef(config.branch ?? ''),
        repoTreeURL: getGitTreeURL(config),
        repoCommitURL: getGitCommitURL(config),
        repoProjectDirectory: config.projectDirectory,
        repoCacheID: config.key,
        force,
        standalone: !!standalone,
        ...(updateGitInfo ? { gitInfo: { provider: 'gitlab', url: repoURL } } : {}),
    });
}

/**
 * Trigger an export to GitLab.
 */
export async function triggerExport(
    context: GitLabRuntimeContext,
    config: GitLabSpaceConfiguration,
    options: {
        /** Force the synchronization even if content has already been exported */
        force?: boolean;

        /** Whether the git info should be updated on the space */
        updateGitInfo?: boolean;
    } = {}
) {
    const { environment, api } = context;
    const { force = false, updateGitInfo = false } = options;

    const spaceInstallation = environment.spaceInstallation;
    assertIsDefined(spaceInstallation);

    logger.info(`Initiating an export from space ${spaceInstallation.space} to GitLab`);

    const { data: revision } = await api.spaces.getCurrentRevision(spaceInstallation.space);

    const repoURL = getRepositoryUrl(config, true);
    const auth = await getRepositoryAuth(config);

    const urlWithAuth = new URL(repoURL);
    urlWithAuth.username = auth.username;
    urlWithAuth.password = auth.password;

    await api.spaces.exportToGitRepository(spaceInstallation.space, {
        url: urlWithAuth.toString(),
        ref: getGitRef(config.branch ?? ''),
        repoTreeURL: getGitTreeURL(config),
        repoCommitURL: getGitCommitURL(config),
        repoProjectDirectory: config.projectDirectory,
        repoCacheID: config.key,
        force,
        commitMessage: getCommitMessageForRevision(config, revision),
        ...(updateGitInfo ? { gitInfo: { provider: 'gitlab', url: repoURL } } : {}),
    });
}

/**
 * Update the commit status on GitLab with the given state.
 * If the space is public, we also add a link to the public content.
 */
export async function updateCommitWithPreviewLinks(
    runtime: GitLabRuntimeContext,
    spaceId: string,
    revisionId: string,
    config: GitLabSpaceConfiguration,
    commitSha: string,
    state: GitSyncOperationState
) {
    const { data: space } = await runtime.api.spaces.getSpaceById(spaceId);

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
