import pMap from 'p-map';

import { ExposableError, Logger } from '@gitbook/runtime';
import { GitHubIssuesRuntimeContext } from './types';
import { getGitHubInstallationIds } from './utils';
import {
    AuthorAssociation,
    fetchGitHubReposForInstallation,
    getOctokitClientForInstallation,
    GitHubIssue,
} from './github-api';
import {
    ConversationInput,
    ConversationPartMessage,
    IntegrationInstallation,
    Organization,
} from '@gitbook/api';

const logger = Logger('github-issues:ingest');

/**
 * Trigger an initial ingestion of issues from all of the linked GitHub respositories
 * of a GitBook installation.
 */
export async function triggerInitialGitHubIssuesIngestion(context: GitHubIssuesRuntimeContext) {
    const { installation: gitbookInstallation } = context.environment;
    if (!gitbookInstallation) {
        throw new ExposableError('GitBook installation not found');
    }

    const githubInstallationIds = getGitHubInstallationIds(context);
    if (githubInstallationIds.length === 0) {
        throw new ExposableError('No GitHub App installation IDs found');
    }

    let totalRepoToProcess = 0;
    const pendingTaskPromises: Array<Promise<void>> = [];

    await pMap(
        githubInstallationIds,
        async (githubInstallationId) => {
            try {
                const octokit = await getOctokitClientForInstallation(
                    context,
                    githubInstallationId,
                );
                const repos = await fetchGitHubReposForInstallation(octokit, githubInstallationId);

                if (repos.length === 0) {
                    logger.info(
                        `No GitHub repositories found for installation ${githubInstallationId}. Skipping.`,
                    );
                    return;
                }

                totalRepoToProcess += repos.length;
                for (const repo of repos) {
                    pendingTaskPromises.push(
                        context.integration.queueTask({
                            task: {
                                type: 'ingest:github-repo:closed-issues',
                                payload: {
                                    organization: gitbookInstallation.target.organization,
                                    gitbookInstallationId: gitbookInstallation.id,
                                    githubInstallationId: githubInstallationId,
                                    repository: {
                                        name: repo.name,
                                        owner: repo.owner.login,
                                    },
                                },
                            },
                        }),
                    );
                }
            } catch (err) {
                logger.error(
                    `Error while fetching repositories for installation ${githubInstallationId}`,
                    err,
                );
                return;
            }
        },
        { concurrency: 5 },
    );

    logger.info(
        `Dispatched ${pendingTaskPromises.length} tasks to ingest a total of ${totalRepoToProcess} github repositories`,
    );

    context.waitUntil(Promise.all(pendingTaskPromises));
}

/**
 * Ingest a single GitHub issue as a GitBook conversation.
 */
export async function ingestGitHubIssue(args: {
    organizationId: Organization['id'];
    gitbookInstallationId: IntegrationInstallation['id'];
    issue: GitHubIssue;
    context: GitHubIssuesRuntimeContext;
}) {
    const { organizationId, gitbookInstallationId, issue, context } = args;
    const gitbookConversation = parseGitHubIssueAsGitBookConversation(issue);

    if (!gitbookConversation) {
        logger.info(`Discarded GitHub issues as irrelevant: ${issue.url}`);
        return;
    }

    const installationApiClient = await context.api.createInstallationClient(
        context.environment.integration.name,
        gitbookInstallationId,
    );
    await installationApiClient.orgs.ingestConversation(organizationId, [gitbookConversation]);
}

/**
 * Parse a GitHub issue into GitBook conversation input to be ingested.
 */
function parseGitHubIssueAsGitBookConversation(issue: GitHubIssue): ConversationInput | null {
    // Filter out issues with empty content
    if (issue.body.length === 0 && issue.comments.nodes.length == 0) {
        return null;
    }

    const conversation: ConversationInput = {
        id: issue.id,
        subject: issue.title,
        metadata: {
            url: issue.url,
            attributes: {
                source: 'github-issues',
                repository: `${issue.repository.owner.login}/${issue.repository.name}`,
                issue_number: String(issue.number),
            },
            createdAt: issue.createdAt,
        },
        parts: [
            {
                type: 'message',
                role: determineMessageRole(issue.authorAssociation),
                body: issue.body,
            },
        ],
    };

    for (const comment of issue.comments.nodes) {
        conversation.parts.push({
            type: 'message',
            role: determineMessageRole(comment.authorAssociation),
            body: comment.body,
        });
    }

    return conversation;
}

/**
 * Determine the role of a comment author in the conversation.
 * Uses GitHub's authorAssociation to classify comments as user or team-member.
 */
function determineMessageRole(
    authorAssociation: AuthorAssociation,
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
