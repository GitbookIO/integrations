import { IntegrationInstallation, Organization } from '@gitbook/api';
import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';
import type { components } from '@octokit/openapi-types';

export type GitHubIssuesInstallationConfiguration = {
    /**
     * The GitHub app installation IDs associated with the GitBook integration installation.
     */
    installation_ids?: string[];
};

export type GitHubIssuesRuntimeEnvironment =
    RuntimeEnvironment<GitHubIssuesInstallationConfiguration>;
export type GitHubIssuesRuntimeContext = RuntimeContext<
    GitHubIssuesRuntimeEnvironment,
    GitHubIssuesIntegrationTask
>;

/**
 * Integration tasks.
 */
type GitHubIssuesIntegrationTaskType =
    | 'ingest:github-repo:closed-issues'
    | 'ingest:github-repo:issues-batch';

type GitHubIssuesIntegrationBaseTask<
    Type extends GitHubIssuesIntegrationTaskType,
    Payload extends object,
> = {
    type: Type;
    payload: Payload;
};

/**
 * Task dispatched to ingest all recently closed issues from a GitHub repository.
 */
export type GitHubIssuesIntegrationIngestRepoClosedIssues = GitHubIssuesIntegrationBaseTask<
    'ingest:github-repo:closed-issues',
    {
        organization: Organization['id'];
        gitbookInstallationId: IntegrationInstallation['id'];
        githubInstallationId: string;
        repository: {
            name: GitHubIssuesRepository['name'];
            owner: GitHubIssuesRepository['owner']['login'];
        };
    }
>;

/**
 * Task dispatched to ingest a batch of GitHub issue from a repo.
 */
export type GitHubIssuesIntegrationIngestRepoIssuesBatch = GitHubIssuesIntegrationBaseTask<
    'ingest:github-repo:issues-batch',
    {
        organization: Organization['id'];
        gitbookInstallationId: IntegrationInstallation['id'];
        githubInstallationId: string;
        issuesIds: string[];
        repository: {
            name: GitHubIssuesRepository['name'];
            owner: GitHubIssuesRepository['owner']['login'];
        };
    }
>;

export type GitHubIssuesIntegrationTask =
    | GitHubIssuesIntegrationIngestRepoClosedIssues
    | GitHubIssuesIntegrationIngestRepoIssuesBatch;

/**
 * GitHub API/webhook schemas types.
 */
export type GitHubIssuesAppInstallation = components['schemas']['installation'];
export type GitHubIssuesIssue = components['schemas']['issue'];
export type GitHubIssuesRepository = components['schemas']['repository'];

export type GitHubWebhookInstallationCreatedEventPayload =
    components['schemas']['webhook-installation-created'];
export type GitHubWebhookInstallationDeletedEventPayload =
    components['schemas']['webhook-installation-deleted'];

export type GitHubWebhookInstallationEventPayload =
    | GitHubWebhookInstallationCreatedEventPayload
    | GitHubWebhookInstallationDeletedEventPayload;
