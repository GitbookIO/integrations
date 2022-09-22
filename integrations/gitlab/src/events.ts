import { IntegrationInstallationStatus, SpaceInstallationSetupEvent } from '@gitbook/api';

import { GitLabRuntimeContext, GitLabSpaceInstallationConfiguration } from './configuration';
import { installGitLabWebhook, uninstallGitLabWebhook } from './webhooks';

/**
 * Check if we should update the webhook.
 */
export function shouldUpdateGitLabWebHook(
    previousConf: GitLabSpaceInstallationConfiguration,
    newConf: GitLabSpaceInstallationConfiguration
) {
    return (
        newConf.project !== previousConf.project ||
        newConf.auth_token !== previousConf.auth_token ||
        newConf.ref !== previousConf.ref ||
        newConf.gitlab_host !== previousConf.gitlab_host
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
        if (previousConfig && !shouldUpdateGitLabWebHook(previousConfig, configuration)) {
            return;
        }

        const prevHookId = previous.configuration?.hook_id;
        if (previousConfig && prevHookId) {
            console.info(
                `A webhook is already installed in GitLab project ${configuration.project} for Space installation ${spaceId}/${installationId}. Uninstalling.`
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

        console.info(
            `Webhook ID: ${newHookId} installed in GitLab project ${configuration.project} for Space installation ${spaceId}/${installationId}`
        );
    }
}
