import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';

export interface GithubInstallationConfiguration {
    oauth_credentials?: {
        access_token: string;
    };
}

export type GithubRuntimeEnvironment = RuntimeEnvironment<GithubInstallationConfiguration>;
export type GithubRuntimeContext = RuntimeContext<GithubRuntimeEnvironment>;
