import { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export interface GitLabSpaceInstallationConfiguration {
    auth_token: string;
    project: string;
    ref: string;
    gitlab_host?: string;
    fork_pr_preview?: boolean;
}

export type GitLabRuntimeEnvironment = RuntimeEnvironment<{}, GitLabSpaceInstallationConfiguration>;

export type GitLabRuntimeContext = RuntimeContext<GitLabRuntimeEnvironment>;
