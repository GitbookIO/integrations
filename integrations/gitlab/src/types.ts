import { IntegrationInstallationConfiguration } from '@gitbook/api';
import type { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export type GitLabSpaceConfiguration = {
    configuredAt?: string;
    webhookId?: number;
} & SpaceInstallationConfiguration;

export type GitLabRuntimeEnvironment = RuntimeEnvironment<{}, GitLabSpaceConfiguration>;
export type GitLabRuntimeContext = RuntimeContext<GitLabRuntimeEnvironment>;

export type GitlabConfigureAction =
    | { action: 'save.token'; token: string; customInstanceUrl?: string }
    | { action: 'select.project'; project: string }
    | { action: 'select.branch'; branch: string }
    | { action: 'toggle.customTemplate'; withCustomTemplate: boolean }
    | { action: 'toggle.customInstanceUrl'; withCustomInstanceUrl: boolean }
    | { action: 'preview.commitMessage' }
    | { action: 'save.configuration' };

type SpaceInstallationConfiguration = {
    /**
     * A key to uniquely identify the configuration.
     */
    key?: string;
    /**
     * GitLab access token with specific scopes.
     */
    accessToken?: string;
    /**
     * Unique identifier of the GitLab user associated with the access token.
     */
    userId?: number;
    /**
     * Self hosted GitLab instance (if not defined, we use gitlab.com)
     */
    customInstanceUrl?: string;
    /**
     * Unique identifier of the GitLab project.
     */
    project?: number;
    /**
     * Full name of the GitLab project with namespace.
     */
    projectName?: string;
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
    priority: 'gitlab' | 'gitbook';
};

export type GitlabConfigureProps = {
    installation: {
        configuration?: IntegrationInstallationConfiguration;
    };
    spaceInstallation: {
        configuration?: SpaceInstallationConfiguration;
    };
};

export type GitlabConfigureState = Omit<SpaceInstallationConfiguration, 'project'> & {
    project?: string;
    withCustomTemplate?: boolean;
    withCustomInstanceUrl?: boolean;
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
    }
>;

export type IntegrationTask = IntegrationTaskImportSpaces;
