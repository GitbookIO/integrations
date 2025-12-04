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
export type GitHubIssuesRuntimeContext = RuntimeContext<GitHubIssuesRuntimeEnvironment>;

export type GitHubIssuesRepository = components['schemas']['repository'];

export type GitHubWebhookInstallationCreatedEventPayload =
    components['schemas']['webhook-installation-created'];
export type GitHubWebhookInstallationDeletedEventPayload =
    components['schemas']['webhook-installation-deleted'];

export type GitHubWebhookInstallationEventPayload =
    | GitHubWebhookInstallationCreatedEventPayload
    | GitHubWebhookInstallationDeletedEventPayload;
