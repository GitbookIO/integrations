import type { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export type GitHubSpaceConfiguration = {
    oauth_credentials?: {
        access_token: string;
        expires_at: number;
        refresh_token: string;
    };
} & ConfigureState;

export type GithubRuntimeEnvironment = RuntimeEnvironment<{}, GitHubSpaceConfiguration>;
export type GithubRuntimeContext = RuntimeContext<GithubRuntimeEnvironment>;

export type ConfigureAction =
    | { action: 'select.installation' }
    | { action: 'select.repository' }
    | { action: 'select.branch' }
    | { action: 'toggle.customTemplate' }
    | { action: 'preview.commitMessage' }
    | { action: 'save' };

export type ConfigureProps = {
    spaceInstallation: {
        configuration?: {
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
};

export type ConfigureState = ConfigureProps['spaceInstallation']['configuration'] & {
    withCustomTemplate?: boolean;
    commitMessagePreview?: string;
};
