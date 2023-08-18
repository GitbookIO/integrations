import hash from 'hash-sum';

import { ContentKitIcon } from '@gitbook/api';
import { createComponent } from '@gitbook/runtime';

import { getTokenCredentials } from './api';
import { saveSpaceConfiguration } from './installation';
import { ConfigureAction, ConfigureProps, ConfigureState, GithubRuntimeContext } from './types';
import {
    assertIsDefined,
    getGitSyncCommitMessage,
    getSpaceConfig,
    GITSYNC_DEFAULT_COMMIT_MESSAGE,
    parseInstallation,
} from './utils';

/**
 * ContentKit component to configure the GitHub integration.
 */
export const configBlock = createComponent<
    ConfigureProps,
    ConfigureState,
    ConfigureAction,
    GithubRuntimeContext
>({
    componentId: 'configure',
    initialState: (props) => {
        return {
            installation: props.spaceInstallation.configuration?.installation,
            repository: props.spaceInstallation.configuration?.repository,
            branch: props.spaceInstallation.configuration?.branch,
            projectDirectory: props.spaceInstallation.configuration?.projectDirectory,
            withCustomTemplate: Boolean(
                props.spaceInstallation.configuration?.commitMessageTemplate &&
                    props.spaceInstallation.configuration?.commitMessageTemplate.length > 0 &&
                    props.spaceInstallation.configuration?.commitMessageTemplate !==
                        GITSYNC_DEFAULT_COMMIT_MESSAGE
            ),
            commitMessageTemplate:
                props.spaceInstallation.configuration?.commitMessageTemplate ||
                GITSYNC_DEFAULT_COMMIT_MESSAGE,
            commitMessagePreview: '',
            previewExternalBranches: props.spaceInstallation.configuration?.previewExternalBranches,
            priority: props.spaceInstallation.configuration?.priority || 'github',
        };
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'select.installation':
                return element;
            case 'select.repository':
                return element;
            case 'select.branch':
                return element;
            case 'toggle.customTemplate':
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
            case 'preview.commitMessage':
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
            case 'save.config':
                await saveSpaceConfiguration(context, element.state);
                return element;
        }
    },
    render: async (element, context) => {
        const spaceInstallationPublicEndpoint =
            context.environment.spaceInstallation?.urls.publicEndpoint;
        assertIsDefined(spaceInstallationPublicEndpoint);

        let accessToken: string | undefined;
        try {
            const tokenCredentials = getTokenCredentials(getSpaceConfig(context));
            accessToken = tokenCredentials.token;
        } catch (error) {
            // Ignore: We will show the button to connect
        }
        const buttonLabel = accessToken ? 'Connected' : 'Connect with GitHub';

        /**
         * The version hash will be used to invalidate the cache of the select components
         * on the frontend when the input props to the component change.
         */
        const versionHash = hash(element.props);

        return (
            <block>
                <input
                    label="Authenticate"
                    hint="Connect your GitHub account"
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
                                hint={
                                    <text>
                                        Choose the GitHub installation, user or organization.
                                        <link
                                            target={{
                                                url: 'https://github.com/apps/gitbook-com/installations/new',
                                            }}
                                        >
                                            {' '}
                                            Install the GitHub app.
                                        </link>
                                    </text>
                                }
                                element={
                                    <select
                                        state="installation"
                                        onValueChange={{
                                            action: 'select.installation',
                                        }}
                                        options={{
                                            url: {
                                                host: new URL(spaceInstallationPublicEndpoint).host,
                                                pathname: `${
                                                    new URL(spaceInstallationPublicEndpoint)
                                                        .pathname
                                                }/installations`,
                                                query: {
                                                    v: versionHash,
                                                },
                                            },
                                        }}
                                    />
                                }
                            />

                            {element.state.installation ? (
                                <>
                                    <input
                                        label="Select repository"
                                        hint={
                                            <text>
                                                Choose the GitHub repository to sync this space
                                                with. This repository should be authorized in the{' '}
                                                <link
                                                    target={{
                                                        url: `https://github.com/settings/installations/${
                                                            parseInstallation(
                                                                element.state.installation
                                                            ).installationId
                                                        }`,
                                                    }}
                                                >
                                                    GitHub installation.
                                                </link>
                                            </text>
                                        }
                                        element={
                                            <select
                                                state="repository"
                                                onValueChange={{
                                                    action: 'select.repository',
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
                                                            v: versionHash,
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
                                                    action: 'select.branch',
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
                                                            v: versionHash,
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
                                    hint={
                                        <text>
                                            Optional directory of the project to sync with this
                                            space in your repository.{' '}
                                            <link
                                                target={{
                                                    url: 'https://docs.gitbook.com/getting-started/git-sync/monorepos',
                                                }}
                                            >
                                                Learn More.
                                            </link>
                                        </text>
                                    }
                                    element={
                                        <textinput state="projectDirectory" placeholder="./" />
                                    }
                                />

                                <divider size="medium" />

                                <markdown content="### Commit messages" />
                                <input
                                    label="Use a custom template"
                                    hint={
                                        <text>
                                            Replace the commit message formatting used during export
                                            from GitBook by a custom template.{' '}
                                            <link
                                                target={{
                                                    url: 'https://docs.gitbook.com/getting-started/git-sync/commits',
                                                }}
                                            >
                                                Learn More.
                                            </link>
                                        </text>
                                    }
                                    element={
                                        <switch
                                            state="withCustomTemplate"
                                            onValueChange={{
                                                action: 'toggle.customTemplate',
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
                                                    action: 'preview.commitMessage',
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
                                    hint={
                                        <text>
                                            Allow Pull request previews from forked respositories.{' '}
                                            <link
                                                target={{
                                                    url: 'https://docs.gitbook.com/integrations/git-sync/github-pull-request-preview#security-considerations',
                                                }}
                                            >
                                                Learn More.
                                            </link>
                                        </text>
                                    }
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
                                            disabled={
                                                !element.state.installation ||
                                                !element.state.repository ||
                                                !element.state.branch
                                            }
                                            label="Configure"
                                            tooltip="Save configuration"
                                            onPress={{ action: 'save.config' }}
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
