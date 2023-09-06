import { Router } from 'itty-router';

import { ContentKitIcon, ContentKitSelectOption, GitSyncOperationState } from '@gitbook/api';
import {
    createIntegration,
    FetchEventCallback,
    createOAuthHandler,
    Logger,
    EventCallback,
} from '@gitbook/runtime';

import { fetchInstallationRepositories, fetchInstallations, fetchRepositoryBranches } from './api';
import { configBlock } from './components';
import { createReleaseEntitySchema } from './entities';
import { triggerExport, updateCommitWithPreviewLinks } from './sync';
import type { GithubRuntimeContext } from './types';
import { parseInstallationOrThrow, parseRepositoryOrThrow } from './utils';
import { handlePullRequestEvents, handlePushEvent, verifyGitHubWebhookSignature } from './webhooks';

const logger = Logger('github');

const handleFetchEvent: FetchEventCallback<GithubRuntimeContext> = async (request, context) => {
    const { environment } = context;

    const router = Router({
        base: new URL(
            environment.spaceInstallation?.urls?.publicEndpoint ||
                environment.installation?.urls.publicEndpoint ||
                environment.integration.urls.publicEndpoint
        ).pathname,
    });

    router.post('/tasks', async (request) => {
        const headers = Object.fromEntries(Object.entries(request.headers));
        const payloadString = await request.text();
        const payload = JSON.parse(payloadString);
        console.log({ headers, payload });
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
        if (event === 'push') {
            await handlePushEvent(context, payload);
        } else if (
            event === 'pull_request' &&
            (payload.action === 'opened' || payload.action === 'synchronize')
        ) {
            await handlePullRequestEvents(context, payload);
        } else {
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

    /**
     * API to fetch all branches of an account's repository
     */
    router.get('/branches', async (req) => {
        const { repository: queryRepository } = req.query;

        const repositoryId =
            queryRepository && typeof queryRepository === 'string'
                ? parseRepositoryOrThrow(queryRepository)
                : undefined;

        const branches = repositoryId ? await fetchRepositoryBranches(context, repositoryId) : [];

        const data = branches.map(
            (branch): ContentKitSelectOption => ({
                id: branch.name,
                label: branch.name,
                icon: branch.protected ? ContentKitIcon.Lock : undefined,
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

/*
 * Handle content being updated: Trigger an export to GitHub
 */
const handleSpaceContentUpdated: EventCallback<
    'space_content_updated',
    GithubRuntimeContext
> = async (event, context) => {
    const { data: revision } = await context.api.spaces.getRevisionById(
        event.spaceId,
        event.revisionId
    );
    if (revision.git?.oid) {
        const revisionStatus = revision.git.createdByGitBook ? 'exported' : 'imported';
        logger.info(
            `skipping Git Sync for space ${event.spaceId} revision ${revision.id} as it was already ${revisionStatus}`
        );
        return;
    }

    const spaceInstallation = context.environment.spaceInstallation;
    if (!spaceInstallation) {
        logger.debug(`missing space installation, skipping`);
        return;
    }

    await triggerExport(context, spaceInstallation);
};

/*
 * Handle git sync started: Update commit status
 */
const handleGitSyncStarted: EventCallback<'space_gitsync_started', GithubRuntimeContext> = async (
    event,
    context
) => {
    logger.info(
        `Git Sync started for space ${event.spaceId} revision ${event.revisionId}, updating commit status`
    );

    const spaceInstallation = context.environment.spaceInstallation;
    if (!spaceInstallation) {
        logger.debug(`missing space installation, skipping`);
        return;
    }

    await updateCommitWithPreviewLinks(
        context,
        spaceInstallation,
        event.revisionId,
        event.commitId,
        GitSyncOperationState.Running
    );
};

/**
 * Handle git sync completed: Update commit status
 */
const handleGitSyncCompleted: EventCallback<
    'space_gitsync_completed',
    GithubRuntimeContext
> = async (event, context) => {
    logger.info(
        `Git Sync completed (${event.state}) for space ${event.spaceId} revision ${event.revisionId}, updating commit status`
    );

    const spaceInstallation = context.environment.spaceInstallation;
    if (!spaceInstallation) {
        logger.debug(`missing space installation, skipping`);
        return;
    }

    await updateCommitWithPreviewLinks(
        context,
        spaceInstallation,
        event.revisionId,
        event.commitId,
        event.state as GitSyncOperationState
    );
};

/**
 * Handle installation setup: Create Entity schemas in the organization
 */
const handleInstallationSetup: EventCallback<'installation_setup', GithubRuntimeContext> = async (
    event,
    context
) => {
    const { environment, api } = context;
    // await api.integrations.queueIntegrationTask(environment.integration.name, {
    //     task: {
    //         type: 'testing',
    //         token: '123',
    //     },
    //     schedule: 10,
    // });
    console.log('queueIntegrationTask', environment.integration.name);

    // if (environment.installation && 'organization' in environment.installation.target) {
    //     await createReleaseEntitySchema(context, environment.installation.target.organization);
    // }
};

export default createIntegration({
    fetch: handleFetchEvent,
    components: [configBlock],
    events: {
        installation_setup: handleInstallationSetup,
        space_content_updated: handleSpaceContentUpdated,
        space_gitsync_started: handleGitSyncStarted,
        space_gitsync_completed: handleGitSyncCompleted,
    },
});
