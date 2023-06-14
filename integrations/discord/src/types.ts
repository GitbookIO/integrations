import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';

export interface DiscordInstallationConfiguration {
    oauth_credentials?: {
        access_token: string;
    };
}

export interface DiscordSpaceInstallationConfiguration {
    channel?: string;
    notify_content_update?: boolean;
    notify_visibility_update?: boolean;
}

export type DiscordRuntimeEnvironment = RuntimeEnvironment<
    DiscordInstallationConfiguration,
    DiscordSpaceInstallationConfiguration
>;
export type DiscordRuntimeContext = RuntimeContext<DiscordRuntimeEnvironment>;
