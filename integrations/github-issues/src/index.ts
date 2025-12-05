import { createIntegration, Logger } from '@gitbook/runtime';
import { Router } from 'itty-router';
import type {
    GitHubIssuesRuntimeContext,
    GitHubWebhookEventPayload,
    GitHubWebhookEventType,
} from './types';
import { configComponent } from './components';
import { handleGitHubAppSetup } from './setup';
import { handleGitHubAppInstallationDeletedEvent, verifyGitHubWebhookSignature } from './webhook';
import { triggerInitialGitHubIssuesIngestion } from './ingestion';
import { getGitHubInstallationIds } from './utils';
import { handleGitHubIssuesIntegrationTask } from './tasks';

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
            const githubEvent = request.headers.get('x-github-event') as GitHubWebhookEventType;

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
                    const eventPayload: GitHubWebhookEventPayload['installation'] =
                        JSON.parse(rawBody);

                    if (eventPayload.action !== 'deleted') {
                        // We handle created installation when the GitHub installation setup callback is called
                        // in order to properly linked them to an GitBook integration installation ID.

                        // Other actions are not supported yet.
                        break;
                    }

                    return context.waitUntil(
                        handleGitHubAppInstallationDeletedEvent(context, eventPayload),
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
        installation_setup: async (_, context) => {
            const githubInstallationIds = getGitHubInstallationIds(context);
            const hasInstallations = githubInstallationIds.length > 0;
            const gitbookInstallationId = context.environment.installation?.id;

            if (!hasInstallations) {
                logger.info(
                    `GitBook installation ${gitbookInstallationId} has no associated GitHub installations. Skipping initial ingestion.`,
                );
                return;
            }

            try {
                await triggerInitialGitHubIssuesIngestion(context);
            } catch (error) {
                logger.error(
                    `GitBook installation ${gitbookInstallationId} setup failed: `,
                    error instanceof Error ? error.message : String(error),
                );
            }
        },
    },
    task: handleGitHubIssuesIntegrationTask,
});
