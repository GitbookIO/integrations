import { Logger } from '@gitbook/runtime';
import type {
    BucketRuntimeContext,
    IntegrationTask,
    IntegrationTaskSyncSiteAdaptiveSchema,
} from './types';
import {
    GitBookAPI,
    GitBookAPIError,
    IntegrationEnvironmentSiteInstallation,
    IntegrationInstallation,
    IntegrationSiteInstallation,
    type SiteAdaptiveJSONSchema,
} from '@gitbook/api';

const logger = Logger('bucket:tasks');

export const SYNC_ADAPTIVE_SCHEMA_SCHEDULE_SECONDS = 3600; // 1 hour

export async function handleSyncAdaptiveSchema(
    context: BucketRuntimeContext,
    installation: IntegrationInstallation,
    siteInstallation: IntegrationEnvironmentSiteInstallation,
): Promise<void> {
    const {
        target: { organization: organizationId },
    } = installation;
    const {
        integration: integrationId,
        installation: installationId,
        site: siteId,
    } = siteInstallation;

    logger.debug(
        `handling sync adaptive schema for site ${siteId} in installation ${installationId} of ${integrationId}`,
    );

    try {
        const installationAPIToken = context.environment.apiTokens.installation;
        if (!installationAPIToken) {
            throw new Error(`Expected installation API token`);
        }

        const api = new GitBookAPI({
            userAgent: context.api.userAgent,
            endpoint: context.environment.apiEndpoint,
            authToken: installationAPIToken,
        });

        const secretKey =
            'secret_key' in siteInstallation.configuration
                ? siteInstallation.configuration.secret_key
                : null;
        if (typeof secretKey !== 'string' || !secretKey) {
            throw new Error(`No secret key configured in the site installation ${siteId}`);
        }

        const { data: site } = await api.orgs.getSiteById(organizationId, siteId);
        if (!site.adaptiveContent?.enabled) {
            logger.info(`Adaptive content is not enabled for site ${siteId}, skipping!`);
            // Update the site installation to mark the last sync attempt time
            await context.api.integrations.updateIntegrationSiteInstallation(
                integrationId,
                installationId,
                siteId,
                {
                    configuration: {
                        ...siteInstallation.configuration,
                        lastSyncAttemptAt: Date.now(),
                    },
                },
            );
            return;
        }

        const [existing, featureFlags] = await Promise.all([
            getExistingAdaptiveSchema(api, organizationId, siteId),
            getFeatureFlags(secretKey),
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
                                description: `Feature flags from the ${integrationId} integration`,
                                properties: {
                                    ...featureFlags.reduce(
                                        (acc, feature) => {
                                            acc[feature.key] = {
                                                type: 'boolean',
                                                description: `Whether the visitor has ${feature.key} enabled`,
                                            };
                                            return acc;
                                        },
                                        {} as Record<
                                            string,
                                            {
                                                type: 'boolean';
                                                description: string;
                                            }
                                        >,
                                    ),
                                },
                                additionalProperties: false,
                            },
                        },
                        additionalProperties: false,
                    },
                },
            },
        });

        logger.info(`Updated adaptive schema for site ${siteId} in installation ${installationId}`);

        // Update the site installation to mark the last sync attempt time
        await context.api.integrations.updateIntegrationSiteInstallation(
            integrationId,
            installationId,
            siteId,
            {
                configuration: {
                    ...siteInstallation.configuration,
                    lastSyncAttemptAt: Date.now(),
                },
            },
        );
    } catch (error) {
        logger.error(`Error while handling adaptive schema sync: ${error}`);
        throw error;
    }
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

async function getFeatureFlags(secretKey: string) {
    const res = await fetch('https://front.bucket.co/features', {
        headers: {
            Authorization: `Bearer ${secretKey}`,
        },
    });

    if (!res.ok) {
        throw new Error(`(${res.status}) Failed to fetch feature flags: ${res.statusText}`);
    }

    const data = await res.json<{
        success: boolean;
        features?: Array<{
            key: string;
            description: string | null;
            createdAt: string;
            link: string | null;
            targeting: object;
            config?: object;
        }>;
    }>();

    return data.features || [];
}
