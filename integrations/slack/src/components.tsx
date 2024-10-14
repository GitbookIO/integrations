import { ContentKitIcon } from '@gitbook/api';
import { createComponent } from '@gitbook/runtime';

import {
    SlackConfigureAction,
    SlackConfigureProps,
    SlackConfigureState,
    SlackConfigureStep,
    SlackRuntimeContext,
} from './types';
import { extractTokenCredentialsOrThrow } from './utils';

/** Constants for the stepper */

const STEPPER_ACTION = 'step.go';
const STEPPER_DEFAULT_STEP = SlackConfigureStep.Channels;

const STEPPER_GO = {
    action: STEPPER_ACTION,
};

// const STEPPER_GO_AUTH = {
//     ...STEPPER_GO,
//     step: SlackConfigureStep.Auth,
// };
// const STEPPER_GO_CHANNELS = {
//     ...STEPPER_GO,
//     step: SlackConfigureStep.Channels,
// };
// const STEPPER_GO_NOTIFICATIONS = {
//     ...STEPPER_GO,
//     step: SlackConfigureStep.Notifications,
// };

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
                    },
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
                    },
                );

                return element;
            }
            case STEPPER_ACTION: {
                return {
                    ...element,
                    state: {
                        ...element.state,
                        active: action.step,
                    },
                };
            }
        }
    },
    render: async (element, context) => {
        console.log('=== Render', JSON.stringify(element, null, 2));
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

        // If the user has already authenticated, we start at the channels step
        const stepIdFromConfiguration = accessToken
            ? STEPPER_DEFAULT_STEP
            : SlackConfigureStep.Auth;

        console.log('=== Render', JSON.stringify(element.state, null, 2));
        return (
            <stepper
                activeStep={element.state.active ?? stepIdFromConfiguration}
                onStepChange={STEPPER_GO}
                onComplete={{ action: 'save.config' }}
            >
                <step id={SlackConfigureStep.Auth} title="Authenticate" next={Boolean(accessToken)}>
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
                    id={SlackConfigureStep.Channels}
                    title="Channels"
                    next={Boolean(accessToken && element.state.defaultChannel)}
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
                <step id={SlackConfigureStep.Notifications} title="Notifications" next={true}>
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
