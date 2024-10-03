import { Router, error, StatusError } from 'itty-router';

import { ContentKitIcon, ContentKitSelectOption, GitSyncOperationState } from '@gitbook/api';
import {
    createIntegration,
    FetchEventCallback,
    createOAuthHandler,
    Logger,
    EventCallback,
} from '@gitbook/runtime';

import {
    createAppInstallationAccessToken,
    fetchInstallationRepositories,
    fetchInstallations,
    fetchRepository,
    fetchRepositoryBranches,
    getAppInstallation,
    searchRepositories,
} from './api';
import { configBlock } from './components';
import { getGitHubAppJWT } from './provider';
import { triggerExport, updateCommitWithPreviewLinks } from './sync';
import { handleIntegrationTask } from './tasks';
import type { GithubRuntimeContext, IntegrationTask } from './types';
import { arrayToHex, BRANCH_REF_PREFIX, safeCompare } from './utils';
import { handlePullRequestEvents, handlePushEvent, verifyGitHubWebhookSignature } from './webhooks';

const logger = Logger('github');

const handleFetchEvent: FetchEventCallback<GithubRuntimeContext> = async (request, context) => {
    const { environment } = context;

    const router = Router({
        base: new URL(
            environment.spaceInstallation?.urls?.publicEndpoint ||
                environment.installation?.urls.publicEndpoint ||
                environment.integration.urls.publicEndpoint,
        ).pathname,
    });

    async function verifyIntegrationSignature(
        payload: string,
        signature: string,
        secret: string,
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

    /**
     * Handle integration tasks
     */
    router.post('/tasks', async (request) => {
        const signature = request.headers.get('x-gitbook-integration-signature') ?? '';
        const payloadString = await request.text();

        const verified = await verifyIntegrationSignature(
            payloadString,
            signature,
            environment.signingSecrets.integration,
        );

        if (!verified) {
            const message = `Invalid signature for integration task`;
            logger.error(message);
            throw new StatusError(400, message);
        }

        const { task } = JSON.parse(payloadString) as { task: IntegrationTask };
        logger.debug('verified & received integration task', task);

        context.waitUntil(
            (async () => {
                await handleIntegrationTask(context, task);
            })(),
        );

        return new Response(JSON.stringify({ acknowledged: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    });

    /**
     * Handle GitHub App webhook events
     */
    router.post('/hooks/github', async (request) => {
        const id = request.headers.get('x-github-delivery') as string;
        const event = request.headers.get('x-github-event') as string;
        const signature = request.headers.get('x-hub-signature-256') ?? '';
        const payloadString = await request.text();
        const payload = JSON.parse(payloadString);

        // Verify webhook signature
        try {
            await verifyGitHubWebhookSignature(
                payloadString,
                signature,
                environment.secrets.WEBHOOK_SECRET,
            );
        } catch (error: any) {
            logger.error(`Error verifying signature ${error}`);
            throw new StatusError(400, error.message);
        }

        logger.debug('received webhook event', { id, event });

        context.waitUntil(
            (async () => {
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
            })(),
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
            },
        ),
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
            }),
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
        const { installation: queryInstallation, selectedRepo, q, page } = req.query;
        const installationId =
            queryInstallation && typeof queryInstallation === 'string'
                ? parseInt(queryInstallation, 10)
                : undefined;
        const querySelectedRepo =
            selectedRepo && typeof selectedRepo === 'string' ? selectedRepo : undefined;
        const pageNumber = page && typeof page === 'string' ? parseInt(page, 10) : undefined;
        const queryRepo = q && typeof q === 'string' ? q : undefined;

        if (installationId) {
            const selected: ContentKitSelectOption[] = [];

            if (querySelectedRepo) {
                try {
                    const selectedRepo = await fetchRepository(
                        context,
                        parseInt(querySelectedRepo, 10),
                    );

                    selected.push({
                        id: `${selectedRepo.id}`,
                        label: selectedRepo.name,
                        icon:
                            selectedRepo.visibility === 'private' ? ContentKitIcon.Lock : undefined,
                    });
                } catch (error) {
                    // Ignore error: repository not found or not accessible
                }
            }

            if (queryRepo) {
                const appJWT = await getGitHubAppJWT(context);
                const installation = await getAppInstallation(context, appJWT, installationId);
                const installationToken = await createAppInstallationAccessToken(
                    context,
                    appJWT,
                    installationId,
                );

                try {
                    const q = `${queryRepo} in:name ${
                        installation.account.type === 'Organization' ? 'org' : 'user'
                    }:${installation.account.login} fork:true`;

                    logger.debug(
                        `Searching for repos matching ${q} for installation ${installationId}`,
                    );

                    const searchedRepos = await searchRepositories(context, q, {
                        page: 1,
                        per_page: 100,
                        tokenCredentials: {
                            access_token: installationToken,
                            expires_at: 0,
                        },
                        walkPagination: false,
                    });

                    const items = searchedRepos.map(
                        (repository): ContentKitSelectOption => ({
                            id: `${repository.id}`,
                            label: repository.name,
                            icon:
                                repository.visibility === 'private'
                                    ? ContentKitIcon.Lock
                                    : undefined,
                        }),
                    );

                    return new Response(JSON.stringify({ items, selected }), {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                } catch (error) {
                    // Ignore error: repository not found or not accessible
                }
            } else {
                const page = pageNumber || 1;
                const repositories = await fetchInstallationRepositories(context, installationId, {
                    page,
                    per_page: 100,
                    walkPagination: false,
                });

                const items = repositories.map(
                    (repository): ContentKitSelectOption => ({
                        id: `${repository.id}`,
                        label: repository.name,
                        icon: repository.visibility === 'private' ? ContentKitIcon.Lock : undefined,
                    }),
                );

                const nextPage = new URL(request.url);
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
                    },
                );
            }
        }

        return new Response(JSON.stringify([]), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });

    /**
     * API to fetch all branches of an account's repository
     */
    router.get('/branches', async (req) => {
        const { repository: queryRepository, selectedBranch } = req.query;

        const repositoryId =
            queryRepository && typeof queryRepository === 'string'
                ? parseInt(queryRepository, 10)
                : undefined;
        const querySelectedBranch =
            selectedBranch && typeof selectedBranch === 'string' ? selectedBranch : undefined;

        const branches = repositoryId ? await fetchRepositoryBranches(context, repositoryId) : [];

        const data = branches.map(
            (branch): ContentKitSelectOption => ({
                id: `refs/heads/${branch.name}`,
                label: branch.name,
                icon: branch.protected ? ContentKitIcon.Lock : undefined,
            }),
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

    const response = (await router.handle(request, context).catch((err) => {
        logger.error(`error handling request ${err.message} ${err.stack}`);
        return error(err);
    })) as Response | undefined;

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
        event.revisionId,
    );
    if (revision.git?.oid) {
        const revisionStatus = revision.git.createdByGitBook ? 'exported' : 'imported';
        logger.info(
            `skipping Git Sync for space ${event.spaceId} revision ${revision.id} as it was already ${revisionStatus}`,
        );
        return;
    }

    const spaceInstallation = context.environment.spaceInstallation;
    if (!spaceInstallation) {
        logger.debug(`missing space installation for ${event.spaceId}, skipping`);
        return;
    }

    if (!spaceInstallation.configuration.key) {
        logger.debug(`space ${event.spaceId} is not configured, skipping`);
        return;
    }

    await triggerExport(context, spaceInstallation, {
        eventTimestamp: new Date(revision.createdAt),
    });
};

/*
 * Handle git sync started: Update commit status
 */
const handleGitSyncStarted: EventCallback<'space_gitsync_started', GithubRuntimeContext> = async (
    event,
    context,
) => {
    logger.info(
        `Git Sync started for space ${event.spaceId} revision ${event.revisionId}, updating commit status`,
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
        GitSyncOperationState.Running,
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
        `Git Sync completed (${event.state}) for space ${event.spaceId} revision ${event.revisionId}, updating commit status`,
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
        event.state as GitSyncOperationState,
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
