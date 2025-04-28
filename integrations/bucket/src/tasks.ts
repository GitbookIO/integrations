import { Logger } from '@gitbook/runtime';
import type {
    IntegrationContext,
    IntegrationTask,
    IntegrationTaskSyncSiteAdaptiveSchema,
} from './types';
import { GitBookAPI } from '@gitbook/api';

const logger = Logger('bucket:tasks');

export async function handleIntegrationTask(
    context: IntegrationContext,
    task: IntegrationTask,
): Promise<void> {
    switch (task.type) {
        case 'sync-adaptive-schema':
            await handleSyncAdaptiveSchema(context, task.payload);
            break;
        default:
            throw new Error(`Unknown integration task type: ${task}`);
    }
}

async function handleSyncAdaptiveSchema(
    context: IntegrationContext,
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

        const secretKey =
            'secretKey' in siteInstallation.configuration
                ? siteInstallation.configuration.secretKey
                : null;
        if (typeof secretKey !== 'string' || !secretKey) {
            throw new Error(`No secret key configured in the site installation ${siteId}`);
        }

        const [{ data: existing }, featureFlags] = await Promise.all([
            api.orgs.getSiteAdaptiveSchema(organizationId, siteId),
            getFeatureFlags(secretKey),
        ]);

        await api.orgs.createOrUpdateSiteAdaptiveSchema(organizationId, siteId, {
            jsonSchema: {
                ...existing.jsonSchema,
                properties: {
                    ...existing.jsonSchema.properties,
                    public: {
                        type: 'object',
                        description:
                            existing.jsonSchema.properties.public.description ||
                            'Public claims for the visitor of the site',
                        properties: {
                            ...(existing.jsonSchema.properties.public.type === 'object'
                                ? existing.jsonSchema.properties.public.properties
                                : {}),
                            [context.environment.integration.name]: {
                                type: 'object',
                                description: `Feature flags from the ${integrationName} integration`,
                                properties: {
                                    ...featureFlags.reduce(
                                        (acc, feature) => {
                                            acc[feature.key] = {
                                                type: 'boolean',
                                                description:
                                                    feature.description ||
                                                    `Whether the visitor has ${feature.key} enabled`,
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
    } catch (error) {
        logger.error(`Error while handling adaptive schema sync: ${error}`);
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
