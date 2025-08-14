import { createIntegration, createOAuthHandler, Logger } from '@gitbook/runtime';
import { Router } from 'itty-router';
import { GitHubRuntimeContext } from './types';
import { getGitHubOAuthConfig } from './client';
import { ingestConversations } from './conversations';
import { configComponent } from './config';
import { handleWebhook } from './webhook';

const logger = Logger('github-conversations');

export default createIntegration<GitHubRuntimeContext>({
    fetch: async (request, context) => {
        const router = Router({
            base: new URL(
                context.environment.spaceInstallation?.urls?.publicEndpoint ||
                    context.environment.installation?.urls.publicEndpoint ||
                    context.environment.integration.urls.publicEndpoint,
            ).pathname,
        });

        /*
         * Webhook to ingest discussions when they are closed.
         */
        router.post('/webhook', async (request) => {
            const rawBody = await request.text?.();
            const payload = rawBody ? JSON.parse(rawBody) : {};

            logger.info('Received GitHub webhook', {
                event: request.headers.get('x-github-event'),
                action: payload.action,
            });

            return handleWebhook(context, payload, request as Request, rawBody || '');
        });

        /*
         * OAuth flow.
         */
        router.get('/oauth', async (request) => {
            const oauthHandler = createOAuthHandler(getGitHubOAuthConfig(context), {
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
         * When the integration is installed, we fetch all closed discussions and ingest them.
         * We also set up webhooks for real-time updates (if possible).
         */
        installation_setup: async (_, context) => {
            const { installation } = context.environment;
            if (installation?.configuration.oauth_credentials) {
                try {
                    // First, ingest existing closed discussions
                    await ingestConversations(context);

                    // TODO: Set up webhooks for selected repositories
                    // This would require additional implementation to:
                    // 1. Get list of repositories with discussions enabled
                    // 2. Create webhooks for each repository
                    // 3. Store webhook IDs for later cleanup
                    // 4. Handle webhook authentication with secrets

                    logger.info('Installation setup completed');
                } catch (error) {
                    logger.error('Installation setup failed', {
                        error: error instanceof Error ? error.message : String(error),
                    });
                    // Don't throw - we want the installation to succeed even if ingestion fails
                }
            }
        },
    },
});
