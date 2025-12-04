import { createIntegration, Logger } from '@gitbook/runtime';
import { Router } from 'itty-router';
import type { GitHubIssuesRuntimeContext, GitHubWebhookInstallationEventPayload } from './types';
import { configComponent } from './components';
import { handleGitHubAppSetup } from './setup';
import { handleGitHubAppInstallationEvent, verifyGitHubWebhookSignature } from './webhook';

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
            const githubEvent = request.headers.get('x-github-event');

            logger.info(`received GitHub "${githubEvent}" webhook event`);

            const isSignatureValid = await verifyGitHubWebhookSignature(context, request, rawBody);
            if (!isSignatureValid) {
                return new Response('Unauthorized', { status: 401 });
            }

            if (!rawBody) {
                return new Response('Malformed webhook', { status: 412 });
            }

            switch (githubEvent) {
                case 'installation': {
                    const eventPayload: GitHubWebhookInstallationEventPayload = JSON.parse(rawBody);

                    if (eventPayload.action === 'created') {
                        // We handle created installation when the GitHub installation setup callback is called
                        // in order to properly linked them to an GitBook integration installation ID
                        break;
                    }

                    return context.waitUntil(
                        handleGitHubAppInstallationEvent(context, eventPayload),
                    );
                }
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
