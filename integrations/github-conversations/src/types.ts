import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';
import type { components } from '@octokit/openapi-types';
import type { components as WebhookComponents } from '@octokit/openapi-webhooks-types';

export type GitHubInstallationConfiguration = {
    /**
     * GitHub App installation ID.
     */
    installation_id?: string;
};

export type GitHubRuntimeEnvironment = RuntimeEnvironment<GitHubInstallationConfiguration>;
export type GitHubRuntimeContext = RuntimeContext<GitHubRuntimeEnvironment>;

/**
 * Use Octokit types for all GitHub API objects
 */
export type GitHubRepository = components['schemas']['repository'];
export type GitHubWebhookDiscussion = WebhookComponents['schemas']['discussion'];
export type GitHubWebhookPayload = WebhookComponents['schemas']['webhook-discussion-closed'];

/**
 * GitHub GraphQL types - these match our GraphQL query structure
 */
export interface GitHubDiscussion {
    id: string;
    number: number;
    title: string;
    body: string;
    bodyHTML: string;
    bodyText: string;
    url: string;
    createdAt: string;
    updatedAt: string;
    author?: {
        login: string;
        avatarUrl?: string;
    } | null;
    category: {
        id: string;
        name: string;
        description?: string;
        emoji: string;
        isAnswerable: boolean;
    };
    answer?: {
        id: string;
        body: string;
        bodyHTML: string;
        bodyText: string;
        createdAt: string;
        author?: {
            login: string;
            avatarUrl?: string;
        } | null;
    } | null;
    isAnswered: boolean;
    comments: {
        totalCount: number;
        nodes: GitHubDiscussionComment[];
    };
    repository: {
        name: string;
        owner: {
            login: string;
        };
    };
}

export interface GitHubDiscussionComment {
    id: string;
    body: string;
    bodyHTML: string;
    bodyText: string;
    createdAt: string;
    updatedAt: string;
    author?: {
        login: string;
        avatarUrl?: string;
    } | null;
    isAnswer: boolean;
    replies: {
        totalCount: number;
        nodes: GitHubDiscussionComment[];
    };
}

export interface GitHubDiscussionsResponse {
    repository: {
        discussions: {
            totalCount: number;
            pageInfo: {
                hasNextPage: boolean;
                endCursor?: string;
            };
            nodes: GitHubDiscussion[];
        };
    };
}
