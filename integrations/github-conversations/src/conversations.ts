import { ConversationInput, ConversationPartMessage } from '@gitbook/api';
import { ExposableError, Logger } from '@gitbook/runtime';
import { Octokit } from 'octokit';
import { getOctokitClient } from './client';
import {
    GitHubRuntimeContext,
    GitHubDiscussion,
    GitHubRepository,
    GitHubDiscussionsResponse,
    GitHubSingleDiscussionResponse,
    CommentAuthorAssociation,
} from './types';

const logger = Logger('github-conversations');

/**
 * Ingest closed discussions from GitHub repositories.
 */
export async function ingestConversations(context: GitHubRuntimeContext) {
    const { installation } = context.environment;
    if (!installation) {
        throw new ExposableError('Installation not found');
    }

    const installationIds = getInstallationIds(context);
    if (installationIds.length === 0) {
        throw new ExposableError('No GitHub App installation IDs found');
    }

    let totalProcessed = 0;
    let totalApiCalls = 0;
    const MAX_API_CALLS = 950; // CF worker subrequest limit + some buffer

    logger.info(`Discussion ingestion started for ${installationIds.length} GitHub installations`);

    // Process each GitHub installation separately
    for (const installationId of installationIds) {
        if (totalApiCalls >= MAX_API_CALLS) {
            logger.error(`Reached API call limit (${MAX_API_CALLS}), stopping ingestion`);
            break;
        }

        logger.info(`Processing GitHub installation: ${installationId}`);

        try {
            // Get Octokit client for this specific installation
            const octokit = await getOctokitClient(context, installationId);

            // Get repositories with discussions enabled for this installation
            const repositories = await fetchRepositoriesForInstallation(context, installationId);

            if (repositories.length === 0) {
                logger.info(
                    `No repositories with discussions found for installation ${installationId}`,
                );
                continue;
            }

            logger.info(
                `Found ${repositories.length} repositories with discussions for installation ${installationId}`,
            );

            // Process repositories for this installation
            for (const repo of repositories) {
                if (totalApiCalls >= MAX_API_CALLS) {
                    logger.error(`Reached API call limit (${MAX_API_CALLS}), stopping ingestion`);
                    break;
                }

                try {
                    let hasNextPage = true;
                    let cursor: string | undefined;
                    let repoProcessed = 0;

                    while (hasNextPage && totalApiCalls < MAX_API_CALLS) {
                        const discussionsResponse = await getDiscussions(
                            octokit,
                            repo.owner.login,
                            repo.name,
                            cursor,
                            20,
                        );

                        totalApiCalls++;

                        const discussions = discussionsResponse.repository.discussions.nodes;
                        hasNextPage =
                            discussionsResponse.repository.discussions.pageInfo.hasNextPage;
                        cursor = discussionsResponse.repository.discussions.pageInfo.endCursor;

                        if (discussions.length === 0) {
                            break;
                        }

                        // Convert GitHub discussions to GitBook conversations
                        const gitbookConversations = discussions
                            .map((discussion) => parseDiscussionAsGitBook(discussion))
                            .filter(
                                (conversation): conversation is ConversationInput =>
                                    conversation !== null,
                            );

                        // Ingest conversations to GitBook
                        if (gitbookConversations.length > 0) {
                            try {
                                await context.api.orgs.ingestConversation(
                                    installation.target.organization,
                                    gitbookConversations,
                                );
                                repoProcessed += gitbookConversations.length;
                            } catch (error) {
                                logger.error(
                                    `Failed to ingest ${gitbookConversations.length} discussions from ${repo.full_name}: ${error}`,
                                );
                            }
                        }

                        // Rate limiting: small delay between pages
                        if (hasNextPage && totalApiCalls < MAX_API_CALLS) {
                            await new Promise((resolve) => setTimeout(resolve, 50));
                        }
                    }

                    totalProcessed += repoProcessed;
                    logger.info(`Processed ${repoProcessed} discussions from ${repo.full_name}`);
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    logger.error(`Failed to process repository ${repo.full_name}: ${errorMessage}`);
                }
            }
        } catch (error) {
            logger.error(`Failed to process installation ${installationId}: ${error}`);
        }
    }

    logger.info(
        `Discussion ingestion completed. Processed ${totalProcessed} discussions total using ${totalApiCalls} API calls from ${installationIds.length} installations`,
    );
}

/**
 * Get all GitHub installation IDs from configuration
 */
function getInstallationIds(context: GitHubRuntimeContext): string[] {
    const { installation } = context.environment;
    if (!installation) {
        return [];
    }

    return installation.configuration.installation_ids || [];
}

/**
 * Fetch repositories with discussions from a specific GitHub App installation
 */
async function fetchRepositoriesForInstallation(
    context: GitHubRuntimeContext,
    installationId: string,
): Promise<GitHubRepository[]> {
    try {
        const octokit = await getOctokitClient(context, installationId);
        const response = await octokit.request('GET /installation/repositories', {
            per_page: 100,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });

        const repositories = response.data.repositories as GitHubRepository[];

        return repositories.filter((repo) => repo.has_discussions);
    } catch (error) {
        logger.error('Failed to fetch enabled repositories', {
            installationId,
            error: error instanceof Error ? error.message : String(error),
        });
        return []; // Return empty array instead of throwing to allow other installations to work
    }
}

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
        isAnswered
        answer {
            body
            bodyText
            authorAssociation
        }
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
async function getDiscussions(
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
export async function getSingleDiscussion(
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
export function parseDiscussionAsGitBook(discussion: GitHubDiscussion): ConversationInput | null {
    const conversation: ConversationInput = {
        id: discussion.id,
        subject: discussion.title,
        metadata: {
            url: discussion.url,
            attributes: {
                source: 'discussions',
                repository: `${discussion.repository.owner.login}/${discussion.repository.name}`,
                discussion_number: String(discussion.number),
                is_answered: String(discussion.isAnswered ?? false),
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
    authorAssociation: CommentAuthorAssociation,
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
