import { Logger } from '@gitbook/runtime';
import type {
    LaunchDarklyRuntimeContext,
    IntegrationTask,
    IntegrationTaskSyncSiteAdaptiveSchema,
} from './types';
import {
    GitBookAPI,
    GitBookAPIError,
    SiteAdaptiveJSONSchemaClaimsProperties,
    type SiteAdaptiveJSONSchema,
} from '@gitbook/api';

const logger = Logger('launchdarkly:tasks');

export const SYNC_ADAPTIVE_SCHEMA_SCHEDULE_SECONDS = 3600; // 1 hour

export async function handleIntegrationTask(
    context: LaunchDarklyRuntimeContext,
    task: IntegrationTask,
): Promise<void> {
    switch (task.type) {
        case 'sync-adaptive-schema':
            await Promise.all([
                handleSyncAdaptiveSchema(context, task.payload),
                context.api.integrations.queueIntegrationTask(
                    context.environment.integration.name,
                    {
                        task,
                        schedule: SYNC_ADAPTIVE_SCHEMA_SCHEDULE_SECONDS,
                    },
                ),
            ]);
            break;
        default:
            throw new Error(`Unknown integration task type: ${task}`);
    }
}

async function handleSyncAdaptiveSchema(
    context: LaunchDarklyRuntimeContext,
    payload: IntegrationTaskSyncSiteAdaptiveSchema['payload'],
): Promise<void> {
    const { organizationId, siteId, installationId } = payload;
    const integrationName = context.environment.integration.name;

    logger.debug(
        `handling sync adaptive schema for site ${siteId} in installation ${installationId} of ${integrationName}`,
    );

    try {
        const [{ data: siteInstallation }, { data: installationAPIToken }] = await Promise.all([
            context.api.integrations.getIntegrationSiteInstallation(
                integrationName,
                installationId,
                siteId,
            ),
            context.api.integrations.createIntegrationInstallationToken(
                integrationName,
                installationId,
            ),
        ]);

        const api = new GitBookAPI({
            userAgent: context.api.userAgent,
            endpoint: context.environment.apiEndpoint,
            authToken: installationAPIToken.token,
        });

        const projectKey =
            'project_key' in siteInstallation.configuration
                ? siteInstallation.configuration.project_key
                : null;
        if (typeof projectKey !== 'string' || !projectKey) {
            throw new Error(`No project key configured in the site installation ${siteId}`);
        }

        const serviceToken =
            'service_token' in siteInstallation.configuration
                ? siteInstallation.configuration.service_token
                : null;
        if (typeof serviceToken !== 'string' || !serviceToken) {
            throw new Error(`No service token configured in the site installation ${siteId}`);
        }

        const { data: site } = await api.orgs.getSiteById(organizationId, siteId);
        if (!site.adaptiveContent?.enabled) {
            logger.info(
                `Adaptive content is not enabled for site ${siteId}, skipping adaptive schema sync.`,
            );
            return;
        }

        const [existing, featureFlags] = await Promise.all([
            getExistingAdaptiveSchema(api, organizationId, siteId),
            getFeatureFlags({
                projectKey,
                serviceToken,
            }),
        ]);

        await api.orgs.updateSiteAdaptiveSchema(organizationId, siteId, {
            jsonSchema: {
                ...existing,
                properties: {
                    ...existing.properties,
                    unsigned: {
                        ...(existing.properties.unsigned?.type === 'object'
                            ? existing.properties.unsigned
                            : {
                                  type: 'object',
                                  description: 'Unsigned claims of the site visitor.',
                                  properties: {},
                                  additionalProperties: false,
                              }),
                        properties: {
                            ...(existing.properties.unsigned?.type === 'object'
                                ? existing.properties.unsigned.properties
                                : {}),
                            [context.environment.integration.name]: {
                                type: 'object',
                                description: `Feature flags from the ${integrationName} integration`,
                                properties: parseFeatureFlagsForSchema(featureFlags),
                                additionalProperties: false,
                            },
                        },
                        additionalProperties: false,
                    },
                },
            },
        });
        logger.info(`Updated adaptive schema for site ${siteId} in installation ${installationId}`);
        // Update the site installation to mark the last sync time
        await context.api.integrations.updateIntegrationSiteInstallation(
            integrationName,
            installationId,
            siteId,
            {
                configuration: {
                    ...siteInstallation.configuration,
                    lastSync: Date.now(),
                },
            },
        );
    } catch (error) {
        logger.error(`Error while handling adaptive schema sync: ${error}`);
        throw error;
    }
}

function parseFeatureFlagsForSchema(featureFlags: Awaited<ReturnType<typeof getFeatureFlags>>) {
    return featureFlags.reduce(
        (acc, feature) => {
            if (feature.kind === 'boolean') {
                acc[feature.key] = {
                    type: 'boolean',
                    description: `Whether the visitor has ${feature.key} enabled`,
                };
            } else if (feature.kind === 'multivariate') {
                const type = typeof feature.variations[0].value;
                if (type === 'string') {
                    acc[feature.key] = {
                        type: 'string',
                        description: `Whether the visitor has ${feature.key} enabled`,
                        enum: feature.variations.map((v) => v.value as string),
                    };
                } else {
                    // for now, if the type is not string or boolean, we ignore it
                }
            }

            return acc;
        },
        {} as Record<string, SiteAdaptiveJSONSchemaClaimsProperties>,
    );
}

async function getExistingAdaptiveSchema(
    api: GitBookAPI,
    organizationId: string,
    siteId: string,
): Promise<SiteAdaptiveJSONSchema> {
    try {
        const { data } = await api.orgs.getSiteAdaptiveSchema(organizationId, siteId);
        return data.jsonSchema;
    } catch (error: unknown) {
        if (error instanceof GitBookAPIError && error.code === 404) {
            return {
                type: 'object',
                properties: {},
                additionalProperties: false,
            };
        }

        logger.error(`Error while fetching existing adaptive schema for site ${siteId}: ${error}`);
        throw error;
    }
}

async function getFeatureFlags(args: { projectKey: string; serviceToken: string }) {
    const { projectKey, serviceToken } = args;
    const res = await fetch(`https://app.launchdarkly.com/api/v2/flags/${projectKey}`, {
        headers: {
            Authorization: serviceToken,
        },
    });

    if (!res.ok) {
        throw new Error(`(${res.status}) Failed to fetch feature flags: ${res.statusText}`);
    }

    const data = await res.json<{
        items: Array<{
            name: string;
            key: string;
            kind: 'boolean' | 'multivariate';
            _version: number;
            creationDate: number;
            variations: Array<{
                value: unknown;
                description?: string;
                name?: string;
                _id?: string;
            }>;
        }>;
    }>();

    return data.items || [];
}
