import type { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export interface GithubSpaceInstallationConfiguration {
    oauth_credentials?: {
        access_token: string;
        expires_at: number;
        refresh_token: string;
    };
}

export type GithubRuntimeEnvironment = RuntimeEnvironment<{}, GithubSpaceInstallationConfiguration>;
export type GithubRuntimeContext = RuntimeContext<GithubRuntimeEnvironment>;
