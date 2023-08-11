import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';

export interface GitlabInstallationConfiguration {
    oauth_credentials?: {
        access_token: string;
    };
}

export type GitlabRuntimeEnvironment = RuntimeEnvironment<GitlabInstallationConfiguration>;
export type GitlabRuntimeContext = RuntimeContext<GitlabRuntimeEnvironment>;
