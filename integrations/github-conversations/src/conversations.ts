import { ConversationInput } from '@gitbook/api';
import { ExposableError, Logger } from '@gitbook/runtime';
import { Octokit } from 'octokit';
import { getOctokitClient, getInstallationAccessToken, getGitHubAppConfig } from './client';
import {
    GitHubRuntimeContext,
    GitHubDiscussion,
    GitHubDiscussionComment,
    GitHubRepository,
    GitHubDiscussionsResponse,
    GitHubWebhookDiscussion,
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

    const octokit = await getOctokitClient(context);

    // Get repositories with discussions enabled that the GitHub App installation has access to
    const repositories = await fetchRepositoriesWithDiscussions(context);

    if (repositories.length === 0) {
        logger.info('No repositories with discussions found for this GitHub App installation');
        return;
    }

    let totalProcessed = 0;
    let totalApiCalls = 0;
    const MAX_API_CALLS = 950; // CF worker subrequest limit + some buffer

    logger.info(`Discussion ingestion started for ${repositories.length} repositories`);

    // Process repositories sequentially to better control API usage
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
                    10,
                );

                totalApiCalls++;
                logger.debug(`API call ${totalApiCalls}/${MAX_API_CALLS} for ${repo.full_name}`);

                const discussions = discussionsResponse.repository.discussions.nodes;
                hasNextPage = discussionsResponse.repository.discussions.pageInfo.hasNextPage;
                cursor = discussionsResponse.repository.discussions.pageInfo.endCursor;

                if (discussions.length === 0) {
                    break;
                }

                // Convert GitHub discussions to GitBook conversations
                const gitbookConversations = discussions
                    .map((discussion) => parseDiscussionAsGitBook(discussion))
                    .filter(
                        (conversation): conversation is ConversationInput => conversation !== null,
                    );

                // Ingest conversations to GitBook
                if (gitbookConversations.length > 0) {
                    try {
                        await context.api.orgs.ingestConversation(
                            installation.target.organization,
                            gitbookConversations,
                        );
                        repoProcessed += gitbookConversations.length;
                        logger.info(
                            `Successfully ingested ${gitbookConversations.length} discussions from ${repo.full_name}`,
                        );
                    } catch (error) {
                        logger.error(
                            `Failed to ingest ${gitbookConversations.length} discussions from ${repo.full_name}: ${error}`,
                        );
                    }
                }

                // Rate limiting: small delay between pages
                if (hasNextPage && totalApiCalls < MAX_API_CALLS) {
                    await new Promise((resolve) => setTimeout(resolve, 50)); // Reduced delay
                }
            }

            totalProcessed += repoProcessed;
            logger.info(`Processed ${repoProcessed} discussions from ${repo.full_name}`);
        } catch (error) {
            logger.error(`Failed to process repository ${repo.full_name}: ${error}`);
        }
    }

    logger.info(
        `Discussion ingestion completed. Processed ${totalProcessed} discussions total using ${totalApiCalls} API calls`,
    );
}

/**
 * Fetch repositories with discussions that the GitHub App installation has access to
 */
async function fetchRepositoriesWithDiscussions(
    context: GitHubRuntimeContext,
): Promise<GitHubRepository[]> {
    const { installation } = context.environment;
    if (!installation) {
        throw new ExposableError('Installation not found');
    }

    const { installation_id } = installation.configuration;
    if (!installation_id) {
        throw new ExposableError('GitHub App installation ID not found');
    }

    logger.info('Fetching enabled repositories for GitHub App installation', {
        installationId: installation_id,
    });

    try {
        const octokit = await getOctokitClient(context);
        const response = await octokit.request('GET /installation/repositories', {
            per_page: 100,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });

        const repositories = response.data.repositories as GitHubRepository[];

        logger.info('Successfully fetched enabled repositories', {
            installationId: installation_id,
            repositoryCount: repositories.length,
        });

        return repositories.filter((repo) => repo.has_discussions);
    } catch (error) {
        logger.error('Failed to fetch enabled repositories', {
            installationId: installation_id,
            error: error instanceof Error ? error.message : String(error),
        });
        throw error;
    }
}

