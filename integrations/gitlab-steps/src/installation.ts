import { StatusError } from 'itty-router';

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
        throw new StatusError(400, 'Incomplete configuration: missing project or branch');
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
            environment.signingSecrets.integration
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
 * List space installations that match the given external ID.
 */
export async function querySpaceInstallations(
    context: GitLabRuntimeContext,
    externalId: string,
    options: {
        page?: string;
        limit?: number;
    } = {}
): Promise<{ data: Array<IntegrationSpaceInstallation>; nextPage?: string; total?: number }> {
    const { api, environment } = context;
    const { page, limit = 100 } = options;

    logger.debug(
        `Querying space installations for external ID ${externalId} (${JSON.stringify(options)})`
    );

    const { data } = await api.integrations.listIntegrationSpaceInstallations(
        environment.integration.name,
        {
            limit,
            externalId,
            page,
        }
    );

    return {
        data: data.items,
        total: data.count,
        nextPage: data.next?.page,
    };
}
