import { GitSyncOperationState, IntegrationSpaceInstallation } from '@gitbook/api';
import { Logger } from '@gitbook/runtime';

import {
    getAccessTokenOrThrow,
    addProjectWebhook,
    deleteProjectWebhook,
    editCommitStatus,
} from './api';
import { GitLabRuntimeContext, GitLabSpaceConfiguration } from './types';
import { assertIsDefined, getSpaceConfigOrThrow } from './utils';

const logger = Logger('gitlab:provider');

/**
 * Setup the GitLab webhook for the currently configured space installation
 * project
 */
export async function installWebhook(
    spaceInstallation: IntegrationSpaceInstallation,
    webhookUrl: string,
    webhookToken: string
) {
    const config = getSpaceConfigOrThrow(spaceInstallation);

    assertIsDefined(config.project, { label: 'config.project' });

    const projectId = config.project;
    const id = await addProjectWebhook(config, config.project, webhookUrl, webhookToken);

    logger.info(`Webhook ${id} installed on GitLab project ${projectId}`);
}

/**
 * Remove the GitLab webhook for the currently configured space installation
 * project.
 */
export async function uninstallWebhook(spaceInstallation: IntegrationSpaceInstallation) {
    const config = getSpaceConfigOrThrow(spaceInstallation);

    if (!config.webhookId) {
        return;
    }

    assertIsDefined(config.project, { label: 'config.project' });

    const projectId = config.project;

    await deleteProjectWebhook(config, projectId, config.webhookId);

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
    assertIsDefined(config.project, { label: 'config.project' });

    const projectId = config.project;

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
export function getRepositoryUrl(config: GitLabSpaceConfiguration, withExtension = false): string {
    return `${config.customInstanceUrl || 'https://gitlab.com'}/${config.projectName}${
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
