import hash from 'hash-sum';

import { ContentKitIcon } from '@gitbook/api';
import { createComponent } from '@gitbook/runtime';

import { getAccessTokenOrThrow, getCurrentUser } from './api';
import { saveSpaceConfiguration } from './installation';
import {
    GitlabConfigureAction,
    GitlabConfigureProps,
    GitlabConfigureState,
    GitLabRuntimeContext,
} from './types';
import {
    assertIsDefined,
    getGitSyncCommitMessage,
    getSpaceConfigOrThrow,
    GITSYNC_DEFAULT_COMMIT_MESSAGE,
    normalizeInstanceUrl,
} from './utils';

/**
 * ContentKit component to configure the GitLab integration.
 */
export const configBlock = createComponent<
    GitlabConfigureProps,
    GitlabConfigureState,
    GitlabConfigureAction,
    GitLabRuntimeContext
>({
    componentId: 'configure',
    initialState: (props) => {
        return {
            accessToken: props.spaceInstallation.configuration?.accessToken,
            withCustomInstanceUrl: Boolean(
                props.spaceInstallation.configuration?.customInstanceUrl &&
                    props.spaceInstallation.configuration?.customInstanceUrl.length > 0,
            ),
            customInstanceUrl: props.spaceInstallation.configuration?.customInstanceUrl,
            project: props.spaceInstallation.configuration?.project?.toString(),
            branch: props.spaceInstallation.configuration?.branch,
            projectDirectory: props.spaceInstallation.configuration?.projectDirectory,
            withCustomTemplate: Boolean(
                props.spaceInstallation.configuration?.commitMessageTemplate &&
                    props.spaceInstallation.configuration?.commitMessageTemplate.length > 0 &&
                    props.spaceInstallation.configuration?.commitMessageTemplate !==
                        GITSYNC_DEFAULT_COMMIT_MESSAGE,
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
            case 'save.token': {
                const spaceInstallation = context.environment.spaceInstallation;
                assertIsDefined(spaceInstallation, { label: 'spaceInstallation' });

                const config = {
                    ...spaceInstallation.configuration,
                    key: crypto.randomUUID(),
                    accessToken: action.token,
                    customInstanceUrl: action.customInstanceUrl
                        ? normalizeInstanceUrl(action.customInstanceUrl)
                        : undefined,
                };

                const glUser = await getCurrentUser(config);

                await context.api.integrations.updateIntegrationSpaceInstallation(
                    spaceInstallation.integration,
                    spaceInstallation.installation,
                    spaceInstallation.space,
                    {
                        configuration: {
                            ...config,
                            userId: glUser.id,
                        },
                    },
                );
                return element;
            }
            case 'select.project': {
                const spaceInstallation = context.environment.spaceInstallation;
                assertIsDefined(spaceInstallation, { label: 'spaceInstallation' });

                return {
                    ...element,
                    state: {
                        ...element.state,
                        project: action.project,
                    },
                };
            }
            case 'select.branch': {
                return {
                    ...element,
                    state: {
                        ...element.state,
                        branch: action.branch,
                    },
                };
            }
            case 'toggle.customInstanceUrl': {
                return {
                    ...element,
                    state: {
                        ...element.state,
                        withCustomInstanceUrl: action.withCustomInstanceUrl,
                    },
                };
            }

            case 'toggle.customTemplate': {
                const withCustomTemplate = action.withCustomTemplate;
                return {
                    ...element,
                    state: {
                        ...element.state,
                        withCustomTemplate,
                        commitMessagePreview: withCustomTemplate
                            ? getGitSyncCommitMessage(element.state.commitMessageTemplate, {
                                  change_request_number: 123,
                                  change_request_subject: 'Fix documentation for /user/me',
                              })
                            : undefined,
                    },
                };
            }

            case 'preview.commitMessage': {
                return {
                    ...element,
                    state: {
                        ...element.state,
                        commitMessagePreview: getGitSyncCommitMessage(
                            element.state.commitMessageTemplate,
                            {
                                change_request_number: 123,
                                change_request_subject: 'Fix documentation for /user/me',
                            },
                        ),
                    },
                };
            }

            case 'save.configuration': {
                await saveSpaceConfiguration(context, element.state);
                return { type: 'complete' };
            }
        }
    },
    render: async (element, context) => {
        const spaceInstallation = context.environment.spaceInstallation;
        assertIsDefined(spaceInstallation, {
            label: 'spaceInstallation',
        });
        const spaceInstallationPublicEndpoint = spaceInstallation.urls.publicEndpoint;

        let accessToken: string | undefined;
        try {
            accessToken = getAccessTokenOrThrow(getSpaceConfigOrThrow(spaceInstallation));
        } catch (error) {
            // Ignore: We will show the button to connect
        }

        /**
         * The version hash will be used to invalidate the cache of the select components
         * on the frontend when the input props to the component change.
         */
        const versionHash = hash(element.props);

        return (
            <configuration>
                <card>
                    <vstack>
                        <box grow={1}>
                            <input
                                label="GitLab access token"
                                hint={
                                    <text>
                                        The access token requires the{' '}
                                        <text style="bold">
                                            api, read_repository, write_repository
                                        </text>{' '}
                                        scope for the integration to work. You can create one at{' '}
                                        <link
                                            target={{
                                                url: 'https://gitlab.com/-/profile/personal_access_tokens',
                                            }}
                                        >
                                            User Settings → Access Tokens.
                                        </link>
                                    </text>
                                }
                                element={
                                    <textinput
                                        inputType="password"
                                        state="accessToken"
                                        placeholder="xxxxxxxxxxxxxxxxxxxx"
                                    />
                                }
                            />
                        </box>

                        <input
                            label="Custom GitLab URL"
                            hint="If your GitLab instance is self-hosted, enter its publicly accessible URL"
                            element={
                                <switch
                                    state="withCustomInstanceUrl"
                                    onValueChange={{
                                        action: 'toggle.customInstanceUrl',
                                        withCustomInstanceUrl:
                                            element.dynamicState('withCustomInstanceUrl'),
                                    }}
                                />
                            }
                        />
                        {element.state.withCustomInstanceUrl ? (
                            <box grow={1}>
                                <textinput
                                    state="customInstanceUrl"
                                    placeholder="https://gitlab.mycompany.com"
                                />
                            </box>
                        ) : null}

                        <box grow={1}>
                            <hstack align="end">
                                <button
                                    style="secondary"
                                    icon={ContentKitIcon.Gitlab}
                                    tooltip="Authenticate with GitLab"
                                    label="Authenticate"
                                    onPress={{
                                        action: 'save.token',
                                        token: element.dynamicState('accessToken'),
                                        customInstanceUrl:
                                            element.dynamicState('customInstanceUrl'),
                                    }}
                                />
                            </hstack>
                        </box>
                    </vstack>
                </card>

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
                                            action: 'select.project',
                                            project: element.dynamicState('project'),
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
                                                    selectedProject:
                                                        element.dynamicState('project'),
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
                                                acceptInput
                                                state="branch"
                                                onValueChange={{
                                                    action: 'select.branch',
                                                    branch: element.dynamicState('branch'),
                                                }}
                                                options={{
                                                    url: {
                                                        host: new URL(
                                                            spaceInstallationPublicEndpoint,
                                                        ).host,
                                                        pathname: `${
                                                            new URL(spaceInstallationPublicEndpoint)
                                                                .pathname
                                                        }/branches`,
                                                        query: {
                                                            project:
                                                                element.dynamicState('project'),
                                                            selectedBranch:
                                                                element.dynamicState('branch'),
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
                                                    url: 'https://gitbook.com/docs/getting-started/git-sync/monorepos',
                                                }}
                                            >
                                                Learn more.
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
                                                    url: 'https://gitbook.com/docs/getting-started/git-sync/commits',
                                                }}
                                            >
                                                Learn more.
                                            </link>
                                        </text>
                                    }
                                    element={
                                        <switch
                                            state="withCustomTemplate"
                                            onValueChange={{
                                                action: 'toggle.customTemplate',
                                                withCustomTemplate:
                                                    element.dynamicState('withCustomTemplate'),
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
                                                !element.state.accessToken ||
                                                !element.state.project ||
                                                !element.state.branch
                                            }
                                            label="Sync"
                                            tooltip="Start the initial synchronization"
                                            onPress={{ action: 'save.configuration' }}
                                        />
                                    }
                                />
                            </>
                        ) : null}
                    </>
                ) : null}
            </configuration>
        );
    },
});
