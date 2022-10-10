import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';

export interface SentryInstallationConfiguration {
    oauth_credentials?: {
        access_token: string;
    };
}

export type SentryRuntimeEnvironment = RuntimeEnvironment<SentryInstallationConfiguration>;
export type SentryRuntimeContext = RuntimeContext<SentryRuntimeEnvironment>;
