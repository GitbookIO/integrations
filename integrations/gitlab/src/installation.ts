import httpError from 'http-errors';

import { IntegrationSpaceInstallation } from '@gitbook/api';
import { Logger } from '@gitbook/runtime';

import { fetchProject } from './api';
import { createGitLabWebhookURL, installWebhook } from './provider';
import { triggerExport, triggerImport } from './sync';
import { GitlabConfigureState, GitLabRuntimeContext, GitLabSpaceConfiguration } from './types';
import { assertIsDefined, BRANCH_REF_PREFIX, computeConfigQueryKey, signResponse } from './utils';

const logger = Logger('gitlab:installation');

/**
 * Save the space configuration for the current space installation.
 */
export async function saveSpaceConfiguration(
    context: GitLabRuntimeContext,
    state: GitlabConfigureState
) {
    const { api, environment } = context;
    const spaceInstallation = environment.spaceInstallation;

    assertIsDefined(spaceInstallation, { label: 'spaceInstallation' });

    if (!state.project || !state.branch) {
        throw httpError(400, 'Incomplete configuration');
    }

    const projectId = parseInt(state.project, 10);

    // Make sure the branch is prefixed with refs/heads/
    state.branch = state.branch.startsWith(BRANCH_REF_PREFIX)
        ? state.branch
        : BRANCH_REF_PREFIX + state.branch;

    /**
     * We need to update the space installation external IDs to make sure
     * we can query it later when there is a webhook event.
     */
    const externalIds: string[] = [];
    externalIds.push(computeConfigQueryKey(projectId, state.branch));

    const glProject = await fetchProject(spaceInstallation.configuration, projectId);

    const configurationBody: GitLabSpaceConfiguration = {
        ...spaceInstallation.configuration,
        key: state.key || crypto.randomUUID(),
        configuredAt: new Date().toISOString(),
        project: projectId,
        projectName: glProject.path_with_namespace,
        branch: state.branch,
        projectDirectory: state.projectDirectory,
        commitMessageTemplate: state.commitMessageTemplate,
        priority: state.priority,
        customInstanceUrl: state.customInstanceUrl,
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
    if (configurationBody.priority === 'gitlab') {
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
        const webhookToken = await signResponse(
            environment.integration.name,
            environment.signingSecret!
        );
        await installWebhook(
            updatedSpaceInstallation,
            createGitLabWebhookURL(context),
            webhookToken
        ).then(async (id) => {
            return api.integrations.updateIntegrationSpaceInstallation(
                spaceInstallation.integration,
                spaceInstallation.installation,
                spaceInstallation.space,
                {
                    configuration: {
                        ...configurationBody,
                        webhookId: id,
                    },
                }
            );
        });
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