/**
 * Get discussions for a repository using GraphQL
 */
async function getDiscussions(
    octokit: Octokit,
    owner: string,
    repo: string,
    after?: string,
    first: number = 10,
    states: string[] = ['CLOSED'],
): Promise<GitHubDiscussionsResponse> {
    const query = `
        query getDiscussions($owner: String!, $name: String!, $first: Int!, $after: String, $states: [DiscussionState!]) {
            repository(owner: $owner, name: $name) {
                discussions(first: $first, after: $after, states: $states, orderBy: {field: UPDATED_AT, direction: DESC}) {
                    totalCount
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                    nodes {
                        id
                        number
                        title
                        body
                        bodyHTML
                        bodyText
                        url
                        createdAt
                        updatedAt
                        author {
                            login
                            ... on User {
                                avatarUrl
                            }
                        }
                        category {
                            id
                            name
                            description
                            emoji
                            isAnswerable
                        }
                        answer {
                            id
                            body
                            bodyHTML
                            bodyText
                            createdAt
                            author {
                                login
                                ... on User {
                                    avatarUrl
                                }
                            }
                        }
                        isAnswered
                        comments(first: 20) {
                            totalCount
                            nodes {
                                id
                                body
                                bodyHTML
                                bodyText
                                createdAt
                                updatedAt
                                author {
                                    login
                                    ... on User {
                                        avatarUrl
                                    }
                                }
                                isAnswer
                                replies(first: 3) {
                                    totalCount
                                    nodes {
                                        id
                                        body
                                        bodyHTML
                                        bodyText
                                        createdAt
                                        updatedAt
                                        author {
                                            login
                                            ... on User {
                                                avatarUrl
                                            }
                                        }
                                        isAnswer
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
 * Parse a GitHub discussion into GitBook conversation format.
 */
export function parseDiscussionAsGitBook(discussion: GitHubDiscussion): ConversationInput | null {
    try {
        const conversation: ConversationInput = {
            id: `github-${discussion.repository?.owner?.login || 'unknown'}-${discussion.repository?.name || 'unknown'}-${discussion.number || 'unknown'}`,
            subject: discussion.title || 'Untitled Discussion',
            metadata: {
                url: discussion.url,
                attributes: {
                    source: 'github',
                    repository:
                        discussion.repository?.owner?.login + '/' + discussion.repository?.name,
                    discussion_number: discussion.number?.toString() || '',
                    category: discussion.category?.name || '',
                    category_emoji: discussion.category?.emoji || '',
                    is_answered: discussion.isAnswered?.toString() || 'false',
                    answer_chosen_at: discussion.answer?.createdAt || '',
                },
                createdAt: discussion.createdAt,
            },
            parts: [],
        };

        // Add the main discussion post
        if (discussion.body?.trim()) {
            conversation.parts.push({
                type: 'message',
                role: 'user',
                body: discussion.bodyText || discussion.body,
            });
        }

        // Add the chosen answer first (if available)
        if (discussion.answer) {
            conversation.parts.push({
                type: 'message',
                role: 'assistant',
                body: discussion.answer.bodyText || discussion.answer.body,
            });
        }

        // Add other comments (excluding the answer which we already added)
        for (const comment of discussion.comments.nodes) {
            if (comment.isAnswer) {
                continue; // Skip the answer, we already added it above
            }

            if (comment.body?.trim()) {
                conversation.parts.push({
                    type: 'message',
                    role: determineCommentRole(comment, discussion),
                    body: comment.bodyText || comment.body,
                });
            }

            // Add replies to this comment
            for (const reply of comment.replies.nodes) {
                if (reply.body?.trim()) {
                    conversation.parts.push({
                        type: 'message',
                        role: determineCommentRole(reply, discussion),
                        body: reply.bodyText || reply.body,
                    });
                }
            }
        }

        // Filter out conversations with no meaningful content
        if (conversation.parts.length === 0) {
            return null;
        }

        return conversation;
    } catch (error) {
        logger.error(`Failed to parse discussion ${discussion?.id || 'unknown'}`, {
            error: error instanceof Error ? error.message : String(error),
            discussionTitle: discussion?.title,
            discussionNumber: discussion?.number,
            hasRepository: !!discussion?.repository,
            hasCategory: !!discussion?.category,
            isAnswered: discussion?.isAnswered,
        });
        return null;
    }
}

/**
 * Determine the role of a comment author in the conversation.
 * This is a heuristic to classify comments as user questions or assistant responses.
 */
function determineCommentRole(
    comment: GitHubDiscussionComment,
    discussion: GitHubDiscussion,
): 'user' | 'assistant' {
    // If it's marked as an answer, treat as assistant
    if (comment.isAnswer) {
        return 'assistant';
    }

    // If the comment author is the same as the discussion author, treat as user
    if (comment.author?.login === discussion.author?.login) {
        return 'user';
    }

    // If the comment author is a maintainer/collaborator (we can't easily detect this from the API),
    // we could treat it as assistant, but for now we'll use a simple heuristic:
    // Comments that are longer or contain certain patterns might be more likely to be helpful responses
    const commentLength = comment.bodyText?.length || comment.body?.length || 0;
    const hasCodeBlocks = /```/.test(comment.body || '');
    const hasLinks = /https?:\/\//.test(comment.body || '');
    const hasAtMentions = /@\w+/.test(comment.body || '');

    // Heuristic: longer comments with code/links/mentions are more likely to be helpful responses
    if (commentLength > 200 && (hasCodeBlocks || hasLinks || hasAtMentions)) {
        return 'assistant';
    }

    // Default to user for shorter comments or follow-up questions
    return 'user';
}

