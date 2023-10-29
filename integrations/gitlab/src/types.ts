import { IntegrationInstallationConfiguration } from '@gitbook/api';
import type { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export type GitLabSpaceConfiguration = {
    webhookId?: number;
} & ConfigureProps['spaceInstallation']['configuration'];

export type GitLabRuntimeEnvironment = RuntimeEnvironment<{}, GitLabSpaceConfiguration>;
export type GitLabRuntimeContext = RuntimeContext<GitLabRuntimeEnvironment>;

export type ConfigureAction =
    | { action: 'connect.gitlab'; withConnectGitLab: boolean }
    | { action: 'save.token'; token: string }
    | { action: 'select.project'; project: string }
    | { action: 'select.branch'; branch: string }
    | { action: 'toggle.customTemplate'; withCustomTemplate: boolean }
    | { action: 'toggle.customInstanceUrl'; withCustomInstanceUrl: boolean }
    | { action: 'preview.commitMessage' }
    | { action: 'save.configuration' };

export type ConfigureProps = {
    installation: {
        configuration?: IntegrationInstallationConfiguration;
    };
    spaceInstallation: {
        configuration?: {
            /**
             * A key to uniquely identify the configuration.
             */
            key?: string;
            /**
             * GitLab access token with specific scopes.
             */
            accessToken?: string;
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
    };
};

export type ConfigureState = ConfigureProps['spaceInstallation']['configuration'] & {
    withConnectGitLab?: boolean;
    withCustomTemplate?: boolean;
    withCustomInstanceUrl?: boolean;
    commitMessagePreview?: string;
};
