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
            key?: string;
            accessToken?: string;
            customInstanceUrl?: string;
            project?: string;
            branch?: string;
            projectDirectory?: string;
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
