import hash from 'hash-sum';

import { ContentKitIcon } from '@gitbook/api';
import { createComponent } from '@gitbook/runtime';

import { parseOAuthCredentials } from './api';
import { ConfigureAction, ConfigureProps, ConfigureState, GitLabRuntimeContext } from './types';
import { getGitSyncCommitMessage, GITSYNC_DEFAULT_COMMIT_MESSAGE } from './utils';

/**
 * ContentKit component to configure the GitLab integration.
 */
export const configBlock = createComponent<
    ConfigureProps,
    ConfigureState,
    ConfigureAction,
    GitLabRuntimeContext
>({
    componentId: 'configure',
    initialState: (props) => {
        return {
            project: props.spaceInstallation.configuration?.project,
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
            priority: props.spaceInstallation.configuration?.priority || 'gitlab',
        };
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'select.project':
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
                // await saveSpaceConfiguration(context, element.state);
                return element;
        }
    },
    render: async (element, context) => {
        const spaceInstallationPublicEndpoint =
            context.environment.spaceInstallation?.urls.publicEndpoint;
        if (!spaceInstallationPublicEndpoint) {
            throw new Error('Expected space installation public endpoint');
        }

        /**
         * The version hash will be used to invalidate the cache of the select components
         * on the frontend when the input props to the component change.
         */
        const versionHash = hash(element.props);

        let accessToken: string | undefined;
        try {
            const tokenCredentials = parseOAuthCredentials(context);
            accessToken = tokenCredentials.token;
        } catch (error) {
            // Ignore: We will show the button to connect
        }
        const buttonLabel = accessToken ? 'Connected' : 'Connect with GitLab';

        return (
            <block>
                <input
                    label="Authenticate"
                    hint="Connect your GitLab account to start set up"
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

                        <markdown content="### Project" />

                        <vstack>
                            <input
                                label="Select project"
                                hint="Select the GitLab project to sync this space with"
                                element={
                                    <select
                                        state="project"
                                        onValueChange={{
                                            action: '@select.project',
                                        }}
                                        options={{
                                            url: {
                                                host: new URL(spaceInstallationPublicEndpoint).host,
                                                pathname: `${
                                                    new URL(spaceInstallationPublicEndpoint)
                                                        .pathname
                                                }/projects`,
                                                query: {
                                                    v: versionHash,
                                                },
                                            },
                                        }}
                                    />
                                }
                            />

                            {element.state.project ? (
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
                                                            project:
                                                                element.dynamicState('project'),
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
                                        label="GitLab to GitBook"
                                        hint="I write my content on GitLab. Content will be imported and replace the space content."
                                        element={<radio state="priority" value="gitlab" />}
                                    />
                                </card>
                                <card>
                                    <input
                                        label="GitBook to GitLab"
                                        hint="I write my content on GitBook. Content on GitLab will be replaced with the space content."
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
                                                !element.state.project || !element.state.branch
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
