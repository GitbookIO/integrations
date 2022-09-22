import { IntegrationInstallationStatus, SpaceInstallationSetupEvent } from '@gitbook/api';
import { api } from '@gitbook/runtime';

import { GitLabConfiguration } from './types';
import { installGitLabWebhook, uninstallGitLabWebhook } from './webhooks';

/**
 * Check if we should update the webhook.
 */
export function shouldUpdateGitLabWebHook(
    previousConf: GitLabConfiguration,
    newConf: GitLabConfiguration
) {
    return (
        newConf.projectId !== previousConf.projectId ||
        newConf.authToken !== previousConf.authToken ||
        newConf.ref !== previousConf.ref ||
        newConf.gitlabHost !== previousConf.gitlabHost
    );
}

/**
 * Handle a space_installation_setup GitBook event.
 * Install the GitLab webhook event handler and start an import/export depending on the priority.
 */
export async function handleSpaceInstallationSetupEvent(event: SpaceInstallationSetupEvent) {
    const { status, installationId, spaceId, previous } = event;

    if (status === IntegrationInstallationStatus.Pending) {
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
        const newConfig = {
            projectId: configuration.project,
            authToken: configuration.auth_token,
            ref: configuration.ref,
            gitlabHost: configuration.gitlab_host,
        };
        const previousConfig = previous.configuration
            ? {
                  projectId: previous.configuration.project,
                  authToken: previous.configuration.auth_token,
                  ref: previous.configuration.ref,
                  gitlabHost: previous.configuration.gitlab_host,
              }
            : null;

        if (previousConfig && !shouldUpdateGitLabWebHook(previousConfig, newConfig)) {
            return;
        }

        const prevHookId = previous.configuration?.hookId;
        if (previousConfig && prevHookId) {
            console.info(
                `A webhook is already installed in GitLab project ${configuration.project} for Space installation ${spaceId}/${installationId}. Uninstalling.`
            );
            await uninstallGitLabWebhook(prevHookId, previousConfig);
        }

        const newHookId = await installGitLabWebhook(`${urls.publicEndpoint}/webhook`, newConfig);
        await api.integrations.updateIntegrationSpaceInstallation(
            environment.integration.name,
            installationId,
            spaceId,
            {
                configuration: {
                    ...configuration,
                    hookId: newHookId,
                },
            }
        );

        console.info(
            `Webhook ID: ${newHookId} installed in GitLab project ${configuration.project} for Space installation ${spaceId}/${installationId}`
        );
    }
}
