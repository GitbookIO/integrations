import { Logger } from '@gitbook/runtime';

import {
    GHIssue,
    GHIssueComment,
    GHPullRequest,
    GHPullRequestComment,
    GHRelease,
    GHRepository,
} from './api';
import { GithubRuntimeContext } from './types';

const logger = Logger('github-entities:entities');

function getRepositoryEntityType(context: GithubRuntimeContext) {
    return `${context.environment.integration.name}:repository` as const;
}

function getIssueEntityType(context: GithubRuntimeContext) {
    return `${context.environment.integration.name}:issue` as const;
}

function getIssueCommentEntityType(context: GithubRuntimeContext) {
    return `${context.environment.integration.name}:issue_comment` as const;
}

function getPullRequestEntityType(context: GithubRuntimeContext) {
    return `${context.environment.integration.name}:pull_request` as const;
}

function getPullRequestCommentEntityType(context: GithubRuntimeContext) {
    return `${context.environment.integration.name}:pull_request_comment` as const;
}

function getReleaseEntityType(context: GithubRuntimeContext) {
    return `${context.environment.integration.name}:release` as const;
}

export async function createRepositoryEntity(
    context: GithubRuntimeContext,
    organizationId: string,
    data: GHRepository
) {
    const entityType = getRepositoryEntityType(context);
    const entityId = `${data.id}`;
    try {
        await context.api.orgs.upsertSchemaEntities(organizationId, entityType, {
            entities: [
                {
                    entityId,
                    properties: {
                        url: data.html_url,
                        id: data.id,
                        name: data.full_name,
                        description: data.description || '',
                        private: data.private,
                        created_at: new Date(data.created_at).toISOString(),
                        updated_at: new Date(data.updated_at).toISOString(),
                        pushed_at: new Date(data.pushed_at).toISOString(),
                        default_branch: data.default_branch,
                        language: data.language,
                    },
                },
            ],
        });

        logger.info(`Created repository entity ${entityId} for org: ${organizationId}`);
    } catch (error) {
        logger.error(`Error creating repository entity ${entityId} for org: ${organizationId}`);
    }
}

export async function deleteRepositoryEntity(
    context: GithubRuntimeContext,
    organizationId: string,
    data: GHRepository
) {
    const entityType = getRepositoryEntityType(context);
    const entityId = `${data.id}`;
    await context.api.orgs.upsertSchemaEntities(organizationId, entityType, {
        delete: [entityId],
    });
    logger.info(`Deleted repository entity ${entityId} for org: ${organizationId}`);
}

export async function createPullRequestEntity(
    context: GithubRuntimeContext,
    organizationId: string,
    repositoryId: number,
    data: GHPullRequest
) {
    const entityType = getPullRequestEntityType(context);
    const entityId = `${repositoryId}:${data.number}`;
    try {
        await context.api.orgs.upsertSchemaEntities(organizationId, entityType, {
            entities: [
                {
                    entityId,
                    properties: {
                        url: data.html_url,
                        number: data.number,
                        title: data.title,
                        description: data.body || '',
                        state: data.state,
                        created_at: new Date(data.created_at).toISOString(),
                        updated_at: new Date(data.updated_at).toISOString(),
                        draft: data.draft,
                        head: data.head.ref,
                        base: data.base.ref,
                        repository: {
                            entityId: `${repositoryId}`,
                        },
                    },
                },
            ],
        });

        logger.info(`Created pull request entity ${entityId} for org: ${organizationId}`);
    } catch (error) {
        logger.error(`Error creating pull request entity ${entityId} for org: ${organizationId}`);
    }
}

export async function createPullRequestCommentEntity(
    context: GithubRuntimeContext,
    organizationId: string,
    repositoryId: number,
    pullRequest: number,
    data: GHPullRequestComment
) {
    const entityType = getPullRequestCommentEntityType(context);
    const pullRequestEntityId = `${repositoryId}:${pullRequest}`;
    const entityId = `${pullRequestEntityId}:${data.id}`;
    try {
        await context.api.orgs.upsertSchemaEntities(organizationId, entityType, {
            entities: [
                {
                    entityId,
                    properties: {
                        url: data.html_url,
                        comment: data.body,
                        created_at: new Date(data.created_at).toISOString(),
                        updated_at: new Date(data.updated_at).toISOString(),
                        'reaction_+1': data.reactions['+1'],
                        'reaction_-1': data.reactions['-1'],
                        reaction_laugh: data.reactions.laugh,
                        reaction_confused: data.reactions.confused,
                        reaction_heart: data.reactions.heart,
                        reaction_hooray: data.reactions.hooray,
                        reaction_rocket: data.reactions.rocket,
                        reaction_eyes: data.reactions.eyes,
                        pull_request: {
                            entityId: pullRequestEntityId,
                        },
                    },
                },
            ],
        });

        logger.info(`Created pull request comment entity ${entityId} for org: ${organizationId}`);
    } catch (error) {
        logger.error(
            `Error creating pull request comment entity ${entityId} for org: ${organizationId}`
        );
    }
}

