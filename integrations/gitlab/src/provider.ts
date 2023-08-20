import { GitSyncOperationState, IntegrationSpaceInstallation } from '@gitbook/api';
import { Logger } from '@gitbook/runtime';

import {
    getAccessTokenOrThrow,
    addProjectWebhook,
    deleteProjectWebhook,
    editCommitStatus,
} from './api';
import { GitLabRuntimeContext, GitLabSpaceConfiguration } from './types';
import { getSpaceConfigOrThrow, parseProjectOrThow } from './utils';

const logger = Logger('gitlab:provider');

/**
 * Setup the GitLab webhook for the currently configured space installation
 * project
 */
export async function installWebhook(
    context: GitLabRuntimeContext,
    spaceInstallation: IntegrationSpaceInstallation
) {
    const config = getSpaceConfigOrThrow(spaceInstallation);
    const { projectId } = parseProjectOrThow(config);

    const id = await addProjectWebhook(config, projectId, createGitLabWebhookURL(context));

    await context.api.integrations.updateIntegrationSpaceInstallation(
        spaceInstallation.integration,
        spaceInstallation.installation,
        spaceInstallation.space,
        {
            configuration: {
                ...config,
                webhookId: id,
            },
        }
    );

    logger.info(`Webhook ${id} installed on GitLab project ${projectId}`);
}

/**
 * Remove the GitLab webhook for the currently configured space installation
 * project.
 */
export async function uninstallWebhook(
    context: GitLabRuntimeContext,
    spaceInstallation: IntegrationSpaceInstallation
) {
    const config = getSpaceConfigOrThrow(spaceInstallation);

    if (!config.webhookId) {
        return;
    }

    const { projectId } = parseProjectOrThow(config);

    await deleteProjectWebhook(config, projectId, config.webhookId);

    // Remove the webhook ID from the configuration
    // There are chances the config won't exist when the webhook is deleted, so we ignore errors
    await context.api.integrations
        .updateIntegrationSpaceInstallation(
            spaceInstallation.integration,
            spaceInstallation.installation,
            spaceInstallation.space,
            {
                configuration: {
                    ...config,
                    webhookId: undefined,
                },
            }
        )
        .catch(() => {
            // Ignore errors
        });

    logger.info(`Webhook ${config.webhookId} uninstalled from GitLab project ${projectId}`);
}

/**
 * Update the commit status
 */
export async function updateCommitStatus(
    config: GitLabSpaceConfiguration,
    commitSha: string,
    update: {
        context?: string;
        state: GitSyncOperationState;
        url: string;
        description: string;
    }
) {
    const { projectId } = parseProjectOrThow(config);

    await editCommitStatus(config, projectId, commitSha, {
        name: update.context || 'GitBook',
        state: update.state === 'failure' ? 'failed' : update.state,
        target_url: update.url,
        description: update.description,
    });

    logger.info(`Commit status updated for ${commitSha} on GitLab project ${projectId}`);
}

/**
 * Returns the URL of the Git repository.
 */
export function getRepositoryUrl(
    spaceInstallation: IntegrationSpaceInstallation,
    withExtension = false
): string {
    const config = getSpaceConfigOrThrow(spaceInstallation);
    const { projectName } = parseProjectOrThow(config);
    return `${config.customInstanceUrl || 'https://gitlab.com'}/${projectName}${
        withExtension ? '.git' : ''
    }`;
}

/**
 * Returns the authentication information for the Git repository.
 */
export async function getRepositoryAuth(spaceInstallation: IntegrationSpaceInstallation) {
    const config = getSpaceConfigOrThrow(spaceInstallation);
    return {
        username: 'oauth2',
        password: getAccessTokenOrThrow(config),
    };
}

/**
 * Returns the base URL of the Git tree in the provider.
 */
export function getGitTreeURL(spaceInstallation: IntegrationSpaceInstallation): string {
    const base = getRepositoryUrl(spaceInstallation);
    const config = getSpaceConfigOrThrow(spaceInstallation);
    return `${base}/-/blob/${config.branch}`;
}

/**
 * Returns the absolute URL for a commit.
 */
export function getGitCommitURL(spaceInstallation: IntegrationSpaceInstallation): string {
    const base = getRepositoryUrl(spaceInstallation);
    return `${base}/-/commit`;
}

/**
 * Returns the Git ref to use for the synchronization.
 */
export function getGitRef(branch: string): string {
    return `refs/heads/${branch}`;
}

/** Create the webhook url for GitLab */
export function createGitLabWebhookURL(context: GitLabRuntimeContext): string {
    return `${context.environment.integration.urls.publicEndpoint}/hooks/gitlab?space=${context.environment.spaceInstallation?.space}`;
}
