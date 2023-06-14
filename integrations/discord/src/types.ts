import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';

export interface DiscordInstallationConfiguration {
    oauth_credentials?: {
        access_token: string;
    };
}

export type DiscordRuntimeEnvironment = RuntimeEnvironment<DiscordInstallationConfiguration>;
export type DiscordRuntimeContext = RuntimeContext<DiscordRuntimeEnvironment>;
