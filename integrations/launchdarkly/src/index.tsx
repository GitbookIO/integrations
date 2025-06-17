import { GitBookAPI } from '@gitbook/api';
import { Router } from 'itty-router';
import {
    createIntegration,
    ExposableError,
    Logger,
    type FetchEventCallback,
} from '@gitbook/runtime';
import { arrayToHex, assertSiteInstallation, safeCompare } from './utils';
import type { LaunchDarklyRuntimeContext, IntegrationTask } from './types';
import { handleIntegrationTask, SYNC_ADAPTIVE_SCHEMA_SCHEDULE_SECONDS } from './tasks';
import { configBlock } from './components';

const logger = Logger('launchdarkly');

const handleFetchEvent: FetchEventCallback<LaunchDarklyRuntimeContext> = async (
    request,
    context,
) => {
    const { environment } = context;

    const router = Router({
        base: new URL(
            environment.spaceInstallation?.urls?.publicEndpoint ||
                environment.installation?.urls.publicEndpoint ||
                environment.integration.urls.publicEndpoint,
        ).pathname,
    });

    async function verifyIntegrationSignature(
        payload: string,
        signature: string,
        secret: string,
    ): Promise<boolean> {
        if (!signature) {
            return false;
        }

        const algorithm = { name: 'HMAC', hash: 'SHA-256' };
        const enc = new TextEncoder();
        const key = await crypto.subtle.importKey('raw', enc.encode(secret), algorithm, false, [
            'sign',
            'verify',
        ]);
        const signed = await crypto.subtle.sign(algorithm.name, key, enc.encode(payload));
        const expectedSignature = arrayToHex(signed);

        return safeCompare(expectedSignature, signature);
    }

    /**
     * Handle integration tasks
     */
    router.post('/tasks', async (request) => {
        const signature = request.headers.get('x-gitbook-integration-signature') ?? '';
        const payloadString = await request.text();

        const verified = await verifyIntegrationSignature(
            payloadString,
            signature,
            environment.signingSecrets.integration,
        );

        if (!verified) {
            const message = 'Invalid signature for integration task';
            logger.error(message);
            throw new ExposableError(message);
        }

        const { task } = JSON.parse(payloadString) as { task: IntegrationTask };
        logger.debug('verified & received integration task', task);

        context.waitUntil(
            (async () => {
                await handleIntegrationTask(context, task);
            })(),
        );

        return new Response(JSON.stringify({ acknowledged: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    });

    const response = (await router.handle(request, context)) as Response | undefined;

    if (!response) {
        return new Response(`No route matching ${request.method} ${request.url}`, {
            status: 404,
        });
    }

    return response;
};

export default createIntegration({
    fetch: handleFetchEvent,
    components: [configBlock],
    events: {
        site_view: async (event, context) => {
            const siteInstallation = assertSiteInstallation(context.environment);
            // If the last sync was more than an hour ago, we trigger a sync
            if (
                !siteInstallation.configuration.lastSync ||
                siteInstallation.configuration.lastSync <
                    Date.now() - SYNC_ADAPTIVE_SCHEMA_SCHEDULE_SECONDS * 1000
            ) {
                const api = new GitBookAPI({
                    authToken: context.environment.apiTokens.integration,
                    endpoint: context.environment.apiEndpoint,
                    userAgent: context.api.userAgent,
                });

                const organizationId = context.environment.installation?.target.organization;
                if (!organizationId) {
                    throw new Error(
                        `No organization ID found in the installation ${event.installationId}`,
                    );
                }

                await handleIntegrationTask(
                    {
                        ...context,
                        api,
                    },
                    {
                        type: 'sync-adaptive-schema',
                        payload: {
                            siteId: event.siteId,
                            installationId: event.installationId,
                            organizationId,
                        },
                    },
                );
            }
        },
        site_installation_setup: async (event, context) => {
            const api = new GitBookAPI({
                authToken: context.environment.apiTokens.integration,
                endpoint: context.environment.apiEndpoint,
                userAgent: context.api.userAgent,
            });

            const organizationId = context.environment.installation?.target.organization;
            if (!organizationId) {
                throw new Error(
                    `No organization ID found in the installation ${event.installationId}`,
                );
            }

            // Sync the adaptive schema for the site and queue a task
            // to sync it every hour
            await handleIntegrationTask(
                {
                    ...context,
                    api,
                },
                {
                    type: 'sync-adaptive-schema',
                    payload: {
                        siteId: event.siteId,
                        installationId: event.installationId,
                        organizationId,
                    },
                },
            );
        },
    },
});
