import createHttpError from 'http-errors';
import { Router } from 'itty-router';

import { ContentKitIcon, ContentKitSelectOption, GitSyncOperationState } from '@gitbook/api';
import { createIntegration, FetchEventCallback, Logger, EventCallback } from '@gitbook/runtime';

import { fetchProject, fetchProjectBranches, fetchProjects, searchUserProjects } from './api';
import { configBlock } from './components';
import { uninstallWebhook } from './provider';
import { triggerExport, updateCommitWithPreviewLinks } from './sync';
import type { GitLabRuntimeContext, GitLabSpaceConfiguration } from './types';
import {
    getSpaceConfigOrThrow,
    assertIsDefined,
    verifySignature,
    BRANCH_REF_PREFIX,
} from './utils';
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
     * Webhook endpoint for GitLab events
     */
    router.post('/hooks/gitlab', async (request) => {
        const event = request.headers.get('x-gitlab-event') as string;
        const eventUuid = request.headers.get('x-gitlab-event-uuid') as string;
        const webhookUuid = request.headers.get('x-gitlab-webhook-uuid') as string;
        const signature = request.headers.get('x-gitlab-token');
        const payloadString = await request.text();
        const payload = JSON.parse(payloadString);

        // Verify the webhook signature if a secret token is configured
        if (signature) {
            try {
                const valid = await verifySignature(
                    environment.integration.name,
                    signature,
                    environment.signingSecret!
                );
                if (!valid) {
                    throw createHttpError(400, 'Invalid signature for webhook event');
                }
            } catch (error: any) {
                return new Response(JSON.stringify({ error: error.message }), {
                    status: 400,
                    headers: { 'content-type': 'application/json' },
                });
            }
        }

        logger.debug('received webhook event', { eventUuid, webhookUuid, event });

        context.waitUntil(
            (async () => {
                if (event === 'Push Hook') {
                    await handlePushEvent(context, payload);
                } else if (event === 'Merge Request Hook') {
                    await handleMergeRequestEvent(context, payload);
                } else {
                    logger.debug('ignoring task for webhook event', { eventUuid, event });
                }
            })()
        );

        // Acknowledge the webhook event: https://docs.gitlab.com/ee/user/gitlab_com/index.html#other-limits
        logger.debug('acknowledging webhook event', { eventUuid, webhookUuid, event });
        return new Response(JSON.stringify({ acknowledged: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    });

    /**
     * API to fetch all GitLab projects under current authentication
     */
    router.get('/projects', async (req) => {
        const { selectedProject, q, page } = req.query;
        const querySelectedProject =
            selectedProject && typeof selectedProject === 'string' ? selectedProject : undefined;
        const pageNumber = page && typeof page === 'string' ? parseInt(page, 10) : undefined;
        const queryProject = q && typeof q === 'string' ? q : undefined;

        const spaceInstallation = environment.spaceInstallation;
        assertIsDefined(spaceInstallation, { label: 'spaceInstallation' });
        const spaceConfig = getSpaceConfigOrThrow(spaceInstallation);

        const selected: ContentKitSelectOption[] = [];

        if (querySelectedProject) {
            try {
                const selectedProject = await fetchProject(
                    spaceConfig,
                    parseInt(querySelectedProject, 10)
                );

                selected.push({
                    id: `${selectedProject.id}`,
                    label: selectedProject.path_with_namespace,
                    icon: selectedProject.visibility === 'public' ? undefined : ContentKitIcon.Lock,
                });
            } catch (error) {
                // Ignore error: repository not found or not accessible
            }
        }

        if (queryProject) {
            const q = encodeURIComponent(queryProject);
            const searchedProjects = await searchUserProjects(spaceConfig, q, {
                page: 1,
                per_page: 100,
                walkPagination: false,
            });

            const items = searchedProjects.map(
                (project): ContentKitSelectOption => ({
                    id: `${project.id}`,
                    label: project.path_with_namespace,
                    icon: project.visibility === 'public' ? undefined : ContentKitIcon.Lock,
                })
            );

            return new Response(JSON.stringify({ items, selected }), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } else {
            const page = pageNumber || 1;
            const projects = await fetchProjects(spaceConfig, {
                page,
                per_page: 100,
                walkPagination: false,
            });

            const items = projects.map(
                (project): ContentKitSelectOption => ({
                    id: `${project.id}`,
                    label: project.path_with_namespace,
                    icon: project.visibility === 'public' ? undefined : ContentKitIcon.Lock,
                })
            );

            const nextPage = new URL(req.url);
            nextPage.searchParams.set('page', `${page + 1}`);

            return new Response(
                JSON.stringify({
                    items,
                    nextPage: nextPage.toString(),
                    selected,
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }
    });

    /**
     * API to fetch all branches of a project's repository
     */
    router.get('/branches', async (req) => {
        const { project: queryProject, selectedBranch } = req.query;

        const spaceInstallation = environment.spaceInstallation;
        assertIsDefined(spaceInstallation, { label: 'spaceInstallation' });

        const config = getSpaceConfigOrThrow(spaceInstallation);

        const projectId =
            queryProject && typeof queryProject === 'string'
                ? parseInt(queryProject, 10)
                : undefined;
        const querySelectedBranch =
            selectedBranch && typeof selectedBranch === 'string' ? selectedBranch : undefined;

        const branches = projectId ? await fetchProjectBranches(config, projectId) : [];

        const data = branches.map(
            (branch): ContentKitSelectOption => ({
                id: `refs/heads/${branch.name}`,
                label: branch.name,
                icon: branch.protected ? ContentKitIcon.Lock : undefined,
            })
        );

        /**
         * When a branch is selected by typing its name, it might not be in the list of branches
         * returned by the API. In this case, we add it to the list of branches so that it can be
         * selected in the UI.
         */
        if (querySelectedBranch) {
            const hasSelectedBranch = data.some((branch) => branch.id === querySelectedBranch);
            if (!hasSelectedBranch) {
                data.push({
                    id: querySelectedBranch,
                    label: querySelectedBranch.replace(BRANCH_REF_PREFIX, ''),
                });
            }
        }

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

    await triggerExport(context, spaceInstallation, {
        eventTimestamp: new Date(revision.createdAt),
    });
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

    const configuration = event.previous.configuration as GitLabSpaceConfiguration | undefined;
    if (!configuration) {
        logger.debug(`missing space installation configuration, skipping`);
        return;
    }

    await uninstallWebhook(configuration);
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
