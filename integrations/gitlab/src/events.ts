import { IntegrationInstallationStatus, SpaceInstallationSetupEvent } from '@gitbook/api';

import { GitLabRuntimeContext, GitLabSpaceInstallationConfiguration } from './configuration';
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