/**
 * Parse a GitHub webhook discussion into GitBook conversation format.
 * This handles the webhook payload structure which is different from GraphQL.
 */
export function parseWebhookDiscussionAsGitBook(
    discussion: GitHubWebhookDiscussion,
    repositoryFullName: string,
): ConversationInput | null {
    try {
        const conversation: ConversationInput = {
            id: `github-${repositoryFullName.replace('/', '-')}-${discussion.number}`,
            subject: discussion.title || 'Untitled Discussion',
            metadata: {
                url: discussion.html_url,
                attributes: {
                    source: 'github',
                    repository: repositoryFullName,
                    discussion_number: discussion.number.toString(),
                    category: discussion.category?.name || '',
                    category_emoji: discussion.category?.emoji || '',
                    is_answered: discussion.answer_chosen_at ? 'true' : 'false',
                    answer_chosen_at: discussion.answer_chosen_at || '',
                },
                createdAt: discussion.created_at,
            },
            parts: [],
        };

        // Add the main discussion post
        if (discussion.body?.trim()) {
            conversation.parts.push({
                type: 'message',
                role: 'user',
                body: discussion.body.trim(),
            });
        }

        // For webhook discussions, we don't have the full comment data
        // We'll need to fetch comments separately if needed, or just work with the main discussion
        // Since this is triggered on "closed", we'll just convert the main discussion for now

        // Filter out conversations with no meaningful content
        if (conversation.parts.length === 0) {
            return null;
        }

        return conversation;
    } catch (error) {
        logger.error(`Failed to parse webhook discussion ${discussion?.number || 'unknown'}`, {
            error: error instanceof Error ? error.message : String(error),
            discussionTitle: discussion?.title,
            discussionNumber: discussion?.number,
            isAnswered: discussion?.answer_chosen_at ? 'true' : 'false',
            repositoryFullName,
        });
        return null;
    }
}
