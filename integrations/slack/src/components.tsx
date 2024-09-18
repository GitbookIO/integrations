import { ContentKitIcon } from '@gitbook/api';
import { createComponent } from '@gitbook/runtime';

import {
    SlackConfigureAction,
    SlackConfigureProps,
    SlackConfigureState,
    SlackRuntimeContext,
} from './types';
import { extractTokenCredentialsOrThrow } from './utils';

/**
 * ContentKit component to configure the GitHub integration.
 */
export const configBlock = createComponent<
    SlackConfigureProps,
    SlackConfigureState,
    SlackConfigureAction,
    SlackRuntimeContext
>({
    componentId: 'configure',
    initialState: (props) => {
        console.log('props', props);
        return {
            accessToken: props.installation.configuration?.oauth_credentials?.access_token,
            defaultChannel: props.installation.configuration?.default_channel,

            spaceChannel: props.spaceInstallation.configuration?.channel,
            notifyContentUpdate:
                props.spaceInstallation.configuration?.notify_content_update ?? true,
            notifyVisibilityUpdate:
                props.spaceInstallation.configuration?.notify_visibility_update ?? true,
        };
    },
    action: async (element, action, context) => {
        const { api } = context;

        const installation = context.environment.installation;
        const spaceInstallation = context.environment.spaceInstallation;

        switch (action.action) {
            case 'select.defaultChannel':
                return {
                    ...element,
                    state: {
                        ...element.state,
                        defaultChannel: action.defaultChannel,
                    },
                };

            case 'select.spaceChannel':
                return {
                    ...element,
                    state: {
                        ...element.state,
                        spaceChannel: action.spaceChannel,
                    },
                };

            case 'toggle.notifyContentUpdate':
                return {
                    ...element,
                    state: {
                        ...element.state,
                        notifyContentUpdate: action.notifyContentUpdate,
                    },
                };
            case 'toggle.notifyVisibilityUpdate':
                return {
                    ...element,
                    state: {
                        ...element.state,
                        notifyVisibilityUpdate: action.notifyVisibilityUpdate,
                    },
                };
            case 'step.go': {
                return {
                    ...element,
                    state: {
                        ...element.state,
                        activeStepId: action.step,
                    },
                };
            }
            case 'save.config': {
                // TODO: handle errors
                await api.integrations.updateIntegrationInstallation(
                    spaceInstallation.integration, // TODO installatio.integration doesn't exist for some reason
                    installation.id,
                    {
                        configuration: {
                            ...installation.configuration,
                            default_channel: element.state.defaultChannel,
                        },
                    }
                );

                await api.integrations.updateIntegrationSpaceInstallation(
                    spaceInstallation.integration,
                    spaceInstallation.installation,
                    spaceInstallation.space,
                    {
                        configuration: {
                            ...spaceInstallation.configuration,
                            channel: element.state.spaceChannel,
                            notify_content_update: element.state.notifyContentUpdate,
                            notify_visibility_update: element.state.notifyVisibilityUpdate,
                        },
                    }
                );

                return element;
            }
        }
    },
    render: async (element, context) => {
        console.log('render', element.state);
        const installation = context.environment.installation;
        const spaceInstallation = context.environment.spaceInstallation;

        const installationPublicEndpoint = installation.urls.publicEndpoint;
        const spaceInstallationPublicEndpoint = spaceInstallation?.urls?.publicEndpoint;

        let accessToken: string | undefined;
        try {
            accessToken = extractTokenCredentialsOrThrow(context).access_token;
        } catch (error) {
            accessToken = undefined;
        }

        const stepIdFromConfiguration = accessToken ? 'channels' : 'auth';

        return (
            <stepper activeStepId={element.state.activeStepId ?? stepIdFromConfiguration}>
                <step
                    id="auth"
                    title="Authenticate"
                    completed={Boolean(accessToken && element.state.defaultChannel)}
                    onNext={{
                        action: 'step.go',
                        step: 'repo',
                    }}
                >
                    <vstack>
                        <input
                            label="Authenticate"
                            hint="Authenticate using your Slack account"
                            element={
                                <button
                                    label={accessToken ? 'Connected' : 'Connect with Slack'}
                                    icon={ContentKitIcon.Github}
                                    onPress={{
                                        action: '@ui.url.open',
                                        url: `${installationPublicEndpoint}/oauth`,
                                    }}
                                />
                            }
                        />
                    </vstack>
                </step>
                <step
                    id="channels"
                    title="Channels"
                    onPrevious={{
                        action: 'step.go',
                        step: 'auth',
                    }}
                    onNext={{
                        action: 'step.go',
                        step: 'notifications',
                    }}
                    completed={Boolean(element.state.defaultChannel)}
                >
                    <vstack>
                        <input
                            label="Default channel"
                            hint={
                                <text>
                                    Select a channel to post messages to, when none is configured
                                    for a specific space.
                                </text>
                            }
                            element={
                                <select
                                    state="defaultChannel"
                                    disabled={!accessToken ? true : undefined}
                                    onValueChange={{
                                        action: 'select.defaultChannel',
                                        defaultChannel: element.dynamicState('defaultChannel'),
                                    }}
                                    options={
                                        accessToken
                                            ? {
                                                  url: {
                                                      host: new URL(installationPublicEndpoint)
                                                          .host,
                                                      pathname: `${
                                                          new URL(installationPublicEndpoint)
                                                              .pathname
                                                      }/channels`,
                                                  },
                                              }
                                            : []
                                    }
                                />
                            }
                        />
                        <input
                            label="Space channel"
                            hint="Select a channel to post messages related to this space."
                            element={
                                <select
                                    state="spaceChannel"
                                    options={
                                        accessToken
                                            ? {
                                                  url: {
                                                      host: new URL(spaceInstallationPublicEndpoint)
                                                          .host,
                                                      pathname: `${
                                                          new URL(spaceInstallationPublicEndpoint)
                                                              .pathname
                                                      }/channels`,
                                                  },
                                              }
                                            : []
                                    }
                                    onValueChange={{
                                        action: 'select.spaceChannel',
                                        spaceChannel: element.dynamicState('spaceChannel'),
                                    }}
                                />
                            }
                        />
                    </vstack>
                </step>
                <step
                    id="notifications"
                    title="Notifications"
                    completed={true}
                    onPrevious={{
                        action: 'step.go',
                        step: 'channels',
                    }}
                    onNext={{
                        action: 'save.config',
                    }}
                    nextLabel="Complete"
                >
                    <vstack>
                        <input
                            label="Notify Content Update"
                            hint="Post a notification message every time the content of the space is updated."
                            element={
                                <switch
                                    state="notifyContentUpdate"
                                    onValueChange={{
                                        action: 'toggle.notifyContentUpdate',
                                        notifyContentUpdate:
                                            element.dynamicState('notifyContentUpdate'),
                                    }}
                                />
                            }
                        />
                        <input
                            label="Notify Visibility Update"
                            hint="Post a notification message every time the visibility of the space is updated."
                            element={
                                <switch
                                    state="notifyVisibilityUpdate"
                                    onValueChange={{
                                        action: 'toggle.notifyVisibilityUpdate',
                                        notifyVisibilityUpdate:
                                            element.dynamicState('notifyVisibilityUpdate'),
                                    }}
                                />
                            }
                        />
                    </vstack>
                </step>
            </stepper>
        );
    },
});
