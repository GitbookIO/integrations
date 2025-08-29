import type { OAuthConfiguration, RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export type GitHubCopilotConfiguration = {
    oauth_credentials?: OAuthConfiguration;
};

export type GitHubCopilotRuntimeEnvironment = RuntimeEnvironment<GitHubCopilotConfiguration, {}>;
export type GitHubCopilotRuntimeContext = RuntimeContext<GitHubCopilotRuntimeEnvironment>;
