import { Router } from 'itty-router';

import { ContentKitIcon, ContentKitSelectOption } from '@gitbook/api';
import {
    createIntegration,
    createComponent,
    FetchEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
    createOAuthHandler,
} from '@gitbook/runtime';

export interface GithubInstallationConfiguration {
    oauth_credentials?: {
        access_token?: string;
    };
}

export type GithubRuntimeEnvironment = RuntimeEnvironment<{}, GithubInstallationConfiguration>;
export type GithubRuntimeContext = RuntimeContext<GithubRuntimeEnvironment>;

const handleFetchEvent: FetchEventCallback<GithubRuntimeContext> = async (request, context) => {
    const { environment } = context;

    const router = Router({
        base: new URL(
            environment.spaceInstallation?.urls?.publicEndpoint ||
                environment.installation?.urls.publicEndpoint ||
                environment.integration.urls.publicEndpoint
        ).pathname,
    });

    /*
     * Authenticate the user using OAuth.
     */
    router.get(
        '/oauth',
        createOAuthHandler({
            redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
            clientId: 'Iv1.dda2d2ac7939fdb4',
            clientSecret: 'af82594f749178af80b1282128ea6f360bb01701',
            authorizeURL: 'https://github.com/login/oauth/authorize',
            accessTokenURL: 'https://github.com/login/oauth/access_token',
            scopes: [],
            prompt: 'consent',
        })
    );

    router.get('/accounts', async () => {
        const accounts = await fetchAccounts(context);

        return new Response(JSON.stringify(accounts), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });

    router.get('/repos', async (req) => {
        const { account } = req.query;
        const accountId =
            account && typeof account === 'string' ? account.split(':')[0] : undefined;

        const repositories = accountId ? await fetchRepositories(accountId, context) : [];

        return new Response(JSON.stringify(repositories), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });

    router.get('/branches', async (req) => {
        const { account, repository } = req.query;

        const accountName =
            account && typeof account === 'string' ? account.split(':')[1] : undefined;
        const repositoryName =
            repository && typeof repository === 'string' ? repository.split(':')[1] : undefined;

        const branches =
            accountName && repositoryName
                ? await fetchBranches(accountName, repositoryName, context)
                : [];

        return new Response(JSON.stringify(branches), {
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

type ConfigAction =
    | { action: '@select.account' }
    | { action: '@select.repository' }
    | { action: '@select.branch' }
    | { action: '@toggle.customTemplate' }
    | { action: '@preview.commitMessage' }
    | { action: '@save' };

type Props = {
    configuration: {
        account?: string;
        repository?: string;
        branch?: string;
        projectDirectory?: string;
        commitMessageTemplate?: string;
        previewExternalBranches?: boolean;
        priority: 'github' | 'gitbook';
    };
};

type State = Props['configuration'] & {
    withCustomTemplate?: boolean;
    commitMessagePreview?: string;
};

const configBlock = createComponent<Props, State, ConfigAction, GithubRuntimeContext>({
    componentId: '$configure',
    initialState: (props) => {
        return {
            account: props.configuration.account,
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
            case '@select.account':
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
                return element;
        }
    },
    render: async (element, context) => {
        const accessToken =
            context.environment.spaceInstallation?.configuration.oauth_credentials?.access_token;
        const buttonLabel = accessToken ? 'Connected' : 'Connect with GitHub';

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
                                        state="account"
                                        onValueChange={{
                                            action: '@select.account',
                                        }}
                                        options={{
                                            url: {
                                                host: new URL(
                                                    context.environment.spaceInstallation?.urls.publicEndpoint!
                                                ).host,
                                                pathname: `${
                                                    new URL(
                                                        context.environment.spaceInstallation?.urls.publicEndpoint!
                                                    ).pathname
                                                }/accounts`,
                                            },
                                        }}
                                    />
                                }
                            />

                            {element.state.account ? (
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
                                                            context.environment.spaceInstallation?.urls.publicEndpoint!
                                                        ).host,
                                                        pathname: `${
                                                            new URL(
                                                                context.environment.spaceInstallation?.urls.publicEndpoint!
                                                            ).pathname
                                                        }/repos`,
                                                        query: {
                                                            account:
                                                                element.dynamicState('account'),
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
                                                            context.environment.spaceInstallation?.urls.publicEndpoint!
                                                        ).host,
                                                        pathname: `${
                                                            new URL(
                                                                context.environment.spaceInstallation?.urls.publicEndpoint!
                                                            ).pathname
                                                        }/branches`,
                                                        query: {
                                                            account:
                                                                element.dynamicState('account'),
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
                                        <vstack>
                                            <text style="hint">
                                                Hint: you can use the{' '}
                                                <text style="code">{'{change_request_number'}</text>{' '}
                                                and{' '}
                                                <text style="code">
                                                    {'{change_request_subject}'}
                                                </text>{' '}
                                                placeholders.
                                            </text>
                                            <text style="hint">
                                                <text style="bold">
                                                    Preview:{' '}
                                                    <text style="code">
                                                        {element.state.commitMessagePreview}
                                                    </text>
                                                </text>
                                            </text>
                                        </vstack>
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
                                <text style="hint">
                                    Which content should be used for{' '}
                                    <text style="bold">first synchronization?</text>
                                </text>

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

const GITSYNC_DEFAULT_COMMIT_MESSAGE = 'GITBOOK-{change_request_number}: {change_request_subject}';

function getGitSyncCommitMessage(
    templateInput: string | undefined,
    context: {
        change_request_number: number;
        change_request_subject: string;
    }
): string {
    const usingCustomTemplate = !!templateInput;
    const template = usingCustomTemplate ? templateInput : GITSYNC_DEFAULT_COMMIT_MESSAGE;
    const subject =
        context.change_request_subject ||
        (usingCustomTemplate ? 'No subject' : 'change request with no subject merged in GitBook');

    return template
        .replace('{change_request_number}', String(context.change_request_number || ''))
        .replace('{change_request_subject}', subject);
}

async function fetchAccounts(
    context: GithubRuntimeContext
): Promise<Array<ContentKitSelectOption>> {
    const accessToken =
        context.environment.spaceInstallation?.configuration?.oauth_credentials?.access_token;

    if (!accessToken) {
        return [];
    }

    const data = await fetch('https://api.github.com/user/installations', {
        headers: {
            Accept: 'application/json',
            'User-Agent': 'GitHub-Integration-Worker',
            Authorization: `Bearer ${accessToken}`,
        },
    }).then((res) => res.json());

    return data.installations.map((installation) => ({
        id: `${installation.id}:${installation.account.login}`,
        label: installation.account.login,
    }));
}

async function fetchRepositories(
    account: string,
    context: GithubRuntimeContext
): Promise<Array<ContentKitSelectOption>> {
    const accessToken =
        context.environment.spaceInstallation?.configuration.oauth_credentials?.access_token;

    if (!accessToken) {
        return [];
    }

    const res = await fetch(`https://api.github.com/user/installations/${account}/repositories`, {
        headers: {
            Accept: 'application/json',
            'User-Agent': 'GitHub-Integration-Worker',
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        return [];
    }

    const data = await res.json();
    return data.repositories.map((repository) => ({
        id: `${repository.id}:${repository.name}`,
        label: repository.name,
    }));
}

async function fetchBranches(
    accountName: string,
    repositoryName: string,
    context: GithubRuntimeContext
): Promise<Array<ContentKitSelectOption>> {
    const accessToken =
        context.environment.spaceInstallation?.configuration.oauth_credentials?.access_token;

    if (!accessToken) {
        return [];
    }

    const data = await fetch(
        `https://api.github.com/repos/${accountName}/${repositoryName}/branches`,
        {
            headers: {
                Accept: 'application/json',
                'User-Agent': 'GitHub-Integration-Worker',
                Authorization: `Bearer ${accessToken}`,
            },
        }
    ).then((res) => res.json());

    return data.map((branch) => ({
        id: branch.name,
        label: branch.name,
    }));
}

export default createIntegration({
    fetch: handleFetchEvent,
    components: [configBlock],
    events: {},
});
