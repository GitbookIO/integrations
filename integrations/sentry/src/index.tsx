import { createIntegration } from '@gitbook/runtime';
import { createOAuthHandler, createWebhoookHandler } from './api/handlers';
import { SentryRuntimeContext } from './types';
import { Router } from 'itty-router';
import { embedBlock } from './blocks';

export default createIntegration<SentryRuntimeContext>({
    fetch: async (request, context) => {
        const { environment } = context;

        const router = Router({
            base: new URL(
                environment.spaceInstallation?.urls?.publicEndpoint ||
                    environment.installation?.urls.publicEndpoint ||
                    environment.integration.urls.publicEndpoint
            ).pathname,
        });

        // Auth router/routes
        /*
         * Authenticate the user using OAuth.
         */

        router.get('/oauth', createOAuthHandler());

        /*
         * Handles Sentry's webhook/redirect requests.
         * What request types are sent are configured in https://sentry.io/settings/gitbook/developer-settings/
         *
         * Integration install/uninstall events are supported by default.
         */
        router.get('/webhook', createWebhoookHandler());

        router.post('/webhook', (req, { api, environment }) => {
            console.log('webhook post');
        });

        const response = await router.handle(request, context);
        if (!response) {
            return new Response(`No route matching ${request.method} ${request.url}`, {
                status: 404,
            });
        }

        return response;
    },

    components: [embedBlock],
});
