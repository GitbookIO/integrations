import { Octokit } from 'octokit';
import {
    GitHubDiscussion,
    GitHubDiscussionResponse,
    GitHubDiscussionsResponse,
    GitHubSingleDiscussionResponse,
} from './types';
import { ConversationInput, ConversationPartMessage } from '@gitbook/api';

const DISCUSSION_FRAGMENT = `
    fragment DiscussionFields on Discussion {
        id
        number
        title
        body
        bodyText
        url
        createdAt
        author {
            login
        }
        authorAssociation
        comments(first: 50) {
            nodes {
                body
                bodyText
                author {
                    login
                }
                authorAssociation
                isAnswer
                replies(first: 10) {
                    nodes {
                        body
                        bodyText
                        author {
                            login
                        }
                        authorAssociation
                    }
                }
            }
        }
        repository {
            name
            owner {
                login
            }
        }
    }
`;

/**
 * Get discussions for a repository using GraphQL
 */
export async function getRepoDiscussions(
    octokit: Octokit,
    owner: string,
    repo: string,
    after?: string,
    first: number = 20,
    states: string[] = ['CLOSED'],
): Promise<GitHubDiscussionsResponse> {
    const query = `
        ${DISCUSSION_FRAGMENT}
        query getDiscussions($owner: String!, $name: String!, $first: Int!, $after: String, $states: [DiscussionState!]) {
            repository(owner: $owner, name: $name) {
                discussions(first: $first, after: $after, states: $states, orderBy: {field: UPDATED_AT, direction: DESC}) {
                    totalCount
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                    nodes {
                        ...DiscussionFields
                    }
                }
            }
        }
    `;

    const variables = {
        owner,
        name: repo,
        first,
        after,
        states,
    };

    try {
        const response = await octokit.graphql<GitHubDiscussionsResponse>(query, variables);
        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`GitHub GraphQL API error: ${errorMessage}`);
    }
}

/**
 * Get a single discussion by number using GraphQL
 */
export async function getRepoDiscussion(
    octokit: Octokit,
    owner: string,
    repo: string,
    number: number,
): Promise<GitHubSingleDiscussionResponse> {
    const query = `
        ${DISCUSSION_FRAGMENT}
        query getSingleDiscussion($owner: String!, $name: String!, $number: Int!) {
            repository(owner: $owner, name: $name) {
                discussion(number: $number) {
                    ...DiscussionFields
                }
            }
        }
    `;

    const variables = {
        owner,
        name: repo,
        number,
    };

    try {
        const response = await octokit.graphql<GitHubSingleDiscussionResponse>(query, variables);
        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`GitHub GraphQL API error: ${errorMessage}`);
    }
}

/**
 * Parse a GitHub discussion into GitBook conversation format.
 */
export function parseDiscussionAsGitBook(
    discussion: GitHubDiscussionResponse,
): ConversationInput | null {
    const conversation: ConversationInput = {
        id: discussion.id,
        subject: discussion.title,
        metadata: {
            url: discussion.url,
            attributes: {
                source: 'discussions',
                repository: `${discussion.repository.owner.login}/${discussion.repository.name}`,
                discussion_number: String(discussion.number),
            },
            createdAt: discussion.createdAt,
        },
        parts: [
            {
                type: 'message',
                role: determineMessageRole(discussion.authorAssociation),
                body: discussion.bodyText,
            },
        ],
    };

    // Add other comments (excluding the answer which we already added)
    for (const comment of discussion.comments.nodes) {
        conversation.parts.push({
            type: 'message',
            role: determineMessageRole(comment.authorAssociation),
            body: comment.bodyText,
        });

        // Add replies to this comment
        for (const reply of comment.replies.nodes) {
            conversation.parts.push({
                type: 'message',
                role: determineMessageRole(reply.authorAssociation),
                body: reply.bodyText,
            });
        }
    }

    // Filter out conversations with no meaningful content
    if (conversation.parts.length === 0) {
        return null;
    }

    return conversation;
}

/**
 * Determine the role of a comment author in the conversation.
 * Uses GitHub's authorAssociation to classify comments as user or team-member.
 */
function determineMessageRole(
    authorAssociation: GitHubDiscussion['author_association'],
): ConversationPartMessage['role'] {
    switch (authorAssociation) {
        case 'OWNER':
        case 'MEMBER':
        case 'COLLABORATOR':
            return 'team-member';

        default:
            return 'user';
    }
}
