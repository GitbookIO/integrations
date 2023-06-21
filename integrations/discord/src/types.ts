import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';

export interface DiscordInstallationConfiguration {
    oauth_credentials?: {
        access_token: string;
        webhook: {
            application_id: string;
            name: string;
            url: string;
            channel_id: string;
            token: string;
            type: number;
            avatar?: string;
            guild_id: string;
            id: string;
        };
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
