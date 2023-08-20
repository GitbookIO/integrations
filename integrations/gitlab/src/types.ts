import { IntegrationInstallationConfiguration } from '@gitbook/api';
import type { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export type GitLabSpaceConfiguration = {
    webhookId?: number;
} & ConfigureProps['spaceInstallation']['configuration'];

export type GitLabRuntimeEnvironment = RuntimeEnvironment<{}, GitLabSpaceConfiguration>;
export type GitLabRuntimeContext = RuntimeContext<GitLabRuntimeEnvironment>;

export type ConfigureAction =
    | { action: 'connect.gitlab' }
    | { action: 'save.token'; token: string }
    | { action: 'select.project' }
    | { action: 'select.branch' }
    | { action: 'toggle.customTemplate' }
    | { action: 'toggle.customInstanceUrl' }
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
             * The project to be used for the integration. The string is a concatenation
             * of the project ID and the project name, separated by a colon (eg. 123456:foo/bar-project).
             */
            project?: string;
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
    withCustomTemplate?: boolean;
    withCustomInstanceUrl?: boolean;
    withConnectGitLab?: boolean;
    commitMessagePreview?: string;
};
