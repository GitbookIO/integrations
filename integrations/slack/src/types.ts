import type { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

type SlackConfigureStepId = 'auth' | 'channels' | 'notifications';

export type SlackConfigureAction =
    | { action: 'select.installation'; installation: string }
    | { action: 'select.defaultChannel'; defaultChannel: string }
    | { action: 'select.spaceChannel'; spaceChannel: string }
    | { action: 'toggle.notifyContentUpdate'; notifyContentUpdate: boolean }
    | { action: 'toggle.notifyVisibilityUpdate'; notifyVisibilityUpdate: boolean }
    | { action: 'save.config' }
    | { action: 'step.go'; step: SlackConfigureStepId };

/**
 * Configuration for the Slack integration at the orgnaization level.
 */
export interface InstallationConfiguration {
    oauth_credentials?: {
        access_token: string;
    };

    default_channel?: string;
}

/**
 * Configuration for the Slack integration at the space level.
 */
export interface SpaceInstallationConfiguration {
    channel?: string;
    notify_content_update?: boolean;
    notify_visibility_update?: boolean;
}

export type FullInstallationConfiguration = InstallationConfiguration &
    SpaceInstallationConfiguration;

export type SlackRuntimeEnvironment = RuntimeEnvironment<
    InstallationConfiguration,
    SpaceInstallationConfiguration
>;

export type SlackRuntimeContext = RuntimeContext<SlackRuntimeEnvironment>;

export type SlackConfigureProps = {
    installation: {
        configuration?: InstallationConfiguration;
    };
    spaceInstallation: {
        configuration?: SpaceInstallationConfiguration;
    };
};

export type SlackConfigureState = {
    activeStepId?: SlackConfigureStepId;
    accessToken?: string;
    defaultChannel?: string;
    spaceChannel?: string;
    notifyContentUpdate?: boolean;
    notifyVisibilityUpdate?: boolean;
};
