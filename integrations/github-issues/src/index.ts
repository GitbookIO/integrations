import { createIntegration, Logger } from '@gitbook/runtime';
import { Router } from 'itty-router';
import type { GitHubIssuesRuntimeContext } from './types';
import { configComponent } from './components';

const logger = Logger('github-issues');

export default createIntegration<GitHubIssuesRuntimeContext>({
    fetch: async (request, context) => {
        const router = Router({
            base: new URL(
                context.environment.installation?.urls.publicEndpoint ||
                    context.environment.integration.urls.publicEndpoint,
            ).pathname,
        });

        /*
         * Webhook to handle GitHub webhook events.
         */
        router.post('/webhook', async (request) => {
            return new Response('OK', { status: 200 });
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
        installation_setup: async (_, context) => {},
    },
});
