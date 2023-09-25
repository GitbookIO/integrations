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

const logger = Logger('github-lens:entities');

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
    const entityId = `${entityType}:${data.id}`;
    await context.api.orgs.upsertSchemaEntities(organizationId, entityType, {
        entities: [
            {
                entityId,
                properties: {
                    url: data.html_url,
                    id: data.id,
                    name: data.full_name,
                    description: data.description || '',
                    owner: data.owner.login,
                    private: data.private,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                    pushed_at: data.pushed_at,
                    default_branch: data.default_branch,
                    language: data.language,
                },
            },
        ],
    });

    logger.info(`Created repository entity ${entityId} for org: ${organizationId}`);
}

export async function deleteRepositoryEntity(
    context: GithubRuntimeContext,
    organizationId: string,
    data: GHRepository
) {
    const entityType = getRepositoryEntityType(context);
    const entityId = `${entityType}:${data.id}`;
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
    const entityId = `${entityType}:${data.number}`;
    await context.api.orgs.upsertSchemaEntities(organizationId, entityType, {
        entities: [
            {
                entityId,
                properties: {
                    url: data.html_url,
                    number: data.number,
                    title: data.title,
                    body: data.body,
                    state: data.state,
                    user: data.user.login,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                    draft: data.draft,
                    head: data.head.ref,
                    base: data.base.ref,
                    repository: `${getRepositoryEntityType(context)}:${repositoryId}`,
                },
            },
        ],
    });

    logger.info(`Created pull request entity ${entityId} for org: ${organizationId}`);
}

export async function createPullRequestCommentEntity(
    context: GithubRuntimeContext,
    organizationId: string,
    pullRequest: number,
    data: GHPullRequestComment
) {
    const entityType = getPullRequestCommentEntityType(context);
    const entityId = `${entityType}:${data.id}`;
    await context.api.orgs.upsertSchemaEntities(organizationId, entityType, {
        entities: [
            {
                entityId,
                properties: {
                    url: data.html_url,
                    body: data.body,
                    user: data.user.login,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                    'reaction_+1': data.reactions['+1'],
                    'reaction_-1': data.reactions['-1'],
                    reaction_laugh: data.reactions.laugh,
                    reaction_confused: data.reactions.confused,
                    reaction_heart: data.reactions.heart,
                    reaction_hooray: data.reactions.hooray,
                    reaction_rocket: data.reactions.rocket,
                    reaction_eyes: data.reactions.eyes,
                    pull_request: `${getPullRequestEntityType(context)}:${pullRequest}`,
                },
            },
        ],
    });

    logger.info(`Created pull request comment entity ${entityId} for org: ${organizationId}`);
}

export async function deletePullRequestCommentEntity(
    context: GithubRuntimeContext,
    organizationId: string,
    data: GHPullRequestComment
) {
    const entityType = getPullRequestCommentEntityType(context);
    const entityId = `${entityType}:${data.id}`;
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
    const entityId = `${entityType}:${data.number}`;
    await context.api.orgs.upsertSchemaEntities(organizationId, entityType, {
        entities: [
            {
                entityId,
                properties: {
                    url: data.html_url,
                    number: data.number,
                    title: data.title,
                    body: data.body,
                    state: data.state,
                    user: data.user.login,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                    repository: `${getRepositoryEntityType(context)}:${repositoryId}`,
                },
            },
        ],
    });

    logger.info(`Created issue entity ${entityId} for org: ${organizationId}`);
}

export async function deleteIssueEntity(
    context: GithubRuntimeContext,
    organizationId: string,
    data: GHIssue
) {
    const entityType = getIssueEntityType(context);
    const entityId = `${entityType}:${data.number}`;
    await context.api.orgs.upsertSchemaEntities(organizationId, entityType, {
        delete: [entityId],
    });

    logger.info(`Deleted issue entity ${entityId} for org: ${organizationId}`);
}

export async function createIssueCommentEntity(
    context: GithubRuntimeContext,
    organizationId: string,
    issue: number,
    data: GHIssueComment
) {
    const entityType = getIssueCommentEntityType(context);
    const entityId = `${entityType}:${data.id}`;
    await context.api.orgs.upsertSchemaEntities(organizationId, entityType, {
        entities: [
            {
                entityId,
                properties: {
                    url: data.html_url,
                    body: data.body,
                    user: data.user.login,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                    'reaction_+1': data.reactions['+1'],
                    'reaction_-1': data.reactions['-1'],
                    reaction_laugh: data.reactions.laugh,
                    reaction_confused: data.reactions.confused,
                    reaction_heart: data.reactions.heart,
                    reaction_hooray: data.reactions.hooray,
                    reaction_rocket: data.reactions.rocket,
                    reaction_eyes: data.reactions.eyes,
                    issue: `${getIssueCommentEntityType(context)}:${issue}`,
                },
            },
        ],
    });

    logger.info(`Created issue comment entity ${entityId} for org: ${organizationId}`);
}

export async function deleteIssueCommentEntity(
    context: GithubRuntimeContext,
    organizationId: string,
    data: GHIssueComment
) {
    const entityType = getIssueCommentEntityType(context);
    const entityId = `${entityType}:${data.id}`;
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
    const entityId = `${entityType}:${data.id}`;
    await context.api.orgs.upsertSchemaEntities(organizationId, entityType, {
        entities: [
            {
                entityId,
                properties: {
                    url: data.html_url,
                    name: data.name,
                    tag_name: data.tag_name,
                    body: data.body,
                    created_at: data.created_at,
                    draft: data.draft,
                    prerelease: data.prerelease,
                    repository: `${getRepositoryEntityType(context)}:${repositoryId}`,
                },
            },
        ],
    });

    logger.info(`Created release entity ${entityId} for org: ${organizationId}`);
}

export async function deleteReleaseEntity(
    context: GithubRuntimeContext,
    organizationId: string,
    data: GHRelease
) {
    const entityType = getReleaseEntityType(context);
    const entityId = `${entityType}:${data.id}`;
    await context.api.orgs.upsertSchemaEntities(organizationId, entityType, {
        delete: [entityId],
    });

    logger.info(`Deleted release entity ${entityId} for org: ${organizationId}`);
}
