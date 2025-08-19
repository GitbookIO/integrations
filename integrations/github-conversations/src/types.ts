import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';
import type { components } from '@octokit/openapi-types';

export type GitHubInstallationConfiguration = {
    installation_ids?: string[];
};

export type GitHubRuntimeEnvironment = RuntimeEnvironment<GitHubInstallationConfiguration>;
export type GitHubRuntimeContext = RuntimeContext<GitHubRuntimeEnvironment>;

/**
 * Octokit types
 */
export type GitHubRepository = components['schemas']['repository'];
export type GitHubWebhookPayload = components['schemas']['webhook-discussion-closed'];
