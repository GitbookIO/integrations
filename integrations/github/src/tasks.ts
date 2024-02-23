import { GitBookAPI } from '@gitbook/api';
import { Logger } from '@gitbook/runtime';

import { querySpaceInstallations } from './installation';
import { triggerImport, triggerSync } from './sync';
import type { GithubRuntimeContext, IntegrationTask, IntegrationTaskImportSpaces } from './types';

const logger = Logger('github:tasks');

/**
 * Queue a task for the integration to import spaces.
 */
export async function queueTaskForImportSpaces(
    context: GithubRuntimeContext,
    task: IntegrationTaskImportSpaces
): Promise<void> {
    const { api, environment } = context;
    await api.integrations.queueIntegrationTask(environment.integration.name, {
        task: {
            type: task.type,
            payload: task.payload,
        },
    });
}

/**
 * Handle an integration task.
 */
export async function handleIntegrationTask(
    context: GithubRuntimeContext,
    task: IntegrationTask
): Promise<void> {
    switch (task.type) {
        case 'import:spaces':
            await handleImportDispatchForSpaces(context, task.payload);
            break;
        default:
            throw new Error(`Unknown integration task type: ${task}`);
    }
}

/**
 * This function is used to trigger an import for all the spaces that match the given config query.
 * It will handle pagination by queueing itself if there are more spaces to import.
 *
 * `NOTE`: It is important that the total number of external network calls in this function is less
 * than 50 as that is the limit imposed by Cloudflare workers.
 */
export async function handleImportDispatchForSpaces(
    context: GithubRuntimeContext,
    payload: IntegrationTaskImportSpaces['payload']
): Promise<number | undefined> {
    const { configQuery, page, standaloneRef, eventTimestamp } = payload;

    logger.debug(`handling import dispatch for spaces with payload: ${JSON.stringify(payload)}`);

    const {
        data: spaceInstallations,
        nextPage,
        total,
    } = await querySpaceInstallations(context, configQuery, {
        limit: 10,
        page,
    });

    await Promise.allSettled(
        spaceInstallations.map(async (spaceInstallation) => {
            try {
                // Obtain the installation API token needed to trigger the import
                const { data: installationAPIToken } =
                    await context.api.integrations.createIntegrationInstallationToken(
                        spaceInstallation.integration,
                        spaceInstallation.installation
                    );

                // Set the token in the duplicated context to be used by the API client
                const installationContext: GithubRuntimeContext = {
                    ...context,
                    api: new GitBookAPI({
                        userAgent: context.api.userAgent,
                        endpoint: context.environment.apiEndpoint,
                        authToken: installationAPIToken.token,
                    }),
                    environment: {
                        ...context.environment,
                        authToken: installationAPIToken.token,
                    },
                };

                await Promise.all([
                    triggerImport(installationContext, spaceInstallation, {
                        standalone: standaloneRef
                            ? {
                                  ref: standaloneRef,
                              }
                            : undefined,
                        eventTimestamp,
                    }),
                    triggerSync(installationContext, spaceInstallation, {
                        standalone: standaloneRef
                            ? {
                                  ref: standaloneRef,
                              }
                            : undefined,
                        eventTimestamp,
                    }),
                ]);
            } catch (error) {
                logger.error(
                    `error while triggering ${
                        standaloneRef ? `standalone (${standaloneRef})` : ''
                    } import for space ${spaceInstallation.space}`,
                    error
                );
            }
        })
    );

    // Queue the next page if there is one
    if (nextPage) {
        logger.debug(`queueing next page ${nextPage} of import dispatch for spaces`);
        await queueTaskForImportSpaces(context, {
            type: 'import:spaces',
            payload: {
                page: nextPage,
                configQuery,
                standaloneRef,
            },
        });
    }

    return total;
}
