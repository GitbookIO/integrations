import { GitSyncOperationState } from '@gitbook/api';
import { Logger } from '@gitbook/runtime';

import {
    getAccessTokenOrThrow,
    addProjectWebhook,
    deleteProjectWebhook,
    editCommitStatus,
} from './api';
import { GitLabRuntimeContext, GitLabSpaceConfiguration } from './types';
import { assertIsDefined, parseProjectOrThow } from './utils';

const logger = Logger('gitlab:provider');

/**
 * Setup the GitLab webhook for the currently configured project.
 */
export async function installWebhook(
    context: GitLabRuntimeContext,
    config: GitLabSpaceConfiguration
) {
    const { projectId } = parseProjectOrThow(config);

    const id = await addProjectWebhook(config, projectId, createGitLabWebhookURL(context));

    assertIsDefined(context.environment.installation);
    assertIsDefined(context.environment.spaceInstallation);

    await context.api.integrations.updateIntegrationSpaceInstallation(
        context.environment.integration.name,
        context.environment.installation.id,
        context.environment.spaceInstallation.space,
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
 * Remove the GitLab webhook for the currently configured project.
 */
export async function uninstallWebhook(
    context: GitLabRuntimeContext,
    config: GitLabSpaceConfiguration
) {
    if (!config.webhookId) {
        return;
    }

    const { projectId } = parseProjectOrThow(config);

    assertIsDefined(context.environment.installation);
    assertIsDefined(context.environment.spaceInstallation);

    await deleteProjectWebhook(config, projectId, config.webhookId);

    // Remove the webhook ID from the configuration
    // There are chances the config won't exist when the webhook is deleted, so we ignore errors
    await context.api.integrations
        .updateIntegrationSpaceInstallation(
            context.environment.integration.name,
            context.environment.installation.id,
            context.environment.spaceInstallation!.space,
            {
                configuration: {
                    ...config,
                    webhookId: undefined,
                },
            }
        )
        .catch(() => {});

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
        targetUrl: update.url,
        description: update.description,
    });

    logger.info(`Commit status updated for ${commitSha} on GitLab project ${projectId}`);
}

/**
 * Returns the URL of the Git repository.
 */
export function getRepositoryUrl(config: GitLabSpaceConfiguration, withExtension = false): string {
    const { projectName } = parseProjectOrThow(config);
    return `${config.customInstanceUrl || 'https://gitlab.com'}/${projectName}${
        withExtension ? '.git' : ''
    }`;
}

/**
 * Returns the authentication information for the Git repository.
 */
export async function getRepositoryAuth(config: GitLabSpaceConfiguration) {
    return {
        username: 'oauth2',
        password: getAccessTokenOrThrow(config),
    };
}

/**
 * Returns the base URL of the Git tree in the provider.
 */
export function getGitTreeURL(config: GitLabSpaceConfiguration): string {
    const base = getRepositoryUrl(config);
    return `${base}/-/blob/${config.branch}`;
}

/**
 * Returns the absolute URL for a commit.
 */
export function getGitCommitURL(config: GitLabSpaceConfiguration): string {
    const base = getRepositoryUrl(config);
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
