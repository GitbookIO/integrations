import { createIntegration, createOAuthHandler, Logger } from '@gitbook/runtime';
import { Router } from 'itty-router';
import { HubSpotRuntimeContext } from './types';
import { getHubSpotOAuthConfig } from './client';
import { ingestConversations } from './conversations';
import { configComponent } from './config';
import { handleWebhook, HubSpotWebhookPayload } from './webhook';

const logger = Logger('hubspot-conversations');

export default createIntegration<HubSpotRuntimeContext>({
    fetch: async (request, context) => {
        const router = Router({
            base: new URL(
                context.environment.spaceInstallation?.urls?.publicEndpoint ||
                    context.environment.installation?.urls.publicEndpoint ||
                    context.environment.integration.urls.publicEndpoint,
            ).pathname,
        });

        /*
         * Webhook to ingest conversations when they are closed.
         */
        router.post('/webhook', async (request) => {
            const rawPayload = await request.json?.();
            const payloads = Array.isArray(rawPayload) ? rawPayload : [rawPayload];

            logger.info('Received HubSpot webhook', { payloadCount: payloads.length });

            return handleWebhook(context, payloads as HubSpotWebhookPayload[], request as Request);
        });

        /*
         * OAuth flow.
         */
        router.get('/oauth', async (request) => {
            const oauthHandler = createOAuthHandler(getHubSpotOAuthConfig(context), {
                replace: false,
            });
            return oauthHandler(request as Request, context);
        });

        const response = await router.handle(request, context);
        if (!response) {
            return new Response(`No route matching ${request.method} ${request.url}`, {
                status: 404,
            });
        }

        return response;
    },
    components: [configComponent],
    events: {
        /**
         * When the integration is installed, we fetch all closed conversations and ingest them
         */
        installation_setup: async (_, context) => {
            const { installation } = context.environment;
            if (installation?.configuration.oauth_credentials) {
                await ingestConversations(context);
            }
        },
    },
});
