import { Router } from 'itty-router';

import { ContentKitIcon, ContentKitSelectOption, GitSyncOperationState } from '@gitbook/api';
import { createIntegration, FetchEventCallback, Logger, EventCallback } from '@gitbook/runtime';

import { fetchProjectBranches, fetchProjects } from './api';
import { configBlock } from './components';
import { uninstallWebhook } from './provider';
import { triggerExport, updateCommitWithPreviewLinks } from './sync';
import type { GitLabRuntimeContext } from './types';
import { getSpaceConfigOrThrow, assertIsDefined, parseProjectOrThow } from './utils';
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
     * Handle task for GitLab webhook events
     */
    router.post('/hooks/gitlab/task', async (request) => {
        const eventUuid = request.headers.get('x-gitlab-event-uuid');
        const event = request.headers.get('x-gitlab-event');
        const payloadString = await request.text();
        const payload = JSON.parse(payloadString);

        logger.debug('received task for webhook event', { eventUuid, event });

        // Event handling
        if (event === 'Push Hook') {
            await handlePushEvent(context, payload);
        } else if (event === 'Merge Request Hook') {
            await handleMergeRequestEvent(context, payload);
        } else {
            logger.debug('ignoring task for webhook event', { eventUuid, event });
        }

        return new Response(JSON.stringify({ handled: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    });

    /**
     * Acknowledge GitLab webhook event and queue a task to handle it
     * in a subsequent request. This is to avoid GitLab timeouts.
     * https://docs.gitlab.com/ee/user/gitlab_com/index.html#other-limits
     */
    router.post('/hooks/gitlab', async (request) => {
        const event = request.headers.get('x-gitlab-event') as string;
        const eventUuid = request.headers.get('x-gitlab-event-uuid') as string;
        const webhookUuid = request.headers.get('x-gitlab-webhook-uuid') as string;
        const token = request.headers.get('x-gitlab-token') as string;
        const instance = request.headers.get('x-gitlab-instance') as string;

        logger.debug('acknowledging webhook event', { eventUuid, webhookUuid, event });

        const taskUrl = new URL(request.url);
        taskUrl.pathname += '/task';

        context.waitUntil(
            fetch(taskUrl.toString(), {
                method: 'POST',
                body: await request.text(),
                headers: {
                    'content-type': request.headers.get('content-type') || 'application/text',
                    'x-gitlab-event': event,
                    'x-gitlab-event-uuid': eventUuid,
                    'x-gitlab-webhook-uuid': webhookUuid,
                    'x-gitlab-token': token,
                    'x-gitlab-instance': instance,
                },
            })
        );

        return new Response(JSON.stringify({ acknowledged: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    });

    /**
     * API to fetch all GitLab projects under current authentication
     */
    router.get('/projects', async () => {
        const spaceInstallation = environment.spaceInstallation;
        assertIsDefined(spaceInstallation, { label: 'spaceInstallation' });

        const projects = await fetchProjects(getSpaceConfigOrThrow(spaceInstallation));

        const data = projects.map(
            (project): ContentKitSelectOption => ({
                id: `${project.id}`,
                label: project.path_with_namespace,
                icon: project.visibility === 'public' ? undefined : ContentKitIcon.Lock,
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
        const { project: queryProject } = req.query;

        const spaceInstallation = environment.spaceInstallation;
        assertIsDefined(spaceInstallation, { label: 'spaceInstallation' });

        const config = getSpaceConfigOrThrow(spaceInstallation);

        const projectId =
            queryProject && typeof queryProject === 'string'
                ? parseProjectOrThow(queryProject)
                : undefined;

        const branches = projectId ? await fetchProjectBranches(config, projectId) : [];

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
 * Handle content being updated: Trigger an export to GitLab
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
const handleGitSyncStarted: EventCallback<'space_gitsync_started', GitLabRuntimeContext> = async (
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
    GitLabRuntimeContext
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
 * Handle git sync completed: Update commit status
 */
const handleSpaceInstallationDeleted: EventCallback<
    'space_installation_deleted',
    GitLabRuntimeContext
> = async (event, context) => {
    logger.debug(`space installation deleted for space ${event.spaceId}, removing webhook`);

    const spaceInstallation = context.environment.spaceInstallation;
    if (!spaceInstallation) {
        logger.debug(`missing space installation, skipping`);
        return;
    }

    await uninstallWebhook(spaceInstallation);
};

export default createIntegration({
    fetch: handleFetchEvent,
    components: [configBlock],
    events: {
        space_content_updated: handleSpaceContentUpdated,
        space_gitsync_started: handleGitSyncStarted,
        space_gitsync_completed: handleGitSyncCompleted,
        space_installation_deleted: handleSpaceInstallationDeleted,
    },
});