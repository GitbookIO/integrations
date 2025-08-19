import { createIntegration, ExposableError, Logger } from '@gitbook/runtime';
import { Router } from 'itty-router';
import { GitHubRuntimeContext } from './types';
import { configComponent } from './config';
import {
    handleDiscussionClosed,
    handleInstallationDeleted,
    verifyWebhookSignature,
} from './webhook';
import { ingestConversations } from './conversations';
import { handleInstallationSetup } from './install';

const logger = Logger('github-conversations');

export default createIntegration<GitHubRuntimeContext>({
    fetch: async (request, context) => {
        const router = Router({
            base: new URL(
                context.environment.installation?.urls.publicEndpoint ||
                    context.environment.integration.urls.publicEndpoint,
            ).pathname,
        });

        /*
         * Webhook to handle GitHub events (discussions, installations, etc.)
         */
        router.post('/webhook', async (request) => {
            const rawBody = await request.text?.();
            const payload = rawBody ? JSON.parse(rawBody) : {};
            const githubEvent = (request as Request).headers.get('x-github-event');

            logger.info('Received GitHub webhook', {
                payload,
                event: githubEvent,
                action: payload.action,
            });

            const signatureError = await verifyWebhookSignature(
                request as Request,
                rawBody || '',
                context,
            );

            if (signatureError) {
                return signatureError;
            }

            if (githubEvent === 'installation' && payload.action === 'deleted') {
                return handleInstallationDeleted(context, payload);
            }

            if (githubEvent === 'discussion' && payload.action === 'closed' && payload.discussion) {
                return handleDiscussionClosed(context, payload);
            }

            return new Response('OK', { status: 200 });
        });

        /*
         * GitHub App installation flow.
         * This redirects users to install the GitHub App with GitBook installation ID as state.
         */
        router.get('/install', async () => {
            const installation = context.environment.installation;
            if (!installation) {
                return new Response('GitBook installation context not found', { status: 400 });
            }

            // Redirect to GitHub App installation page with state parameter
            const gitbookInstallationId = installation.id; // Pass GitBook installation ID as state
            const installationUrl = `https://github.com/apps/${context.environment.secrets.GITHUB_APP_NAME}/installations/new?state=${encodeURIComponent(gitbookInstallationId)}`;

            return Response.redirect(installationUrl, 302);
        });

        /*
         * GitHub App post-installation setup.
         * This handles the setup after the app is installed on GitHub.
         */
        router.get('/setup', async (request) => {
            const url = new URL(request.url);
            const githubInstallationId = url.searchParams.get('installation_id');
            const setupAction = url.searchParams.get('setup_action');
            const gitbookInstallationId = url.searchParams.get('state'); // GitBook installation ID

            if (!githubInstallationId) {
                return new ExposableError('Missing installation_id');
            }

            if (!gitbookInstallationId) {
                return new ExposableError('Missing GitBook installation ID');
            }

            switch (setupAction) {
                case 'install':
                    return await handleInstallationSetup(
                        context,
                        githubInstallationId,
                        gitbookInstallationId,
                    );

                case 'update':
                    // TODO:
                    // App permissions or repository access updated - re-trigger ingestion
                    return new Response('Update not implemented yet', { status: 501 });

                case 'request':
                    // TODO:
                    // User is requesting access to additional repositories or permissions
                    return new Response('Request not implemented yet', { status: 501 });

                default:
                    throw new Error(`Unknown setup action: ${setupAction}`);
            }
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
         * When the integration is installed, we fetch all closed discussions and ingest them.
         */
        installation_setup: async (_, context) => {
            const { installation } = context.environment;
            const hasInstallations =
                installation?.configuration.installation_ids &&
                installation.configuration.installation_ids.length > 0;

            if (hasInstallations) {
                try {
                    await ingestConversations(context);
                } catch (error) {
                    logger.error('GitHub App installation setup failed', {
                        error: error instanceof Error ? error.message : String(error),
                    });
                }
            }
        },
    },
});
