import { IntegrationInstallationStatus, SpaceInstallationSetupEvent } from '@gitbook/api';

import { installGitLabWebhook } from './webhooks';

/**
 * Handle a space_installation_setup GitBook event.
 * Install the GitLab webhook event handler and start an import/export depending on the priority.
 */
export async function handleSpaceInstallationSetupEvent(event: SpaceInstallationSetupEvent) {
    const { status, installationId, spaceId } = event;

    if (status === IntegrationInstallationStatus.Pending) {
        console.info(
            `GitLab integration Space installation ${spaceId}/${installationId} is not complete. Skipping.`
        );
    }

    const { configuration, urls } = environment.spaceInstallation;
    if (status === IntegrationInstallationStatus.Active) {
        if (!configuration?.project || !configuration?.auth_token) {
            throw new Error(
                `No GitLab project or auth token provided for Space installation ${spaceId}/${installationId}`
            );
        }

        const gitlabConfig = {
            projectId: configuration.project,
            authToken: configuration.auth_token,
            gitlabHost: configuration.gitlab_host,
        };
        // TODO: implement a better a way to check what changed in the Space installation.
        /* if (configuration?.hookId) {
            console.info(
                `A webhook is already installed in GitLab project ${configuration.project} for Space installation ${spaceId}/${installationId}. Uninstalling.`
            );
            await uninstallGitLabWebhook(configuration.hookId);
        } */

        const newHookId = await installGitLabWebhook(
            `${urls.publicEndpoint}/webhook`,
            gitlabConfig
        );

        /* await api.integrations.updateIntegrationSpaceInstallation(
            environment.integration.name,
            installationId,
            spaceId,
            {
                configuration: {
                    ...configuration,
                    hookId: newHookId,
                },
            }
        ); */

        console.info(
            `Webhook ID: ${newHookId} installed in GitLab project ${configuration.project} for Space installation ${spaceId}/${installationId}`
        );
    }
}
