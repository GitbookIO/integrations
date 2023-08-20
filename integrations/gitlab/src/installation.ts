import httpError from 'http-errors';

import { IntegrationSpaceInstallation } from '@gitbook/api';
import { Logger } from '@gitbook/runtime';

import { getGitRef, installWebhook } from './provider';
import { triggerExport, triggerImport } from './sync';
import { GitLabRuntimeContext, GitLabSpaceConfiguration } from './types';
import { assertIsDefined, computeConfigQueryKeyBase, parseProjectOrThow } from './utils';

const logger = Logger('gitlab:installation');

/**
 * Save the space configuration for the current space installation.
 */
export async function saveSpaceConfiguration(
    context: GitLabRuntimeContext,
    config: GitLabSpaceConfiguration
) {
    const { api, environment } = context;
    const spaceInstallation = environment.spaceInstallation;

    assertIsDefined(spaceInstallation, { label: 'spaceInstallation' });

    if (!config.project || !config.branch) {
        throw httpError(400, 'Incomplete configuration');
    }

    const { projectId } = parseProjectOrThow(config);

    /**
     * We need to update the space installation external IDs to make sure
     * we can query it later when there is a webhook event.
     */
    const externalIds: string[] = [];
    externalIds.push(computeConfigQueryKeyBase(projectId, getGitRef(config.branch)));

    const configurationBody: GitLabSpaceConfiguration = {
        ...spaceInstallation.configuration,
        key: config.key || crypto.randomUUID(),
        project: config.project,
        branch: config.branch,
        projectDirectory: config.projectDirectory,
        commitMessageTemplate: config.commitMessageTemplate,
        priority: config.priority,
        customInstanceUrl: config.customInstanceUrl,
    };

    logger.debug(
        `Saving config for space ${spaceInstallation.space} of integration-installation ${spaceInstallation.installation}`
    );

    // Save the space installation configuration
    const { data: updatedSpaceInstallation } =
        await api.integrations.updateIntegrationSpaceInstallation(
            spaceInstallation.integration,
            spaceInstallation.installation,
            spaceInstallation.space,
            {
                externalIds,
                configuration: configurationBody,
            }
        );

    logger.info(`Saved config for space ${spaceInstallation.space}`);

    // Force a synchronization
    if (config.priority === 'gitlab') {
        logger.debug(`Forcing import for space ${spaceInstallation.space}`);
        await triggerImport(context, updatedSpaceInstallation, {
            force: true,
            updateGitInfo: true,
        });
    } else {
        logger.debug(`Forcing export for space ${spaceInstallation.space}`);
        await triggerExport(context, updatedSpaceInstallation, {
            force: true,
            updateGitInfo: true,
        });
    }

    // Install the webhook if needed
    if (!configurationBody.webhookId) {
        await installWebhook(spaceInstallation, context, configurationBody);
    }
}

/**
 * List space installations that match the given external ID. It takes
 * care of pagination and returns all space installations at once.
 */
export async function querySpaceInstallations(
    context: GitLabRuntimeContext,
    externalId: string,
    page?: string
): Promise<Array<IntegrationSpaceInstallation>> {
    const { api, environment } = context;

    logger.debug(`Querying space installations for external ID ${externalId} (page: ${page ?? 1})`);

    const { data } = await api.integrations.listIntegrationSpaceInstallations(
        environment.integration.name,
        {
            limit: 100,
            externalId,
            page,
        }
    );

    const spaceInstallations = [...data.items];

    // Recursively fetch next pages
    if (data.next) {
        const nextSpaceInstallations = await querySpaceInstallations(
            context,
            externalId,
            data.next.page
        );
        spaceInstallations.push(...nextSpaceInstallations);
    }

    return spaceInstallations;
}
