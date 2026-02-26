import { createIntegration, Logger } from '@gitbook/runtime';
import { Router } from 'itty-router';
import { FirefliesRuntimeContext } from './types';
import { ingestConversations } from './conversations';
import { configComponent } from './config';
import { handleFirefliesWebhookRequest } from './webhooks';

const logger = Logger('fireflies-conversations');

export default createIntegration<FirefliesRuntimeContext>({
    fetch: async (request, context) => {
        const router = Router({
            base: new URL(
                context.environment.spaceInstallation?.urls?.publicEndpoint ||
                    context.environment.installation?.urls.publicEndpoint ||
                    context.environment.integration.urls.publicEndpoint,
            ).pathname,
        });

        /*
         * Webhook handler to ingest transcripts when transcription completes.
         */
        router.post('/webhook', async (request) => {
            return handleFirefliesWebhookRequest(request, context);
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
         * When the integration is installed, we fetch recent transcripts and ingest them
         */
        installation_setup: async (_, context) => {
            const { installation } = context.environment;
            if (installation?.configuration.api_key) {
                logger.info('Starting transcript ingestion on installation setup');
                await ingestConversations(context);
            } else {
                logger.info('API key not configured, skipping transcript ingestion');
            }
        },
    },
});
