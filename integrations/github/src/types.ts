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

export type ConfigureAction =
    | { action: '@select.installation' }
    | { action: '@select.repository' }
    | { action: '@select.branch' }
    | { action: '@toggle.customTemplate' }
    | { action: '@preview.commitMessage' }
    | { action: '@save' };

export type ConfigureProps = {
    configuration: {
        key?: string;
        installation?: string;
        repository?: string;
        branch?: string;
        projectDirectory?: string;
        commitMessageTemplate?: string;
        previewExternalBranches?: boolean;
        priority: 'github' | 'gitbook';
    };
};

export type ConfigureState = ConfigureProps['configuration'] & {
    withCustomTemplate?: boolean;
    commitMessagePreview?: string;
};
