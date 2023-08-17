import { ContentVisibility, GitSyncOperationState } from '@gitbook/api';
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
import { assertIsDefined, getGitSyncStateDescription } from './utils';

const logger = Logger('github:sync');

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
    const { environment } = context;
    const { force = false, updateGitInfo = false, standalone } = options;

    logger.info('Initiating an import to GitBook');

    const spaceInstallation = environment.spaceInstallation;

    assertIsDefined(spaceInstallation);

    const repoURL = getRepositoryUrl(config, true);
    const auth = await getRepositoryAuth(config);

    const urlWithAuth = new URL(repoURL);
    urlWithAuth.username = auth.username;
    urlWithAuth.password = auth.password;

    await context.api.spaces.importGitRepository(spaceInstallation.space, {
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
 * Trigger an export to GitHub.
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
    const { environment } = context;
    const { force = false, updateGitInfo = false } = options;

    logger.info('Initiating an export to GitHub');

    const spaceInstallation = environment.spaceInstallation;

    assertIsDefined(spaceInstallation);

    const repoURL = getRepositoryUrl(config, true);
    const auth = await getRepositoryAuth(config);

    const urlWithAuth = new URL(repoURL);
    urlWithAuth.username = auth.username;
    urlWithAuth.password = auth.password;

    await context.api.spaces.exportToGitRepository(spaceInstallation.space, {
        url: urlWithAuth.toString(),
        ref: getGitRef(config.branch ?? ''),
        repoTreeURL: getGitTreeURL(config),
        repoCommitURL: getGitCommitURL(config),
        repoProjectDirectory: config.projectDirectory,
        repoCacheID: config.key,
        force,
        // FIXME: compute proper commitMessage using revision.mergedFrom
        commitMessage: 'export',
        ...(updateGitInfo ? { gitInfo: { provider: 'github', url: repoURL } } : {}),
    });
}

/**
 * Update the commit status on GitHub with the given state.
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
