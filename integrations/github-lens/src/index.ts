import { Router } from 'itty-router';

import { ContentKitIcon, ContentKitSelectOption } from '@gitbook/api';
import {
    createIntegration,
    FetchEventCallback,
    createOAuthHandler,
    Logger,
} from '@gitbook/runtime';

import { fetchInstallationRepositories, fetchInstallations } from './api';
import { syncBlock } from './components';
import { wrapTaskWithRetry } from './tasks';
import { GithubRuntimeContext, IntegrationTask } from './types';
import { parseInstallationOrThrow } from './utils';
import {
    handleIssueCommentEvent,
    handleIssueEvent,
    handlePullRequestEvent,
    handlePullRequestReviewCommentEvent,
    handleReleaseEvent,
    handleRepositoryEvent,
    verifyGitHubWebhookSignature,
} from './webhooks';

const logger = Logger('github');

const handleFetchEvent: FetchEventCallback<GithubRuntimeContext> = async (request, context) => {
    const { environment } = context;

    const router = Router({
        base: new URL(
            environment.installation?.urls.publicEndpoint ||
                environment.integration.urls.publicEndpoint
        ).pathname,
    });

    router.post('/tasks', async (request) => {
        const headers = Object.fromEntries(Object.entries(request.headers));
        const { task } = await request.json<{ task: IntegrationTask }>();

        logger.debug('received integration task', task);

        await wrapTaskWithRetry(context, task);
    });

    /**
     * Handle task for GitHub App webhook events
     */
    router.post('/hooks/github/task', async (request) => {
        const id = request.headers.get('x-github-delivery');
        const event = request.headers.get('x-github-event');
        const signature = request.headers.get('x-hub-signature-256') ?? '';
        const payloadString = await request.text();
        const payload = JSON.parse(payloadString);

        // Verify webhook signature
        try {
            await verifyGitHubWebhookSignature(
                payloadString,
                signature,
                environment.secrets.WEBHOOK_SECRET
            );
        } catch (error: any) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 400,
                headers: { 'content-type': 'application/json' },
            });
        }

        logger.debug('received webhook event', { id, event });

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

        return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    });

    /**
     * Acknowledge GitHub App webhook event and queue a task to handle it
     * in a subsequent request. This is to avoid GitHub timeouts.
     * https://docs.github.com/en/rest/guides/best-practices-for-integrators?#favor-asynchronous-work-over-synchronous
     */
    router.post('/hooks/github', async (request) => {
        const id = request.headers.get('x-github-delivery') as string;
        const event = request.headers.get('x-github-event') as string;
        const signature = request.headers.get('x-hub-signature-256') ?? '';

        logger.debug('acknowledging webhook event', { id, event });

        const taskUrl = new URL(request.url);
        taskUrl.pathname += '/task';
        const body = await request.text();

        context.waitUntil(
            fetch(taskUrl.toString(), {
                method: 'POST',
                body,
                headers: {
                    'content-type': request.headers.get('content-type') || 'application/text',
                    'x-github-delivery': id,
                    'x-github-event': event,
                    'x-hub-signature-256': signature,
                },
            })
        );

        return new Response(JSON.stringify({ acknowledged: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
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

    /**
     * API to fetch all repositories of an installation
     */
    router.get('/repos', async (req) => {
        const { installation: queryInstallation } = req.query;
        const installationId =
            queryInstallation && typeof queryInstallation === 'string'
                ? parseInstallationOrThrow(queryInstallation)
                : undefined;

        const repositories = installationId
            ? await fetchInstallationRepositories(context, installationId)
            : [];

        const data = repositories.map(
            (repository): ContentKitSelectOption => ({
                id: `${repository.id}`,
                label: repository.name,
                icon: repository.visibility === 'private' ? ContentKitIcon.Lock : undefined,
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
