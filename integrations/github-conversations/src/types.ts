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
export type CommentAuthorAssociation =
    | 'OWNER'
    | 'MEMBER'
    | 'COLLABORATOR'
    | 'CONTRIBUTOR'
    | 'FIRST_TIME_CONTRIBUTOR'
    | 'FIRST_TIMER'
    | 'NONE'
    | 'MANNEQUIN';

export interface GitHubDiscussion {
    number: number;
    title: string;
    body: string;
    bodyText: string;
    url: string;
    createdAt: string;
    author?: {
        login: string;
    };
    authorAssociation: CommentAuthorAssociation;
    isAnswered: boolean;
    answer?: {
        body: string;
        bodyText: string;
        authorAssociation: CommentAuthorAssociation;
    };
    comments: {
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
    body: string;
    bodyText: string;
    author?: {
        login: string;
    };
    authorAssociation: CommentAuthorAssociation;
    isAnswer: boolean;
    replies: {
        nodes: {
            body: string;
            bodyText: string;
            author?: {
                login: string;
            };
            authorAssociation: CommentAuthorAssociation;
        }[];
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
