import httpError from 'http-errors';

import { IntegrationSpaceInstallation } from '@gitbook/api';

import { getGitRef } from './provider';
import { triggerExport, triggerImport } from './sync';
import { GitLabRuntimeContext, GitLabSpaceConfiguration } from './types';
import { assertIsDefined, computeConfigQueryKeyBase, parseProject } from './utils';

/**
 * Save the space configuration for the current space installation.
 */
export async function saveSpaceConfiguration(
    context: GitLabRuntimeContext,
    config: GitLabSpaceConfiguration
) {
    const { api, environment } = context;
    const installation = environment.installation;
    const spaceInstallation = environment.spaceInstallation;

    assertIsDefined(installation);
    assertIsDefined(spaceInstallation);

    if (!config.project || !config.branch) {
        throw httpError(400, 'Incomplete configuration');
    }

    const { projectId } = parseProject(config);

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

    // Save the space installation configuration
    await api.integrations.updateIntegrationSpaceInstallation(
        environment.integration.name,
        installation.id,
        spaceInstallation.space,
        {
            externalIds,
            configuration: configurationBody,
        }
    );

    // Force a synchronization
    if (config.priority === 'gitlab') {
        // Import from GitHub
        await triggerImport(context, configurationBody, {
            force: true,
            updateGitInfo: true,
        });
    } else {
        // Export to GitHub
        await triggerExport(context, configurationBody, {
            force: true,
            updateGitInfo: true,
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
