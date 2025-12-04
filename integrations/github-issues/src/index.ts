import { createIntegration, Logger } from '@gitbook/runtime';
import { Router } from 'itty-router';
import type { GitHubIssuesRuntimeContext } from './types';
import { configComponent } from './components';
import { handleGitHubAppSetup } from './setup';
import { verifyGitHubWebhookSignature } from './webhook';

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
         * GitHub webhook events handlers.
         */
        router.post('/webhook', async (request: Request) => {
            const rawBody = await request.text();
            const payload = rawBody ? JSON.parse(rawBody) : {};
            const githubEvent = request.headers.get('x-github-event');

            logger.info('Received GitHub webhook', {
                event: githubEvent,
                action: payload.action,
            });

            const isSignatureValid = await verifyGitHubWebhookSignature(request, rawBody, context);
            if (!isSignatureValid) {
                return new Response('Unauthorized', { status: 401 });
            }

            return new Response('OK', { status: 200 });
        });

        /**
         * Github app setup handler that the user is redirected to after installing the app.
         */
        router.get('/setup', async () => {
            const url = new URL(request.url);
            const githubAppInstallationId = url.searchParams.get('installation_id');
            const unverifiedAppSetupState = url.searchParams.get('state');

            if (!unverifiedAppSetupState || !githubAppInstallationId) {
                // The installation has been initiated from GitHub directly without going through GitBook.
                // In this case redirect the user back to GitBook so we can properly link to an GitBook installation.
                return Response.redirect(context.environment.integration.urls.app);
            }

            const setupResponse = await handleGitHubAppSetup({
                context,
                githubAppInstallationId,
                unverifiedAppSetupState,
            });

            return setupResponse;
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
