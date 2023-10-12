import { Router } from 'itty-router';

import { ContentKitSelectOption } from '@gitbook/api';
import {
    createIntegration,
    FetchEventCallback,
    createOAuthHandler,
    Logger,
} from '@gitbook/runtime';

import { fetchInstallations } from './api';
import { syncBlock } from './components';
import { wrapTaskWithRetry } from './tasks';
import { GithubRuntimeContext, IntegrationTask } from './types';
import { arrayToHex, safeCompare } from './utils';
import {
    handleIssueCommentEvent,
    handleIssueEvent,
    handlePullRequestEvent,
    handlePullRequestReviewCommentEvent,
    handleReleaseEvent,
    handleRepositoryEvent,
    verifyGitHubWebhookSignature,
} from './webhooks';

const logger = Logger('github-entities');

const handleFetchEvent: FetchEventCallback<GithubRuntimeContext> = async (request, context) => {
    const { environment } = context;

    const router = Router({
        base: new URL(
            environment.installation?.urls.publicEndpoint ||
                environment.integration.urls.publicEndpoint
        ).pathname,
    });

    async function verifyIntegrationSignature(
        payload: string,
        signature: string,
        secret: string
    ): Promise<boolean> {
        if (!signature) {
            return false;
        }

        const algorithm = { name: 'HMAC', hash: 'SHA-256' };
        const enc = new TextEncoder();
        const key = await crypto.subtle.importKey('raw', enc.encode(secret), algorithm, false, [
            'sign',
            'verify',
        ]);
        const signed = await crypto.subtle.sign(algorithm.name, key, enc.encode(payload));
        const expectedSignature = arrayToHex(signed);

        return safeCompare(expectedSignature, signature);
    }

    router.post('/tasks', async (request) => {
        const signature = request.headers.get('x-gitbook-integration-signature') ?? '';
        const payloadString = await request.text();

        const verified = await verifyIntegrationSignature(
            payloadString,
            signature,
            environment.signingSecret!
        );

        if (!verified) {
            return new Response('Invalid integration signature', {
                status: 400,
            });
        }

        const { task } = JSON.parse(payloadString) as { task: IntegrationTask };
        logger.debug('received integration task', task);

        await wrapTaskWithRetry(context, task);

        return new Response(JSON.stringify({ acknowledged: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    });

    /**
     * Handle task for GitHub App webhook events
     */
    router.post('/hooks/github-app', async (request) => {
        const id = request.headers.get('x-github-delivery');
        const event = request.headers.get('x-github-event');
        const signature = request.headers.get('x-hub-signature-256') ?? '';

        logger.debug('received webhook event', { id, event });

        context.waitUntil(
            (async () => {
                const payloadString = await request.text();
                const payload = JSON.parse(payloadString);

                // Verify webhook signature
                try {
                    await verifyGitHubWebhookSignature(
                        payloadString,
                        signature,
                        environment.secrets.WEBHOOK_SECRET
                    );
                } catch (error) {
                    logger.error(`Error verifying signature for id:${id}, error ${error}`);
                    return;
                }

                /**
                 * Handle Webhook events
                 */
                switch (event) {
                    case 'repository':
                        await handleRepositoryEvent(context, payload);
                        break;
                    case 'pull_request':
                        await handlePullRequestEvent(context, payload);
                        break;
                    case 'pull_request_review_comment':
                        await handlePullRequestReviewCommentEvent(context, payload);
                    case 'issue':
                        await handleIssueEvent(context, payload);
                        break;
                    case 'issue_comment':
                        await handleIssueCommentEvent(context, payload);
                        break;
                    case 'release':
                        await handleReleaseEvent(context, payload);
                        break;
                    default:
                        logger.debug('ignoring webhook event', { id, event });
                }
            })()
        );

        /**
         * Acknowledge the webhook immediately to avoid GitHub timeouts.
         * https://docs.github.com/en/rest/guides/best-practices-for-integrators?#favor-asynchronous-work-over-synchronous
         */
        logger.debug('acknowledging webhook event', { id, event });
        return new Response(JSON.stringify({ acknowledged: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    });

    router.get('/status', async () => {
        const integrationInstallation = context.environment.installation;
        if (!integrationInstallation) {
            return new Response(`Installation does not exist for integration`, {
                status: 404,
            });
        }

        return new Response(
            JSON.stringify({ configured: Boolean(integrationInstallation.configuration.key) }),
            {
                status: 200,
                headers: { 'content-type': 'application/json' },
            }
        );
    });

    router.get('/app-installation', async (request) => {
        const { state } = request.query;

        if (state && typeof state === 'string') {
            const { data: integrationInstallation, error } =
                await context.api.integrations.getIntegrationInstallationById(
                    context.environment.integration.name,
                    state
                );

            if (error) {
                return new Response(error.error.message, {
                    status: error.error.code || 500,
                });
            }

            await context.api.integrations.updateIntegrationInstallation(
                context.environment.integration.name,
                state,
                {
                    configuration: {
                        ...integrationInstallation.configuration,
                        hasInstalledApp: true,
                    },
                }
            );
        }

        return new Response('App installed successfully, you can close this window', {
            status: 200,
        });
    });

    /*
     * Authenticate using GitHub OAuth
     */
    router.get(
        '/oauth',
        createOAuthHandler(
            {
                redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
                clientId: context.environment.secrets.CLIENT_ID,
                clientSecret: context.environment.secrets.CLIENT_SECRET,
                authorizeURL: 'https://github.com/login/oauth/authorize',
                accessTokenURL: 'https://github.com/login/oauth/access_token',
                scopes: [],
                prompt: 'consent',
            },
            {
                replace: false,
            }
        )
    );

    /**
     * API to fetch all GitHub installations
     */
    router.get('/installations', async () => {
        const installations = await fetchInstallations(context);

        const data = installations.map(
            (installation): ContentKitSelectOption => ({
                id: `${installation.id}`,
                label: installation.account.login,
                icon: {
                    type: 'image',
                    aspectRatio: 1,
                    source: {
                        url: installation.account.avatar_url,
                    },
                },
            })
        );

        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });

    let response;
    try {
        response = await router.handle(request, context);
    } catch (error: any) {
        logger.error('error handling request', error);
        return new Response(error.message, {
            status: error.status || 500,
        });
    }

    if (!response) {
        return new Response(`No route matching ${request.method} ${request.url}`, {
            status: 404,
        });
    }

    return response;
};

export default createIntegration({
    fetch: handleFetchEvent,
    components: [syncBlock],
    events: {},
});
