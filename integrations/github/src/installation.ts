import { StatusError } from 'itty-router';

import { IntegrationSpaceInstallation } from '@gitbook/api';
import { Logger } from '@gitbook/runtime';

import { fetchRepository } from './api';
import { triggerExport, triggerImport } from './sync';
import { GithubConfigureState, GithubRuntimeContext, GitHubSpaceConfiguration } from './types';
import {
    assertIsDefined,
    BRANCH_REF_PREFIX,
    computeConfigQueryKey,
    normalizeProjectDirectory,
} from './utils';

const logger = Logger('github:installation');

/**
 * Save the space configuration for the current space installation.
 */
export async function saveSpaceConfiguration(
    context: GithubRuntimeContext,
    state: GithubConfigureState,
) {
    const { api, environment } = context;
    const spaceInstallation = environment.spaceInstallation;

    assertIsDefined(spaceInstallation, { label: 'spaceInstallation' });

    if (!state.installation || !state.repository || !state.branch) {
        throw new StatusError(
            400,
            'Incomplete configuration: missing installation, repository or branch',
        );
    }

    // Make sure the branch is prefixed with refs/heads/
    state.branch = state.branch.startsWith(BRANCH_REF_PREFIX)
        ? state.branch
        : BRANCH_REF_PREFIX + state.branch;

    const installationId = parseInt(state.installation, 10);
    const repoID = parseInt(state.repository, 10);

    /**
     * We need to update the space installation external IDs to make sure
     * we can query it later when there is a webhook event.
     */
    const externalIds: string[] = [];
    externalIds.push(computeConfigQueryKey(installationId, repoID, state.branch));
    if (state.previewExternalBranches) {
        externalIds.push(computeConfigQueryKey(installationId, repoID, state.branch, true));
    }

    const configurationBody: GitHubSpaceConfiguration = {
        ...spaceInstallation.configuration,
        key: crypto.randomUUID(),
        configuredAt: new Date().toISOString(),
        installation: installationId,
        repository: repoID,
        branch: state.branch,
        commitMessageTemplate: state.commitMessageTemplate,
        previewExternalBranches: state.previewExternalBranches,
        projectDirectory: normalizeProjectDirectory(state.projectDirectory),
        priority: state.priority,
    };

    logger.debug(
        `Saving config for space ${spaceInstallation.space} of integration-installation ${spaceInstallation.installation}`,
    );

    const githubRepo = await fetchRepository(context, repoID);

    // Save the space installation configuration
    const { data: updatedSpaceInstallation } =
        await api.integrations.updateIntegrationSpaceInstallation(
            spaceInstallation.integration,
            spaceInstallation.installation,
            spaceInstallation.space,
            {
                externalIds,
                configuration: {
                    ...configurationBody,
                    accountName: githubRepo.owner.login,
                    repoName: githubRepo.name,
                },
            },
        );

    logger.info(`Saved config for space ${spaceInstallation.space}`);

    // Force a synchronization
    if (state.priority === 'github') {
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
}

/**
 * List space installations that match the given external ID.
 */
export async function querySpaceInstallations(
    context: GithubRuntimeContext,
    externalId: string,
    options: {
        page?: string;
        limit?: number;
    } = {},
): Promise<{ data: Array<IntegrationSpaceInstallation>; nextPage?: string; total?: number }> {
    const { api, environment } = context;
    const { page, limit = 100 } = options;

    logger.debug(
        `Querying space installations for external ID ${externalId} (${JSON.stringify(options)})`,
    );

    const { data } = await api.integrations.listIntegrationSpaceInstallations(
        environment.integration.name,
        {
            limit,
            externalId,
            page,
        },
    );

    return {
        data: data.items,
        total: data.count,
        nextPage: data.next?.page,
    };
}
