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
type GitHubIssuesIntegrationTaskType = 'ingest:github-installation:repo-issues';

type GitHubIssuesIntegrationBaseTask<
    Type extends GitHubIssuesIntegrationTaskType,
    Payload extends object,
> = {
    type: Type;
    payload: Payload;
};

export type GitHubIssuesIntegrationIngestRepo = GitHubIssuesIntegrationBaseTask<
    'ingest:github-installation:repo-issues',
    {
        organization: Organization['id'];
        gitbookInstallationId: IntegrationInstallation['id'];
        githubInstallationId: GitHubIssuesAppInstallation['id'];
        repository: {
            name: GitHubIssuesRepository['name'];
            owner: GitHubIssuesRepository['owner']['login'];
        };
    }
>;

export type GitHubIssuesIntegrationTask = GitHubIssuesIntegrationIngestRepo;

/**
 * GitHub API/webhook schemas types.
 */
export type GitHubIssuesAppInstallation = components['schemas']['installation'];
export type GitHubIssuesRepository = components['schemas']['repository'];

export type GitHubWebhookInstallationCreatedEventPayload =
    components['schemas']['webhook-installation-created'];
export type GitHubWebhookInstallationDeletedEventPayload =
    components['schemas']['webhook-installation-deleted'];

export type GitHubWebhookInstallationEventPayload =
    | GitHubWebhookInstallationCreatedEventPayload
    | GitHubWebhookInstallationDeletedEventPayload;
