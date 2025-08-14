import { ConversationInput } from '@gitbook/api';
import { ExposableError, Logger } from '@gitbook/runtime';
import pMap from 'p-map';
import { getGitHubClient } from './client';
import { GitHubRuntimeContext, GitHubDiscussion, GitHubDiscussionComment } from './types';

const logger = Logger('github-conversations');

/**
 * Ingest closed discussions from GitHub repositories.
 */
export async function ingestConversations(context: GitHubRuntimeContext) {
    const { installation } = context.environment;
    if (!installation) {
        throw new ExposableError('Installation not found');
    }

    const gitHubClient = await getGitHubClient(context);

    // For now, we'll get all repositories with discussions enabled for the authenticated user
    // In the future, this can be made configurable through the UI
    const repositories = await gitHubClient.getRepositories();

    if (repositories.length === 0) {
        logger.info('No repositories with discussions found');
        return;
    }

    let totalProcessed = 0;

    logger.info(`Discussion ingestion started for ${repositories.length} repositories`);

    // Process each repository
    await pMap(
        repositories,
        async (repo) => {
            try {
                let hasNextPage = true;
                let cursor: string | undefined;
                let repoProcessed = 0;

                while (hasNextPage) {
                    const discussionsResponse = await gitHubClient.getDiscussions(
                        repo.owner.login,
                        repo.name,
                        cursor,
                        50, // Smaller page size to avoid rate limits
                    );

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
                    if (hasNextPage) {
                        await new Promise((resolve) => setTimeout(resolve, 100));
                    }
                }

                totalProcessed += repoProcessed;
                logger.info(`Processed ${repoProcessed} discussions from ${repo.full_name}`);
            } catch (error) {
                logger.error(`Failed to process repository ${repo.full_name}: ${error}`);
            }
        },
        {
            concurrency: 2, // Process repositories concurrently but with limit
        },
    );

    logger.info(`Discussion ingestion completed. Processed ${totalProcessed} discussions total`);
}

/**
 * Parse a GitHub discussion into GitBook conversation format.
 */
export function parseDiscussionAsGitBook(discussion: GitHubDiscussion): ConversationInput | null {
    try {
        const conversation: ConversationInput = {
            id: `github-${discussion.repository.owner.login}-${discussion.repository.name}-${discussion.number}`,
            subject: discussion.title,
            metadata: {
                url: discussion.url,
                attributes: {
                    source: 'github',
                    repository:
                        discussion.repository.owner.login + '/' + discussion.repository.name,
                    discussion_number: discussion.number.toString(),
                    category: discussion.category.name,
                    category_emoji: discussion.category.emoji,
                    is_answered: discussion.isAnswered.toString(),
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
        logger.error(`Failed to parse discussion ${discussion.id}: ${error}`);
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
