import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';

export type GitHubInstallationConfiguration = {
    /** GitHub repository in the form owner/repo */
    repository?: string;
    /** OAuth credentials */
    oauth_credentials?: {
        access_token: string;
    };
};

export type GitHubRuntimeEnvironment = RuntimeEnvironment<GitHubInstallationConfiguration>;
export type GitHubRuntimeContext = RuntimeContext<GitHubRuntimeEnvironment>;
