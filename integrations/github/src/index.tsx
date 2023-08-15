import { Router } from 'itty-router';

import { ContentKitIcon, ContentKitSelectOption } from '@gitbook/api';
import {
    createIntegration,
    createComponent,
    FetchEventCallback,
    createOAuthHandler,
    Logger,
    EventCallback,
} from '@gitbook/runtime';

import {
    fetchInstallationRepositories,
    fetchInstallations,
    fetchRepositoryBranches,
    saveSpaceConfiguration,
} from './api';
import { getGitHubApp, triggerExport } from './provider';
import type {
    GithubRuntimeContext,
    ConfigureProps,
    ConfigureAction,
    ConfigureState,
} from './types';
import { GITSYNC_DEFAULT_COMMIT_MESSAGE, getGitSyncCommitMessage } from './utils';
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
                ? installation.split(':')[0]
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
                ? installation.split(':')[1]
                : undefined;
        const repositoryName =
            repository && typeof repository === 'string' ? repository.split(':')[1] : undefined;

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

    const response = await router.handle(request, context);

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
        logger.debug(`missing space installation configuration, skipping Git Sync`);
        return;
    }

    await triggerExport(context, context.environment.spaceInstallation.configuration);
};

const configBlock = createComponent<
    ConfigureProps,
    ConfigureState,
    ConfigureAction,
    GithubRuntimeContext
