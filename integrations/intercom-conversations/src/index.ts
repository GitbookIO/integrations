import { Router } from 'itty-router';

import {
    createIntegration,
    createOAuthHandler,
    ExposableError,
    Logger,
    verifyIntegrationRequestSignature,
} from '@gitbook/runtime';
import { getIntercomOAuthConfig } from './client';
import { configComponent } from './config';
import { ingestLastClosedIntercomConversations } from './conversations';
import type { IntercomIntegrationTask, IntercomRuntimeContext } from './types';
import { handleIntercomWebhookRequest } from './intercom-webhooks';
import { handleIntercomIntegrationTask } from './tasks';

const logger = Logger('intercom-conversations');

export default createIntegration<IntercomRuntimeContext>({
    fetch: async (request, context) => {
        const { environment } = context;

        const router = Router({
            base: new URL(
                environment.installation?.urls.publicEndpoint ||
                    environment.integration.urls.publicEndpoint,
            ).pathname,
        });

        /*
         * OAuth flow.
         */
        router.get(
            '/oauth',
            createOAuthHandler(getIntercomOAuthConfig(context), {
                replace: false,
            }),
        );

        /*
         * Webhook handler to ingest conversations when they are closed.
         */
        router.post('/webhook', async (request) => {
            return handleIntercomWebhookRequest(request, context);
        });

        /**
         * Integration tasks handler.
         */
        router.post('/tasks', async (request) => {
            const verified = await verifyIntegrationRequestSignature(request, environment);

            if (!verified) {
                const message = `Invalid signature for integration task`;
                logger.error(message);
                throw new ExposableError(message);
            }

            const { task } = JSON.parse(await request.text()) as { task: IntercomIntegrationTask };
            logger.debug('Verified & received integration task', task);

            context.waitUntil(
                (async () => {
                    await handleIntercomIntegrationTask(context, task);
                })(),
            );

            return new Response(JSON.stringify({ acknowledged: true }), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        });

        try {
            const response = await router.handle(request, context);
            if (!response) {
                return new Response(`No route matching ${request.method} ${request.url}`, {
                    status: 404,
                });
            }
            return response;
        } catch (error: any) {
            logger.error(`error handling request ${error.message} ${error.stack}`);
            return new Response('Unexpected error', {
                status: 500,
            });
        }
    },
    components: [configComponent],
    events: {
        /**
         * When the integration is installed, we fetch all recent conversations and ingest them
         */
        installation_setup: async (_, context) => {
            const { installation } = context.environment;
            if (installation?.configuration.oauth_credentials) {
                await ingestLastClosedIntercomConversations(context);
            }
        },
    },
});
