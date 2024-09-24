import { IntegrationInstallationConfiguration } from '@gitbook/api';
import type { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export type GitHubSpaceConfiguration = {
    configuredAt?: string;
    oauth_credentials?: {
        access_token: string;
        expires_at: number;
        refresh_token?: string;
    };
} & SpaceInstallationConfiguration;

export type GithubRuntimeEnvironment = RuntimeEnvironment<{}, GitHubSpaceConfiguration>;
export type GithubRuntimeContext = RuntimeContext<GithubRuntimeEnvironment>;

export enum GithubConfigureStep {
    Auth = 'auth',
    Repository = 'repo',
    Extras = 'extras',
    Sync = 'sync',
}

type GithubConfigureStepId = keyof typeof GithubConfigureStep;

export type GithubConfigureAction =
    | { action: 'select.installation'; installation: string }
    | { action: 'select.repository'; repository: string }
    | { action: 'select.branch'; branch: string }
    | { action: 'toggle.customTemplate'; withCustomTemplate: boolean }
    | { action: 'preview.commitMessage' }
    | { action: 'save.config' }
    | { action: 'step.go'; step: GithubConfigureStepId };

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

export type IntegrationTaskType = 'import:spaces';

export type BaseIntegrationTask<Type extends IntegrationTaskType, Payload extends object> = {
    type: Type;
    payload: Payload;
};

export type IntegrationTaskImportSpaces = BaseIntegrationTask<
    'import:spaces',
    {
        configQuery: string;
        page?: string;
        standaloneRef?: string;
        /**
         * The timestamp of the event that triggers the export.
         *
         * This is to help ensures that Git sync import and export operations are executed
         * in the same order on GitBook and on the remote repository.
         */
        eventTimestamp?: Date;
    }
>;

export type IntegrationTask = IntegrationTaskImportSpaces;
