import { Router } from 'itty-router';

import { ContentKitSelectOption, GitSyncOperationState } from '@gitbook/api';
import {
    createIntegration,
    FetchEventCallback,
    createOAuthHandler,
    Logger,
    EventCallback,
} from '@gitbook/runtime';

import { fetchInstallationRepositories, fetchInstallations, fetchRepositoryBranches } from './api';
import { configBlock } from './components';
import { getGitHubApp, triggerExport, updateCommitWithPreviewLinks } from './provider';
import type { GithubRuntimeContext } from './types';
import { parseInstallation, parseRepository } from './utils';
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

    /**
     * Handle GitHub App webhooks
     */
    router.post('/hooks/github', async (request) => {
        const githubApp = await getGitHubApp(context);
        const id = request.headers.get('x-github-delivery');
        const name = request.headers.get('x-github-event');
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

        githubApp.webhooks.onAny(({ id, name, payload }) => {
            logger.debug('received event', { id, name, payload });
        });

        githubApp.webhooks.on('push', async ({ payload }) => {
            logger.info('receiving push event', payload);
            await handlePushEvent(context, payload);
        });

        githubApp.webhooks.on(
            ['pull_request.synchronize', 'pull_request.opened'],
            async ({ payload }) => {
                logger.info('receiving pull_request event', payload);
                await handlePullRequestEvents(context, payload);
            }
        );

        // Hand the webhook
        try {
            await githubApp.webhooks.receive({
                id: id as string,
                // @ts-ignore
                name,
                payload,
            });

            return new Response(JSON.stringify({ ok: true }), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        } catch (error: any) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { 'content-type': 'application/json' },
            });
        }
    });

    /*
     * Authenticate using GitHub OAuth
     */
    router.get(
        '/oauth',
        createOAuthHandler({
            redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
            clientId: context.environment.secrets.CLIENT_ID,
            clientSecret: context.environment.secrets.CLIENT_SECRET,
            authorizeURL: 'https://github.com/login/oauth/authorize',
            accessTokenURL: 'https://github.com/login/oauth/access_token',
            scopes: [],
            prompt: 'consent',
        })
    );

    /**
     * API to fetch all GitHub installations
     */
    router.get('/installations', async () => {
        const installations = await fetchInstallations(context);

        const data = installations.map(
            (installation): ContentKitSelectOption => ({
                id: `${installation.id}:${installation.account.login}`,
                label: installation.account.login,
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
        const { installation } = req.query;
        const installationId =
            installation && typeof installation === 'string'
                ? parseInstallation(installation).installationId.toString()
                : undefined;

        const repositories = installationId
            ? await fetchInstallationRepositories(context, installationId)
            : [];

        const data = repositories.map(
            (repository): ContentKitSelectOption => ({
                id: `${repository.id}:${repository.name}`,
                label: repository.name,
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
        const { installation, repository } = req.query;

        const accountName =
            installation && typeof installation === 'string'
                ? parseInstallation(installation).accountName
                : undefined;
        const repositoryName =
            repository && typeof repository === 'string'
                ? parseRepository(repository).repoName
                : undefined;

        const branches =
            accountName && repositoryName
                ? await fetchRepositoryBranches(context, accountName, repositoryName)
                : [];

        const data = branches.map(
            (branch): ContentKitSelectOption => ({
                id: branch.name,
                label: branch.name,
            })
        );

        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });

    const response = await router.handle(request, context).catch((error) => {
        logger.error('error handling request', error);
        return new Response(error.message, {
            status: 500,
        });
    });

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

    if (!context.environment.spaceInstallation?.configuration) {
        logger.debug(`missing space installation configuration, skipping`);
        return;
    }

    await triggerExport(context, context.environment.spaceInstallation.configuration);
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

    const spaceInstallationConfiguration = context.environment.spaceInstallation?.configuration;
    if (!spaceInstallationConfiguration) {
        logger.debug(`missing space installation configuration, skipping`);
        return;
    }

    await updateCommitWithPreviewLinks(
        context,
        event.spaceId,
        event.revisionId,
        spaceInstallationConfiguration,
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

    const spaceInstallationConfiguration = context.environment.spaceInstallation?.configuration;
    if (!spaceInstallationConfiguration) {
        logger.debug(`missing space installation configuration, skipping`);
        return;
    }

    await updateCommitWithPreviewLinks(
        context,
        event.spaceId,
        event.revisionId,
        spaceInstallationConfiguration,
        event.commitId,
        event.state as GitSyncOperationState
    );
};

export default createIntegration({
    fetch: handleFetchEvent,
    components: [configBlock],
    events: {
        space_content_updated: handleSpaceContentUpdated,
        space_gitsync_started: handleGitSyncStarted,
        space_gitsync_completed: handleGitSyncCompleted,
    },
});
