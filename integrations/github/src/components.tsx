import { ContentKitIcon } from '@gitbook/api';
import { createComponent } from '@gitbook/runtime';

import { saveSpaceConfiguration } from './installation';
import { ConfigureAction, ConfigureProps, ConfigureState, GithubRuntimeContext } from './types';
import { getGitSyncCommitMessage, GITSYNC_DEFAULT_COMMIT_MESSAGE } from './utils';

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
            case 'save':
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
                                            disabled={
                                                !element.state.installation ||
                                                !element.state.repository ||
                                                !element.state.branch
                                            }
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
