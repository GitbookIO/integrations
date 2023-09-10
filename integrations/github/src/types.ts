import { IntegrationInstallationConfiguration } from '@gitbook/api';
import type { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export type GitHubSpaceConfiguration = {
    oauth_credentials?: {
        access_token: string;
        expires_at: number;
        refresh_token?: string;
    };
} & ConfigureProps['spaceInstallation']['configuration'];

export type GithubRuntimeEnvironment = RuntimeEnvironment<{}, GitHubSpaceConfiguration>;
export type GithubRuntimeContext = RuntimeContext<GithubRuntimeEnvironment>;

export type ConfigureAction =
    | { action: 'select.installation'; installation: string }
    | { action: 'select.repository'; repository: string }
    | { action: 'select.branch'; branch: string }
    | { action: 'toggle.customTemplate'; withCustomTemplate: boolean }
    | { action: 'preview.commitMessage' }
    | { action: 'save.config' };

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
             * The installation ID of the GitHub App.
             */
            installation?: string;
            /**
             * Owner of the repository
             */
            accountName?: string;
            /**
             * The repository ID to be used for the integration.
             */
            repository?: string;
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
    };
};

export type ConfigureState = ConfigureProps['spaceInstallation']['configuration'] & {
    withCustomTemplate?: boolean;
    commitMessagePreview?: string;
};

export type IntegrationTaskType =
    | 'sync:repo'
    | 'sync:pull-requests'
    | 'sync:pull-request-comments'
    | 'sync:issues'
    | 'sync:issue-comments'
    | 'sync:releases';

export type BaseIntegrationTaskPayload = {
    organizationId: string;
    integrationInstallationId: string;
    githubInstallationId: string;
    repositoryId: number;
    ownerName: string;
    repoName: string;
    token: string;
    page?: number;
};

export type BaseIntegrationTask<
    Type extends IntegrationTaskType,
    Payload extends BaseIntegrationTaskPayload
> = {
    type: Type;
    payload: Payload;
};

export type IntegrationTaskSyncRepo = BaseIntegrationTask<'sync:repo', BaseIntegrationTaskPayload>;

export type IntegrationTaskSyncPullRequests = BaseIntegrationTask<
    'sync:pull-requests',
    BaseIntegrationTaskPayload
>;

export type IntegrationTaskSyncPullRequestComments = BaseIntegrationTask<
    'sync:pull-request-comments',
    BaseIntegrationTaskPayload & {
        pullRequest: number;
    }
>;

export type IntegrationTaskSyncIssues = BaseIntegrationTask<
    'sync:issues',
    BaseIntegrationTaskPayload
>;

export type IntegrationTaskSyncIssueComments = BaseIntegrationTask<
    'sync:issue-comments',
    BaseIntegrationTaskPayload & {
        issue: number;
    }
>;

export type IntegrationTaskSyncReleases = BaseIntegrationTask<
    'sync:releases',
    BaseIntegrationTaskPayload
>;

export type IntegrationTask =
    | IntegrationTaskSyncRepo
    | IntegrationTaskSyncPullRequests
    | IntegrationTaskSyncPullRequestComments
    | IntegrationTaskSyncIssues
    | IntegrationTaskSyncIssueComments
    | IntegrationTaskSyncReleases;
