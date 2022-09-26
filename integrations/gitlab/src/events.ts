import {
    IntegrationInstallationStatus,
    RequestExportToGitRepository,
    SpaceContentUpdatedEvent,
    SpaceGitSyncCompletedEvent,
    SpaceGitSyncStartedEvent,
    SpaceInstallationSetupEvent,
} from '@gitbook/api';

import { GitLabRuntimeContext, GitLabSpaceInstallationConfiguration } from './configuration';
import {
    getGitCommitsURL,
    getGitRepoAuthURL,
    getGitTreeURL,
    getRepoCacheID,
    updateGitLabProjectCommitStatus,
} from './gitlab';
import { installGitLabWebhook, uninstallGitLabWebhook } from './webhooks';

/**
 * Check if we should update the webhook.
 */
export function shouldUpdateGitLabWebHook(
    newConf: GitLabSpaceInstallationConfiguration,
    previous: {
        status: IntegrationInstallationStatus;
        conf: GitLabSpaceInstallationConfiguration;
    }
) {
    return (
        newConf.project !== previous.conf.project ||
        newConf.auth_token !== previous.conf.auth_token ||
        newConf.gitlab_host !== previous.conf.gitlab_host ||
        (previous.status === IntegrationInstallationStatus.Pending &&
            !previous.conf.ref &&
            newConf.ref)
    );
}

/**
 * Handle a space_installation_setup GitBook event.
 * Install the GitLab webhook event handler and start an import/export depending on the priority.
 */
export async function handleSpaceInstallationSetupEvent(
    event: SpaceInstallationSetupEvent,
    context: GitLabRuntimeContext
) {
    const { api, environment } = context;
    const { status, installationId, spaceId, previous } = event;

    if (status === IntegrationInstallationStatus.Pending) {
        // eslint-disable-next-line no-console
        console.info(
            `GitLab integration Space installation ${spaceId}/${installationId} is not complete. Skipping.`
        );
        return;
    }

    const { configuration, urls } = environment.spaceInstallation;
    if (status === IntegrationInstallationStatus.Active) {
        if (!configuration?.project || !configuration?.auth_token) {
            throw new Error(
                `No GitLab project or auth token provided for Space installation ${spaceId}/${installationId}`
            );
        }

        const previousConfig = previous.configuration as GitLabSpaceInstallationConfiguration;
        if (
            previousConfig &&
            !shouldUpdateGitLabWebHook(configuration, {
                status: previous.status,
                conf: previousConfig,
            })
        ) {
            return;
        }

        // @ts-ignore
        const prevHookId = previous.configuration?.hook_id;
        if (previousConfig && prevHookId) {
            // eslint-disable-next-line no-console
            console.info(
                `A webhook (ID: ${prevHookId}) is already installed in GitLab project ${previousConfig.project} for Space installation ${installationId}/${spaceId}. Uninstalling.`
            );
            await uninstallGitLabWebhook(prevHookId, previousConfig);
        }

        const newHookId = await installGitLabWebhook(
            `${urls.publicEndpoint}/webhook`,
            configuration
        );
        await api.integrations.updateIntegrationSpaceInstallation(
            environment.integration.name,
            installationId,
            spaceId,
            {
                configuration: {
                    ...configuration,
                    hook_id: newHookId,
                },
            }
        );

        // eslint-disable-next-line no-console
        console.info(
            `Webhook ID: ${newHookId} installed in GitLab project ${configuration.project} for Space installation ${installationId}/${spaceId}.`
        );
    }
}

/**
 * Handle a space_content_updated GitBook event.
 * Trigger a Git sync export to the GitLab project.
 */
export async function handleSpaceContentUpdatedEvent(
    event: SpaceContentUpdatedEvent,
    context: GitLabRuntimeContext
) {
    const { spaceId, revisionId, installationId } = event;
    const { api, environment } = context;

    const { spaceInstallation } = environment;

    if (!spaceInstallation) {
        return;
    }

    const { data: revision } = await api.spaces.getRevisionById(spaceId, revisionId);

    if (revision.git && revision.git.oid) {
        // Skip the export if the revision was already git synced.
        // We shouldn't have to check explicitly that it's not a rollback as we don't
        // duplicate the git informations when creating the rollback Revision.
        const revisionStatus = revision.git.createdByGitBook ? 'exported' : 'imported';
        // eslint-disable-next-line no-console
        console.info(
            `Skipping GitLab sync export for space ${spaceId} revision ${revisionId} as it was already ${revisionStatus}`
        );
        return;
    }

    const { configuration } = spaceInstallation;

    if (!configuration.auth_token || !configuration.project || !configuration.ref) {
        // eslint-disable-next-line no-console
        console.info(
            `Skipping GitLab sync export as the Space installation ${spaceId}/${installationId} is not complete. Skipping.`
        );
        return;
    }

    // Trigger a Git sync export.
    const exportRequest: RequestExportToGitRepository = {
        url: getGitRepoAuthURL(configuration),
        ref: configuration.ref,
        repoCacheID: getRepoCacheID(environment),
        repoCommitURL: getGitCommitsURL(configuration),
        repoTreeURL: getGitTreeURL(configuration),
    };
    await api.spaces.exportToGitRepository(spaceId, exportRequest);
}

/**
 * Return the commit check description for a state.
 */
function getCommitStatusDescription(state: 'running' | 'success' | 'failure'): string {
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
 * Update the commit check status in GitLab with the progress of the Git Sync and a preview link.
 * It also add a link to the public content when the Space is public or unlisted.
 */
async function updateCommitStatusWithPreviewLinks(
    commitSha: string,
    state: 'running' | 'success' | 'failure',
    previewLinks: {
        app: string;
        public?: string;
    },
    configuration: GitLabSpaceInstallationConfiguration
) {
    // Send an additional commit status update when the Space is public or unlisted.
    if (previewLinks.public) {
        await updateGitLabProjectCommitStatus(
            configuration.project,
            commitSha,
            {
                context: `GitBook - ${new URL(previewLinks.public).hostname}`,
                description: getCommitStatusDescription(state),
                state,
                url: previewLinks.public,
            },
            configuration
        );
    }

    await updateGitLabProjectCommitStatus(
        configuration.project,
        commitSha,
        {
            context: `GitBook`,
            description: getCommitStatusDescription(state),
            state,
            url: previewLinks.app,
        },
        configuration
    );
}

/**
 * Handle a space_gitsync_started or space_gitsync_completed GitBook event.
 * Update the commit status in GitLab with the final state of the sync.
 */
export async function handleSpaceGitSyncProgressStatusEvents(
    event: SpaceGitSyncStartedEvent | SpaceGitSyncCompletedEvent,
    context: GitLabRuntimeContext
) {
    const { revisionId, commitId } = event;
    const { api, environment } = context;
    const { spaceInstallation } = environment;

    if (!spaceInstallation) {
        return;
    }

    const { space, configuration } = spaceInstallation;

    const {
        data: { urls },
    } = await api.spaces.getRevisionById(space, revisionId);

    const status = event.type === 'space_gitsync_completed' ? event.state : 'running';
    await updateCommitStatusWithPreviewLinks(commitId, status, urls, configuration);
}
