import hash from 'hash-sum';

import { ContentKitIcon } from '@gitbook/api';
import { createComponent } from '@gitbook/runtime';

import { extractTokenCredentialsOrThrow } from './api';
import { saveSpaceConfiguration } from './installation';
import { getPrettyGitRef } from './provider';
import {
    GithubConfigureAction,
    GithubConfigureProps,
    GithubConfigureState,
    GithubRuntimeContext,
} from './types';
import { assertIsDefined, getGitSyncCommitMessage, GITSYNC_DEFAULT_COMMIT_MESSAGE } from './utils';

/**
 * ContentKit component to configure the GitHub integration.
 */
export const configBlock = createComponent<
    GithubConfigureProps,
    GithubConfigureState,
    GithubConfigureAction,
    GithubRuntimeContext
>({
    componentId: 'configure',
    initialState: (props) => {
        return {
            installation: props.spaceInstallation.configuration?.installation?.toString(),
            repository: props.spaceInstallation.configuration?.repository?.toString(),
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
            previewExternalBranches: props.spaceInstallation.configuration?.previewExternalBranches,
            priority: props.spaceInstallation.configuration?.priority || 'github',
        };
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'select.installation':
                return {
                    ...element,
                    state: {
                        ...element.state,
                        installation: action.installation,
                    },
                };
            case 'select.repository':
                return {
                    ...element,
                    state: {
                        ...element.state,
                        repository: action.repository,
                    },
                };
            case 'select.branch':
                return {
                    ...element,
                    state: {
                        ...element.state,
                        branch: action.branch,
                    },
                };
            case 'toggle.customTemplate':
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
                            },
                        ),
                    },
                };
            case 'save.config': {
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
            accessToken = extractTokenCredentialsOrThrow(context).access_token;
        } catch (error) {
            accessToken = undefined;
        }

        const isSpaceConfigured = Boolean(
            spaceInstallation.configuration?.key && spaceInstallation.configuration?.configuredAt,
        );
        // Show input elements in disabled state if the space is configured and the access token is missing
        const disableInputElements = isSpaceConfigured && !accessToken;

        /**
         * The version hash will be used to invalidate the cache of the select components
         * on the frontend when the input props to the component change.
         */
        const versionHash = hash(element.props);

        return (
            <configuration>
                <input
                    label="Authenticate"
                    hint="Authenticate using your GitHub account"
                    element={
                        <button
                            label={accessToken ? 'Connected' : 'Connect with GitHub'}
                            icon={ContentKitIcon.Github}
                            onPress={{
                                action: '@ui.url.open',
                                url: `${context.environment.spaceInstallation?.urls.publicEndpoint}/oauth`,
                            }}
                        />
                    }
                />

                {disableInputElements ? (
                    <box>
                        <divider size="medium" />
                        <hint>
                            <text style="bold">
                                Your space has been configured to synchronize with GitHub. To change
                                the configuration, please re-authenticate with GitHub.
                            </text>
                        </hint>
                        <divider size="medium" />
                    </box>
                ) : accessToken ? (
                    <divider size="medium" />
                ) : null}

                {!accessToken && !isSpaceConfigured ? null : (
                    <box>
                        <markdown content="### Account" />

                        <vstack>
                            <input
                                label="Select account"
                                hint={
                                    <text>
                                        Choose the GitHub installation, user or organization.{' '}
                                        <link
                                            target={{
                                                url: context.environment.secrets.APP_INSTALL_URL,
                                            }}
                                        >
                                            Install the GitHub app.
                                        </link>
                                    </text>
                                }
                                element={
                                    <select
                                        state="installation"
                                        disabled={disableInputElements ? true : undefined}
                                        onValueChange={{
                                            action: 'select.installation',
                                            installation: element.dynamicState('installation'),
                                        }}
                                        options={
                                            disableInputElements
                                                ? [
                                                      {
                                                          id: `${spaceInstallation.configuration.installation}`,
                                                          label: `${spaceInstallation.configuration.accountName}`,
                                                      },
                                                  ]
                                                : {
                                                      url: {
                                                          host: new URL(
                                                              spaceInstallationPublicEndpoint,
                                                          ).host,
                                                          pathname: `${
                                                              new URL(
                                                                  spaceInstallationPublicEndpoint,
                                                              ).pathname
                                                          }/installations`,
                                                          query: {
                                                              v: versionHash,
                                                          },
                                                      },
                                                  }
                                        }
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
                                                        url: `https://github.com/settings/installations/${element.state.installation}`,
                                                    }}
                                                >
                                                    GitHub installation.
                                                </link>
                                            </text>
                                        }
                                        element={
                                            <select
                                                state="repository"
                                                disabled={disableInputElements ? true : undefined}
                                                onValueChange={{
                                                    action: 'select.repository',
                                                    repository: element.dynamicState('repository'),
                                                }}
                                                options={
                                                    disableInputElements
                                                        ? [
                                                              {
                                                                  id: `${spaceInstallation.configuration.repository}`,
                                                                  label: `${spaceInstallation.configuration.repoName}`,
                                                              },
                                                          ]
                                                        : {
                                                              url: {
                                                                  host: new URL(
                                                                      spaceInstallationPublicEndpoint,
                                                                  ).host,
                                                                  pathname: `${
                                                                      new URL(
                                                                          spaceInstallationPublicEndpoint,
                                                                      ).pathname
                                                                  }/repos`,
                                                                  query: {
                                                                      installation:
                                                                          element.dynamicState(
                                                                              'installation',
                                                                          ),
                                                                      selectedRepo:
                                                                          element.dynamicState(
                                                                              'repository',
                                                                          ),
                                                                      v: versionHash,
                                                                  },
                                                              },
                                                          }
                                                }
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
                                                acceptInput
                                                state="branch"
                                                disabled={disableInputElements ? true : undefined}
                                                onValueChange={{
                                                    action: 'select.branch',
                                                    branch: element.dynamicState('branch'),
                                                }}
                                                options={
                                                    disableInputElements
                                                        ? [
                                                              {
                                                                  id: `${spaceInstallation.configuration.branch}`,
                                                                  label: getPrettyGitRef(
                                                                      `${spaceInstallation.configuration.branch}`,
                                                                  ),
                                                              },
                                                          ]
                                                        : {
                                                              url: {
                                                                  host: new URL(
                                                                      spaceInstallationPublicEndpoint,
                                                                  ).host,
                                                                  pathname: `${
                                                                      new URL(
                                                                          spaceInstallationPublicEndpoint,
                                                                      ).pathname
                                                                  }/branches`,
                                                                  query: {
                                                                      repository:
                                                                          element.dynamicState(
                                                                              'repository',
                                                                          ),
                                                                      selectedBranch:
                                                                          element.dynamicState(
                                                                              'branch',
                                                                          ),
                                                                      v: versionHash,
                                                                  },
                                                              },
                                                          }
                                                }
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
                                                Learn More.
                                            </link>
                                        </text>
                                    }
                                    element={
                                        <textinput
                                            state="projectDirectory"
                                            disabled={disableInputElements ? true : undefined}
                                            placeholder="./"
                                        />
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
                                                Learn More.
                                            </link>
                                        </text>
                                    }
                                    element={
                                        <switch
                                            state="withCustomTemplate"
                                            disabled={disableInputElements ? true : undefined}
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
                                                    disabled={
                                                        disableInputElements ? true : undefined
                                                    }
                                                    placeholder={GITSYNC_DEFAULT_COMMIT_MESSAGE}
                                                />
                                            </box>
                                            <button
                                                disabled={disableInputElements ? true : undefined}
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
                                                    url: 'https://gitbook.com/docs/integrations/git-sync/github-pull-request-preview#security-considerations',
                                                }}
                                            >
                                                Learn More.
                                            </link>
                                        </text>
                                    }
                                    element={
                                        <switch
                                            state="previewExternalBranches"
                                            disabled={disableInputElements ? true : undefined}
                                        />
                                    }
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
                                        element={
                                            <radio
                                                state="priority"
                                                disabled={disableInputElements ? true : undefined}
                                                value="github"
                                            />
                                        }
                                    />
                                </card>
                                <card>
                                    <input
                                        label="GitBook to GitHub"
                                        hint="I write my content on GitBook. Content on GitHub will be replaced with the space content."
                                        element={
                                            <radio
                                                state="priority"
                                                disabled={disableInputElements ? true : undefined}
                                                value="gitbook"
                                            />
                                        }
                                    />
                                </card>

                                {disableInputElements ? null : (
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
                                                label="Sync"
                                                tooltip="Start the initial synchronization"
                                                onPress={{ action: 'save.config' }}
                                            />
                                        }
                                    />
                                )}
                            </>
                        ) : null}
                    </box>
                )}
            </configuration>
        );
    },
});
