import { Router } from 'itty-router';

// import { ContentKitSelectOption, GitSyncOperationState } from '@gitbook/api';
import { ContentKitSelectOption } from '@gitbook/api';
import {
    createIntegration,
    FetchEventCallback,
    createOAuthHandler,
    Logger,
    EventCallback,
} from '@gitbook/runtime';

// import { fetchInstallationRepositories, fetchInstallations, fetchRepositoryBranches } from './api';
import { fetchProjectBranches, fetchProjects } from './api';
import { configBlock } from './components';
// import { triggerExport, updateCommitWithPreviewLinks } from './sync';
import type { GitLabRuntimeContext } from './types';
import { parseProject } from './utils';
// import { parseInstallation, parseRepository } from './utils';
// import { handlePullRequestEvents, handlePushEvent, verifyGitHubWebhookSignature } from './webhooks';

const logger = Logger('gitlab');

const handleFetchEvent: FetchEventCallback<GitLabRuntimeContext> = async (request, context) => {
    const { environment } = context;

    const router = Router({
        base: new URL(
            environment.spaceInstallation?.urls?.publicEndpoint ||
                environment.installation?.urls.publicEndpoint ||
                environment.integration.urls.publicEndpoint
        ).pathname,
    });

    /**
     * Handle GitLab webhooks
     */
    // router.post('/hooks/gitlab', async (request) => {
    //     const id = request.headers.get('x-github-delivery');
    //     const event = request.headers.get('x-github-event');
    //     const signature = request.headers.get('x-hub-signature-256') ?? '';
    //     const payloadString = await request.text();
    //     const payload = JSON.parse(payloadString);

    //     // Verify webhook signature
    //     try {
    //         await verifyGitHubWebhookSignature(
    //             payloadString,
    //             signature,
    //             environment.secrets.WEBHOOK_SECRET
    //         );
    //     } catch (error: any) {
    //         return new Response(JSON.stringify({ error: error.message }), {
    //             status: 400,
    //             headers: { 'content-type': 'application/json' },
    //         });
    //     }

    //     logger.debug('received webhook event', { id, event });

    //     /**
    //      * Handle Webhook events
    //      */
    //     if (event === 'push') {
    //         await handlePushEvent(context, payload);
    //     } else if (
    //         event === 'pull_request' &&
    //         (payload.action === 'opened' || payload.action === 'synchronize')
    //     ) {
    //         await handlePullRequestEvents(context, payload);
    //     } else {
    //         logger.debug('ignoring webhook event', { id, event });
    //     }

    //     return new Response(JSON.stringify({ ok: true }), {
    //         status: 200,
    //         headers: { 'content-type': 'application/json' },
    //     });
    // });

    /*
     * Authenticate using GitLab OAuth
     */
    router.get(
        '/oauth',
        createOAuthHandler({
            redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
            clientId: context.environment.secrets.CLIENT_ID,
            clientSecret: context.environment.secrets.CLIENT_SECRET,
            authorizeURL: 'https://gitlab.com/oauth/authorize',
            accessTokenURL: 'https://gitlab.com/oauth/token',
            scopes: ['api', 'read_repository', 'write_repository'],
            prompt: 'consent',
        })
    );

    /**
     * API to fetch all GitLab projects under current authentication
     */
    router.get('/projects', async () => {
        const projects = await fetchProjects(context);

        const data = projects.map(
            (project): ContentKitSelectOption => ({
                id: `${project.id}:${project.name}`,
                label: project.name_with_namespace,
            })
        );

        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });

    /**
     * API to fetch all branches of a project's repository
     */
    router.get('/branches', async (req) => {
        const { project } = req.query;

        const projectId =
            project && typeof project === 'string' ? parseProject(project).projectId : undefined;

        const branches = projectId ? await fetchProjectBranches(context, projectId) : [];

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
    GitLabRuntimeContext
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

    // await triggerExport(context, context.environment.spaceInstallation.configuration);
};

/*
 * Handle git sync started: Update commit status
 */
const handleGitSyncStarted: EventCallback<'space_gitsync_started', GitLabRuntimeContext> = async (
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

    // await updateCommitWithPreviewLinks(
    //     context,
    //     event.spaceId,
    //     event.revisionId,
    //     spaceInstallationConfiguration,
    //     event.commitId,
    //     GitSyncOperationState.Running
    // );
};

/**
 * Handle git sync completed: Update commit status
 */
const handleGitSyncCompleted: EventCallback<
    'space_gitsync_completed',
    GitLabRuntimeContext
> = async (event, context) => {
    logger.info(
        `Git Sync completed (${event.state}) for space ${event.spaceId} revision ${event.revisionId}, updating commit status`
    );

    const spaceInstallationConfiguration = context.environment.spaceInstallation?.configuration;
    if (!spaceInstallationConfiguration) {
        logger.debug(`missing space installation configuration, skipping`);
        return;
    }

    // await updateCommitWithPreviewLinks(
    //     context,
    //     event.spaceId,
    //     event.revisionId,
    //     spaceInstallationConfiguration,
    //     event.commitId,
    //     event.state as GitSyncOperationState
    // );
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
