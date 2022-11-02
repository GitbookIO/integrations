import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';

export interface SentryInstallationConfiguration {
    auth_token?: string;
}

export type SentryRuntimeEnvironment = RuntimeEnvironment<SentryInstallationConfiguration>;
export type SentryRuntimeContext = RuntimeContext<SentryRuntimeEnvironment>;

export interface SentryIssue {
    title: string;
    shortId: string;
    level: string;
    metadata: { function?: string; value?: string; type?: string };
    status: string;
}