export async function deletePullRequestCommentEntity(
    context: GithubRuntimeContext,
    organizationId: string,
    repositoryId: number,
    pullRequest: number,
    data: GHPullRequestComment
) {
    const entityType = getPullRequestCommentEntityType(context);
    const pullRequestEntityId = `${repositoryId}:${pullRequest}`;
    const entityId = `${pullRequestEntityId}:${data.id}`;
    await context.api.orgs.upsertSchemaEntities(organizationId, entityType, {
        delete: [entityId],
    });

    logger.info(`Deleted pull request comment entity ${entityId} for org: ${organizationId}`);
}

export async function createIssueEntity(
    context: GithubRuntimeContext,
    organizationId: string,
    repositoryId: number,
    data: GHIssue
) {
    const entityType = getIssueEntityType(context);
    const entityId = `${repositoryId}:${data.number}`;
    try {
        await context.api.orgs.upsertSchemaEntities(organizationId, entityType, {
            entities: [
                {
                    entityId,
                    properties: {
                        url: data.html_url,
                        number: data.number,
                        title: data.title,
                        description: data.body || '',
                        state: data.state,
                        created_at: new Date(data.created_at).toISOString(),
                        updated_at: new Date(data.updated_at).toISOString(),
                        repository: {
                            entityId: `${repositoryId}`,
                        },
                    },
                },
            ],
        });

        logger.info(`Created issue entity ${entityId} for org: ${organizationId}`);
    } catch (error) {
        logger.error(`Error creating issue entity ${entityId} for org: ${organizationId}`);
    }
}

export async function deleteIssueEntity(
    context: GithubRuntimeContext,
    organizationId: string,
    repositoryId: number,
    data: GHIssue
) {
    const entityType = getIssueEntityType(context);
    const entityId = `${repositoryId}:${data.number}`;
    await context.api.orgs.upsertSchemaEntities(organizationId, entityType, {
        delete: [entityId],
    });

    logger.info(`Deleted issue entity ${entityId} for org: ${organizationId}`);
}

export async function createIssueCommentEntity(
    context: GithubRuntimeContext,
    organizationId: string,
    repositoryId: number,
    issue: number,
    data: GHIssueComment
) {
    const entityType = getIssueCommentEntityType(context);
    const issueEntityId = `${repositoryId}:${issue}`;
    const entityId = `${issueEntityId}:${data.id}`;
    try {
        await context.api.orgs.upsertSchemaEntities(organizationId, entityType, {
            entities: [
                {
                    entityId,
                    properties: {
                        url: data.html_url,
                        comment: data.body,
                        created_at: new Date(data.created_at).toISOString(),
                        updated_at: new Date(data.updated_at).toISOString(),
                        'reaction_+1': data.reactions['+1'],
                        'reaction_-1': data.reactions['-1'],
                        reaction_laugh: data.reactions.laugh,
                        reaction_confused: data.reactions.confused,
                        reaction_heart: data.reactions.heart,
                        reaction_hooray: data.reactions.hooray,
                        reaction_rocket: data.reactions.rocket,
                        reaction_eyes: data.reactions.eyes,
                        issue: {
                            entityId: `${issueEntityId}`,
                        },
                    },
                },
            ],
        });

        logger.info(`Created issue comment entity ${entityId} for org: ${organizationId}`);
    } catch (error) {
        logger.error(`Error creating issue comment entity ${entityId} for org: ${organizationId}`);
    }
}

export async function deleteIssueCommentEntity(
    context: GithubRuntimeContext,
    organizationId: string,
    repositoryId: number,
    issue: number,
    data: GHIssueComment
) {
    const entityType = getIssueCommentEntityType(context);
    const issueEntityId = `${repositoryId}:${issue}`;
    const entityId = `${issueEntityId}:${data.id}`;
    await context.api.orgs.upsertSchemaEntities(organizationId, entityType, {
        delete: [entityId],
    });

    logger.info(`Deleted issue comment entity ${entityId} for org: ${organizationId}`);
}

export async function createReleaseEntity(
    context: GithubRuntimeContext,
    organizationId: string,
    repositoryId: number,
    data: GHRelease
) {
    const entityType = getReleaseEntityType(context);
    const entityId = `${repositoryId}:${data.id}`;
    try {
        await context.api.orgs.upsertSchemaEntities(organizationId, entityType, {
            entities: [
                {
                    entityId,
                    properties: {
                        url: data.html_url,
                        name: data.name,
                        description: data.body || '',
                        tag_name: data.tag_name,
                        created_at: new Date(data.created_at).toISOString(),
                        draft: data.draft,
                        prerelease: data.prerelease,
                        repository: {
                            entityId: `${repositoryId}`,
                        },
                    },
                },
            ],
        });

        logger.info(`Created release entity ${entityId} for org: ${organizationId}`);
    } catch (error) {
        logger.error(`Error creating release entity ${entityId} for org: ${organizationId}`);
    }
}

export async function deleteReleaseEntity(
    context: GithubRuntimeContext,
    organizationId: string,
    repositoryId: number,
    data: GHRelease
) {
    const entityType = getReleaseEntityType(context);
    const entityId = `${repositoryId}:${data.id}`;
    await context.api.orgs.upsertSchemaEntities(organizationId, entityType, {
        delete: [entityId],
    });

    logger.info(`Deleted release entity ${entityId} for org: ${organizationId}`);
}
