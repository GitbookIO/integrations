import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';

export interface ZendeskInstallationConfiguration {
    oauth_credentials?: {
        access_token: string;
    };
}

export type ZendeskRuntimeEnvironment = RuntimeEnvironment<ZendeskInstallationConfiguration>;
export type ZendeskRuntimeContext = RuntimeContext<ZendeskRuntimeEnvironment>;
