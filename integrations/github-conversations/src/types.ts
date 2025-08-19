import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';
import type { components } from '@octokit/openapi-types';

export type GitHubInstallationConfiguration = {
    /**
     * GitHub App installation IDs.
     */
    installation_ids?: string[];
};

export type GitHubRuntimeEnvironment = RuntimeEnvironment<GitHubInstallationConfiguration>;
export type GitHubRuntimeContext = RuntimeContext<GitHubRuntimeEnvironment>;

/**
 * Use Octokit types for all GitHub API objects
 */
export type GitHubRepository = components['schemas']['repository'];
export type GitHubDiscussion = components['schemas']['discussion'];
export type GitHubWebhookPayload = components['schemas']['webhook-discussion-closed'];

interface GitHubDiscussionBaseResponse extends GitHubBaseContentResponse {
    id: string;
    number: GitHubDiscussion['number'];
    title: GitHubDiscussion['title'];
    url: GitHubDiscussion['html_url'];
    isAnswered: boolean;
    createdAt: GitHubDiscussion['created_at'];
}

export interface GitHubDiscussionResponse extends GitHubDiscussionBaseResponse {
    id: string;
    number: GitHubDiscussion['number'];
    title: GitHubDiscussion['title'];
    url: GitHubDiscussion['html_url'];
    isAnswered: boolean;
    createdAt: GitHubDiscussion['created_at'];
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
            nodes: GitHubDiscussionResponse[];
        };
    };
}

export interface GitHubSingleDiscussionResponse {
    repository: {
        discussion: GitHubDiscussionResponse | null;
    };
}

interface GitHubAuthor {
    login: string;
}

interface GitHubRepositoryOwner {
    name: string;
    owner: {
        login: string;
    };
}

interface GitHubBaseContentResponse {
    body: GitHubDiscussion['body'];
    bodyText: string;
    author?: GitHubAuthor;
    authorAssociation: GitHubDiscussion['author_association'];
}

interface GitHubDiscussionComment extends GitHubBaseContentResponse {
    isAnswer: boolean;
    replies: {
        nodes: GitHubBaseContentResponse[];
    };
}
