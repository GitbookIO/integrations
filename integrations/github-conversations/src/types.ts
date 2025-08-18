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

export interface GitHubAuthor {
    login: string;
}

export interface GitHubRepositoryOwner {
    name: string;
    owner: {
        login: string;
    };
}

export interface GitHubBaseContent {
    body: string;
    bodyText: string;
    author?: GitHubAuthor;
    authorAssociation: CommentAuthorAssociation;
}

export interface GitHubDiscussionReply extends GitHubBaseContent {}

export interface GitHubDiscussionComment extends GitHubBaseContent {
    isAnswer: boolean;
    replies: {
        nodes: GitHubDiscussionReply[];
    };
}

export interface GitHubDiscussionAnswer extends GitHubBaseContent {}

export interface GitHubDiscussion extends GitHubBaseContent {
    number: number;
    title: string;
    url: string;
    createdAt: string;
    isAnswered: boolean;
    answer?: GitHubDiscussionAnswer;
    comments: {
        nodes: GitHubDiscussionComment[];
    };
    repository: GitHubRepositoryOwner;
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

export interface GitHubSingleDiscussionResponse {
    repository: {
        discussion: GitHubDiscussion | null;
    };
}
