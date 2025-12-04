import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';
import type { components } from '@octokit/openapi-types';

export type GitHubIssuesInstallationConfiguration = {
    installation_ids?: string[];
};

export type GitHubIssuesRuntimeEnvironment =
    RuntimeEnvironment<GitHubIssuesInstallationConfiguration>;
export type GitHubIssuesRuntimeContext = RuntimeContext<GitHubIssuesRuntimeEnvironment>;

export type GitHubIssuesRepository = components['schemas']['repository'];
