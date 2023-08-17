import { Router } from 'itty-router';

import { ContentKitSelectOption, GitSyncOperationState } from '@gitbook/api';
import { createIntegration, FetchEventCallback, Logger, EventCallback } from '@gitbook/runtime';

import { fetchProjectBranches, fetchProjects } from './api';
import { configBlock } from './components';
import { triggerExport, updateCommitWithPreviewLinks } from './sync';
import type { GitLabRuntimeContext } from './types';
import { getSpaceConfig, parseProject } from './utils';
import { handleMergeRequestEvent, handlePushEvent } from './webhooks';

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
    router.post('/hooks/gitlab', async (request) => {
        const id = request.headers.get('x-gitlab-event-uuid');
        const event = request.headers.get('x-gitlab-event');
        const payloadString = await request.text();
        const payload = JSON.parse(payloadString);

        logger.debug('received webhook event', { id, event });

        /**
         * Handle Webhook events
         */
        if (event === 'Push Hook') {
            await handlePushEvent(context, payload);
        } else if (event === 'Merge Request Hook') {
            await handleMergeRequestEvent(context, payload);
        } else {
            logger.debug('ignoring webhook event', { id, event });
        }

        return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    });

    /**
     * API to fetch all GitLab projects under current authentication
     */
    router.get('/projects', async () => {
        const projects = await fetchProjects(getSpaceConfig(context));

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

        const branches = projectId
            ? await fetchProjectBranches(getSpaceConfig(context), projectId)
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

    try {
        const spaceInstallationConfiguration = getSpaceConfig(context);
        await triggerExport(context, spaceInstallationConfiguration);
    } catch (error) {
        logger.debug(`missing space installation configuration, skipping`);
        return;
    }
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

    try {
        const spaceInstallationConfiguration = getSpaceConfig(context);
        await updateCommitWithPreviewLinks(
            context,
            event.spaceId,
            event.revisionId,
            spaceInstallationConfiguration,
            event.commitId,
            GitSyncOperationState.Running
        );
    } catch (error) {
        logger.debug(`missing space installation configuration, skipping`);
        return;
    }
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

    try {
        const spaceInstallationConfiguration = getSpaceConfig(context);
        await updateCommitWithPreviewLinks(
            context,
            event.spaceId,
            event.revisionId,
            spaceInstallationConfiguration,
            event.commitId,
            event.state as GitSyncOperationState
        );
    } catch (error) {
        logger.debug(`missing space installation configuration, skipping`);
        return;
    }
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
