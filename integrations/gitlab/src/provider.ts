import { Gitlab } from '@gitbeaker/rest';

import { GitSyncOperationState } from '@gitbook/api';
import { Logger } from '@gitbook/runtime';

import { getAccessToken } from './api';
import { GitLabRuntimeContext, GitLabSpaceConfiguration } from './types';
import { assertIsDefined, createGitLabWebhookURL, parseProject } from './utils';

const logger = Logger('gitlab:provider');

/**
 * Returns the GitLab client for the currently configured project.
 */
function getGitLabClient(config: GitLabSpaceConfiguration) {
    return new Gitlab({
        token: getAccessToken(config),
        host: config.customInstanceUrl || 'https://gitlab.com',
    });
}

/**
 * Setup the GitLab webhook for the currently configured project.
 */
export async function installWebhook(
    context: GitLabRuntimeContext,
    config: GitLabSpaceConfiguration
) {
    const gitlab = getGitLabClient(config);
    const { projectId } = parseProject(config);

    const { id } = await gitlab.ProjectHooks.add(projectId, createGitLabWebhookURL(context), {
        pushEvents: true,
        mergeRequestsEvents: true,
    });

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

    const gitlab = getGitLabClient(config);
    const { projectId } = parseProject(config);

    assertIsDefined(context.environment.installation);
    assertIsDefined(context.environment.spaceInstallation);

    await Promise.all([
        gitlab.ProjectHooks.remove(projectId, config.webhookId),
        context.api.integrations.updateIntegrationSpaceInstallation(
            context.environment.integration.name,
            context.environment.installation.id,
            context.environment.spaceInstallation!.space,
            {
                configuration: {
                    ...config,
                    webhookId: undefined,
                },
            }
        ),
    ]);

    logger.info(`Webhook ${config.webhookId} uninstalled from GitLab project ${projectId}`);
}

/**
 * Returns the URL of the Git repository.
 */
export function getRepositoryUrl(config: GitLabSpaceConfiguration, withExtension = false): string {
    const { projectName } = parseProject(config);
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
        password: getAccessToken(config),
    };
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
    const gitlab = getGitLabClient(config);
    const { projectId } = parseProject(config);

    await gitlab.Commits.editStatus(
        projectId,
        commitSha,
        update.state === 'failure' ? 'failed' : update.state,
        {
            name: update.context || 'GitBook',
            targetUrl: update.url,
            description: update.description,
        }
    );
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
