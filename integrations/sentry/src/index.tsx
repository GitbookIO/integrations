import { createIntegration } from '@gitbook/runtime';
import { oauthHandler, redirectHandler, webhookHandler } from './handlers';
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

        /*
         * Handles GitBook auth flow
         */
        router.get('/oauth', oauthHandler);

        /*
         * Handles Sentry redirect requests,
         * only used after integration install/uninstall in sentry.io
         */
        router.get('/redirect', redirectHandler);

        /**
         * Handles Sentry webhook requests
         * Which hooks are sent are configured in https://sentry.io/settings/gitbook/developer-settings/
         *
         * Integration install/uninstall events are sent by default.
         */
        router.post('/webhook', webhookHandler);

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