>({
    componentId: 'configure',
    initialState: (props) => {
        return {
            installation: props.configuration.installation,
            repository: props.configuration.repository,
            branch: props.configuration.branch,
            projectDirectory: props.configuration.projectDirectory,
            withCustomTemplate: Boolean(
                props.configuration.commitMessageTemplate &&
                    props.configuration.commitMessageTemplate.length > 0 &&
                    props.configuration.commitMessageTemplate !== GITSYNC_DEFAULT_COMMIT_MESSAGE
            ),
            commitMessageTemplate:
                props.configuration.commitMessageTemplate || GITSYNC_DEFAULT_COMMIT_MESSAGE,
            commitMessagePreview: '',
            previewExternalBranches: props.configuration.previewExternalBranches,
            priority: props.configuration.priority || 'github',
        };
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case '@select.installation':
                return element;
            case '@select.repository':
                return element;
            case '@select.branch':
                return element;
            case '@toggle.customTemplate':
                return {
                    ...element,
                    state: {
                        ...element.state,
                        commitMessagePreview: element.state.withCustomTemplate
                            ? getGitSyncCommitMessage(element.state.commitMessageTemplate, {
                                  change_request_number: 123,
                                  change_request_subject: 'Fix documentation for /user/me',
                              })
                            : undefined,
                    },
                };
            case '@preview.commitMessage':
                return {
                    ...element,
                    state: {
                        ...element.state,
                        commitMessagePreview: getGitSyncCommitMessage(
                            element.state.commitMessageTemplate,
                            {
                                change_request_number: 123,
                                change_request_subject: 'Fix documentation for /user/me',
                            }
                        ),
                    },
                };
            case '@save':
                await saveSpaceConfiguration(context, element.props.configuration, element.state);
                return element;
        }
    },
    render: async (element, context) => {
        const accessToken =
            context.environment.spaceInstallation?.configuration.oauth_credentials?.access_token;
        const buttonLabel = accessToken ? 'Connected' : 'Connect with GitHub';

        const spaceInstallationPublicEndpoint =
            context.environment.spaceInstallation?.urls.publicEndpoint;
        if (!spaceInstallationPublicEndpoint) {
            throw new Error('Missing space installation public endpoint');
        }

        return (
            <block>
                <input
                    label="Authenticate"
                    hint="Connect your GitHub account to start set up"
                    element={
                        <button
                            label={buttonLabel}
                            icon={ContentKitIcon.Github}
                            tooltip={buttonLabel}
                            onPress={{
                                action: '@ui.url.open',
                                url: `${context.environment.spaceInstallation?.urls.publicEndpoint}/oauth`,
                            }}
                        />
                    }
                />

                {accessToken ? (
                    <>
                        <divider size="medium" />

                        <markdown content="### Account" />

                        <vstack>
                            <input
                                label="Select account"
                                hint="Choose the GitHub installation, user or organization."
                                element={
                                    <select
                                        state="installation"
                                        onValueChange={{
                                            action: '@select.installation',
                                        }}
                                        options={{
                                            url: {
                                                host: new URL(spaceInstallationPublicEndpoint).host,
                                                pathname: `${
                                                    new URL(spaceInstallationPublicEndpoint)
                                                        .pathname
                                                }/installations`,
                                            },
                                        }}
                                    />
                                }
                            />

                            {element.state.installation ? (
                                <>
                                    <input
                                        label="Select repository"
                                        hint="Choose the GitHub repository to sync this space with."
                                        element={
                                            <select
                                                state="repository"
                                                onValueChange={{
                                                    action: '@select.repository',
                                                }}
                                                options={{
                                                    url: {
                                                        host: new URL(
                                                            spaceInstallationPublicEndpoint
                                                        ).host,
                                                        pathname: `${
                                                            new URL(spaceInstallationPublicEndpoint)
                                                                .pathname
                                                        }/repos`,
                                                        query: {
                                                            installation:
                                                                element.dynamicState(
                                                                    'installation'
                                                                ),
                                                        },
                                                    },
                                                }}
                                            />
                                        }
                                    />
                                </>
                            ) : null}
                            {element.state.repository ? (
                                <>
                                    <input
                                        label="Select branch"
                                        hint="Choose a Git branch to sync your content with. If the branch doesn't exist it'd be created during the sync."
                                        element={
                                            <select
                                                state="branch"
                                                onValueChange={{
                                                    action: '@select.branch',
                                                }}
                                                options={{
                                                    url: {
                                                        host: new URL(
                                                            spaceInstallationPublicEndpoint
                                                        ).host,
                                                        pathname: `${
                                                            new URL(spaceInstallationPublicEndpoint)
                                                                .pathname
                                                        }/branches`,
                                                        query: {
                                                            installation:
                                                                element.dynamicState(
                                                                    'installation'
                                                                ),
                                                            repository:
                                                                element.dynamicState('repository'),
                                                        },
                                                    },
                                                }}
                                            />
                                        }
                                    />
                                </>
                            ) : null}
                        </vstack>
                        {element.state.branch ? (
                            <>
                                <divider size="medium" />

                                <markdown content="### Monorepo" />
                                <input
                                    label="Project directory"
                                    hint="Optional directory of the project to sync with this space in your repository."
                                    element={
                                        <textinput state="projectDirectory" placeholder="./" />
                                    }
                                />

                                <divider size="medium" />

                                <markdown content="### Commit messages" />
                                <input
                                    label="Use a custom template"
                                    hint="Replace the commit message formatting used during export from GitBook by a custom template."
                                    element={
                                        <switch
                                            state="withCustomTemplate"
                                            onValueChange={{
                                                action: '@toggle.customTemplate',
                                            }}
                                        />
                                    }
                                />
                                {element.state.withCustomTemplate ? (
                                    <>
                                        <hstack>
                                            <box grow={1}>
                                                <textinput
                                                    state="commitMessageTemplate"
                                                    placeholder={GITSYNC_DEFAULT_COMMIT_MESSAGE}
                                                />
                                            </box>
                                            <button
                                                style="secondary"
                                                tooltip="Preview commit message"
                                                icon={ContentKitIcon.Eye}
                                                label=""
                                                onPress={{
                                                    action: '@preview.commitMessage',
                                                }}
                                            />
                                        </hstack>
                                        {element.state.commitMessagePreview ? (
                                            <vstack>
                                                <hint>
                                                    <text>
                                                        Hint: you can use the{' '}
                                                        <text style="code">
                                                            {'{change_request_number'}
                                                        </text>{' '}
                                                        and{' '}
                                                        <text style="code">
                                                            {'{change_request_subject}'}
                                                        </text>{' '}
                                                        placeholders.
                                                    </text>
                                                </hint>
                                                <hint>
                                                    <text>
                                                        <text style="bold">
                                                            Preview:{' '}
                                                            <text style="code">
                                                                {element.state.commitMessagePreview}
                                                            </text>
                                                        </text>
                                                    </text>
                                                </hint>
                                            </vstack>
                                        ) : null}
                                    </>
                                ) : null}

                                <divider size="medium" />

                                <markdown content="### Forks" />
                                <input
                                    label="Pull request preview"
                                    hint="Allow Pull request previews from forked respositories."
                                    element={<switch state="previewExternalBranches" />}
                                />

                                <divider size="large" />

                                <markdown content={`### Initial sync`} />

                                <hint>
                                    <text>
                                        Which content should be used for{' '}
                                        <text style="bold">first synchronization?</text>
                                    </text>
                                </hint>

                                <card>
                                    <input
                                        label="GitHub to GitBook"
                                        hint="I write my content on GitHub. Content will be imported and replace the space content."
                                        element={<radio state="priority" value="github" />}
                                    />
                                </card>
                                <card>
                                    <input
                                        label="GitBook to GitHub"
                                        hint="I write my content on GitBook. Content on GitHub will be replaced with the space content."
                                        element={<radio state="priority" value="gitbook" />}
                                    />
                                </card>

                                <input
                                    label=""
                                    hint=""
                                    element={
                                        <button
                                            style="primary"
                                            label="Save"
                                            tooltip="Save configuration"
                                            onPress={{ action: '@save' }}
                                        />
                                    }
                                />
                            </>
                        ) : null}
                    </>
                ) : null}
            </block>
        );
    },
});

export default createIntegration({
    fetch: handleFetchEvent,
    components: [configBlock],
    events: { space_content_updated: handleSpaceContentUpdated },
});
