import type { CopilotRequestPayload } from '@copilot-extensions/preview-sdk';
import { Router } from 'itty-router';

import { createIntegration, createOAuthHandler, Logger } from '@gitbook/runtime';

import { configurationComponent } from './configuration';
import { streamCopilotResponse } from './copilot';
import { getGitHubOAuthConfiguration } from './oauth';
import { verifyGitHubSetupState } from './setup';

const logger = Logger('github-copilot');

export default createIntegration({
    components: [configurationComponent],
    fetch: async (request, ctx) => {
        const { environment } = ctx;

        const router = Router({
            base: new URL(
                environment.installation?.urls.publicEndpoint ||
                    environment.integration.urls.publicEndpoint,
            ).pathname,
        });

        /*
         * Authenticate using GitHub OAuth
         */
        router.get(
            '/oauth',
            createOAuthHandler(getGitHubOAuthConfiguration(ctx), {
                replace: false,
            }),
        );

        /**
         * User is redirected after installing the application
         */
        router.get('/setup', async (request) => {
            const url = new URL(request.url);
            const githubInstallationId = url.searchParams.get('installation_id');
            const state = url.searchParams.get('state');

            if (!state || !githubInstallationId) {
                // Installed from GitHub, without starting from the GitBook integration
                return Response.redirect(environment.integration.urls.app);
            }

            const installationId = await verifyGitHubSetupState(ctx, state);

            const { data: installation } =
                await ctx.api.integrations.getIntegrationInstallationById(
                    environment.integration.name,
                    installationId,
                );

            await ctx.api.integrations.updateIntegrationInstallation(
                ctx.environment.integration.name,
                installation.id,
                {
                    externalIds: [
                        githubInstallationId,
                        ...(installation.externalIds || []).filter(
                            (id) => id !== githubInstallationId,
                        ),
                    ].slice(0, 5),
                    configuration: {
                        ...installation.configuration,
                        // Cache bust to refresh the configuration component
                        // as the cache is not busted when updating the externalIds
                        cacheBust: Date.now(),
                    },
                },
            );

            return Response.redirect(installation.urls.app);
        });

        /**
         * Copilot messages.
         */
        router.post('/copilot', async (request) => {
            const githubToken = request.headers.get('X-GitHub-Token');
            const body = await request.json<CopilotRequestPayload>();

            if (!githubToken) {
                throw new Error('Invalid request: missing X-GitHub-Token');
            }

            const { readable, writable } = new TransformStream();
            const writer = writable.getWriter();
            const encoder = new TextEncoder();

            const query = body.messages.findLast((message) => message.role === 'user')?.content;

            const write = async () => {
                for await (const message of streamCopilotResponse(ctx, githubToken, query)) {
                    await writer.write(encoder.encode(message));
                }
                await writer.close();
            };

            ctx.waitUntil(write());

            return new Response(readable, {
                headers: { 'content-type': 'text/plain' },
                status: 200,
            });
        });

        /**
         * Handle GitHub App webhook events
         */
        router.post('/webhook', async (request) => {
            // Do nothing, if you change this code to do something, don't forget to verify the signature
            return new Response('ok');
        });

        const response = (await router.handle(request, ctx).catch((err) => {
            logger.error(`error handling request ${err.message} ${err.stack}`);
            return new Response('Unexpected error', {
                status: 500,
            });
        })) as Response | undefined;

        if (!response) {
            return new Response(`No route matching ${request.method} ${request.url}`, {
                status: 404,
            });
        }

        return response;
    },
});
