import { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export interface SlackInstallationConfiguration {
    oauth_credentials?: {
        access_token: string;
    };

    default_channel?: string;
    recordings_space?: string;
}

export interface SlackSpaceInstallationConfiguration {
    channel?: string;
    notify_content_update?: boolean;
    notify_visibility_update?: boolean;
}

export type SlackRuntimeEnvironment = RuntimeEnvironment<
    SlackInstallationConfiguration,
    SlackSpaceInstallationConfiguration
>;

export type SlackRuntimeContext = RuntimeContext<SlackRuntimeEnvironment>;
