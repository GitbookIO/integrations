import { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

/**
 * Configuration for the Slack integration at the orgnaization level.
 */
export interface SlackOrgInstallationConfiguration {
    oauth_credentials?: {
        access_token: string;
    };

    default_channel?: string;
}

/**
 * Configuration for the Slack integration at the space level.
 */
export interface SlackSpaceInstallationConfiguration {
    channel?: string;
    notify_content_update?: boolean;
    notify_visibility_update?: boolean;
}

export type SlackRuntimeEnvironment = RuntimeEnvironment<
    SlackOrgInstallationConfiguration,
    SlackSpaceInstallationConfiguration
>;

export type SlackRuntimeContext = RuntimeContext<SlackRuntimeEnvironment>;
