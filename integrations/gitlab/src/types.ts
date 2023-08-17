import { IntegrationInstallationConfiguration } from '@gitbook/api';
import type { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export type GitLabSpaceConfiguration = {
    oauth_credentials?: {
        access_token: string;
        expires_at: number;
        refresh_token: string;
    };
} & ConfigureState;

export type GitLabRuntimeEnvironment = RuntimeEnvironment<{}, GitLabSpaceConfiguration>;
export type GitLabRuntimeContext = RuntimeContext<GitLabRuntimeEnvironment>;

export type ConfigureAction =
    | { action: 'select.project' }
    | { action: 'select.branch' }
    | { action: 'toggle.customTemplate' }
    | { action: 'preview.commitMessage' }
    | { action: 'save' };

export type ConfigureProps = {
    installation: {
        configuration?: IntegrationInstallationConfiguration;
    };
    spaceInstallation: {
        configuration?: {
            key?: string;
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
    commitMessagePreview?: string;
};
