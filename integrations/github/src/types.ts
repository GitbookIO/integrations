import { IntegrationInstallationConfiguration } from '@gitbook/api';
import type { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export type GitHubSpaceConfiguration = {
    oauth_credentials?: {
        access_token: string;
        expires_at: number;
        refresh_token?: string;
    };
} & SpaceInstallationConfiguration;

export type GithubRuntimeEnvironment = RuntimeEnvironment<{}, GitHubSpaceConfiguration>;
export type GithubRuntimeContext = RuntimeContext<GithubRuntimeEnvironment>;

export type GithubConfigureAction =
    | { action: 'select.installation'; installation: string }
    | { action: 'select.repository'; repository: string }
    | { action: 'select.branch'; branch: string }
    | { action: 'toggle.customTemplate'; withCustomTemplate: boolean }
    | { action: 'preview.commitMessage' }
    | { action: 'save.config' };

type SpaceInstallationConfiguration = {
    /**
     * A key to uniquely identify the configuration.
     */
    key?: string;
    /**
     * The installation ID of the GitHub App.
     */
    installation?: number;
    /**
     * Owner of the repository
     */
    accountName?: string;
    /**
     * The repository ID to be used for the integration.
     */
    repository?: number;
    /**
     * Name of the repository for the selected repository ID.
     */
    repoName?: string;
    /**
     * The branch to be used for the integration.
     */
    branch?: string;
    /**
     * Root folder to use for monorepos with multiple spaces synced.
     */
    projectDirectory?: string;
    /**
     * Template to use for commit messages.
     */
    commitMessageTemplate?: string;
    /**
     * Whether to generate preview from branches external to the repository
     */
    previewExternalBranches?: boolean;
    priority: 'github' | 'gitbook';
};

export type GithubConfigureProps = {
    installation: {
        configuration?: IntegrationInstallationConfiguration;
    };
    spaceInstallation: {
        configuration?: SpaceInstallationConfiguration;
    };
};

export type GithubConfigureState = Omit<
    SpaceInstallationConfiguration,
    'installation' | 'repository'
> & {
    installation?: string;
    repository?: string;
    withCustomTemplate?: boolean;
    commitMessagePreview?: string;
};
