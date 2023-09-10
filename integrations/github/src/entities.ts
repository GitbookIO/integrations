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

const logger = Logger('github:entities');

/**
 * Create the various entity schemas for the installation organization.
 * Ex: issue, pull request, release, etc.
 */
export async function createEntitySchemas(context: GithubRuntimeContext) {
    if (
        context.environment.installation &&
        'organization' in context.environment.installation.target
    ) {
        const organizationId = context.environment.installation.target.organization;
        logger.debug(`Creating entity schemas for org: ${organizationId}`);
        await Promise.all([
            createRepositoryEntitySchema(context, organizationId),
            createReleaseEntitySchema(context, organizationId),
            createIssueEntitySchema(context, organizationId),
            createIssueCommentEntitySchema(context, organizationId),
            createPullRequestEntitySchema(context, organizationId),
            createPullRequestCommentEntitySchema(context, organizationId),
        ]);
    }
}

async function createRepositoryEntitySchema(context: GithubRuntimeContext, organizationId: string) {
    const entityType = getRepositoryEntityType(context);
    await context.api.orgs.setEntitySchema(organizationId, entityType, {
        type: entityType,
        title: {
            singular: 'Repository',
            plural: 'Repositories',
        },
        properties: [
            {
                type: 'url',
                name: 'url',
                title: 'URL',
                role: 'target',
            },
            {
                type: 'number',
                name: 'id',
                title: 'ID',
            },
            {
                type: 'text',
                name: 'name',
                title: 'Name',
                role: 'title',
            },
            {
                type: 'longtext',
                name: 'description',
                title: 'Description',
                role: 'body',
            },
            {
                type: 'user',
                name: 'owner',
                title: 'Owner',
            },
            {
                type: 'boolean',
                name: 'private',
                title: 'Is Private',
            },
            {
                type: 'date',
                name: 'created_at',
                title: 'Created At',
            },
            {
                type: 'date',
                name: 'updated_at',
                title: 'Last Updated',
            },
            {
                type: 'date',
                name: 'pushed_at',
                title: 'Last Pushed',
            },
            {
                type: 'text',
                name: 'default_branch',
                title: 'Default Branch',
            },
            {
                type: 'text',
                name: 'language',
                title: 'Language',
            },
        ],
    });
}

async function createIssueEntitySchema(context: GithubRuntimeContext, organizationId: string) {
    const entityType = getIssueEntityType(context);
    await context.api.orgs.setEntitySchema(organizationId, entityType, {
        type: entityType,
        title: {
            singular: 'Issue',
            plural: 'Issues',
        },
        properties: [
            {
                type: 'url',
                name: 'url',
                title: 'URL',
                role: 'target',
            },
            {
                type: 'number',
                name: 'number',
                title: 'Number',
            },
            {
                type: 'text',
                name: 'title',
                title: 'Title',
                role: 'title',
            },
            {
                type: 'longtext',
                name: 'body',
                title: 'Description',
                role: 'body',
            },
            {
                type: 'enum',
                name: 'state',
                values: [
                    { label: 'Open', value: 'open' },
                    { label: 'Closed', value: 'closed' },
                ],
                title: 'State',
            },
            {
                type: 'user',
                name: 'user',
                title: 'Author',
            },
            {
                type: 'date',
                name: 'created_at',
                title: 'Created At',
            },
            {
                type: 'date',
                name: 'updated_at',
                title: 'Last Updated',
            },
            {
                type: 'relation',
                name: 'repository',
                title: 'Repository',
                entity: {
                    type: getRepositoryEntityType(context),
                },
            },
        ],
    });

    logger.info(`Created ${entityType} entity schema for org: ${organizationId}`);
}

async function createIssueCommentEntitySchema(
    context: GithubRuntimeContext,
    organizationId: string
) {
    const entityType = getIssueCommentEntityType(context);
    await context.api.orgs.setEntitySchema(organizationId, entityType, {
        type: entityType,
        title: {
            singular: 'Issue Comment',
            plural: 'Issue Comments',
        },
        properties: [
            {
                type: 'url',
                name: 'url',
                title: 'URL',
                role: 'target',
            },
            {
                type: 'longtext',
                name: 'body',
                title: 'Comment',
                role: 'body',
            },
            {
                type: 'user',
                name: 'user',
                title: 'Author',
            },
            {
                type: 'date',
                name: 'created_at',
                title: 'Created At',
            },
            {
                type: 'date',
                name: 'updated_at',
                title: 'Last Updated',
            },
            {
                type: 'number',
                name: 'reaction_+1',
                title: 'Reaction +1',
            },
            {
                type: 'number',
                name: 'reaction_-1',
                title: 'Reaction -1',
            },
            {
                type: 'number',
                name: 'reaction_laugh',
                title: 'Reaction Laugh',
            },
            {
                type: 'number',
                name: 'reaction_confused',
                title: 'Reaction Confused',
            },
            {
                type: 'number',
                name: 'reaction_heart',
                title: 'Reaction Heart',
            },
            {
                type: 'number',
                name: 'reaction_hooray',
                title: 'Reaction Hooray',
            },
            {
                type: 'number',
                name: 'reaction_rocket',
                title: 'Reaction Rocket',
            },
            {
                type: 'number',
                name: 'reaction_eyes',
                title: 'Reaction Eyes',
            },
            {
                type: 'relation',
                name: 'issue',
                title: 'Issue',
                entity: {
                    type: getIssueEntityType(context),
                },
            },
        ],
    });

    logger.info(`Created ${entityType} entity schema for org: ${organizationId}`);
}

async function createPullRequestEntitySchema(
    context: GithubRuntimeContext,
    organizationId: string
) {
    const entityType = getPullRequestEntityType(context);
    await context.api.orgs.setEntitySchema(organizationId, entityType, {
        type: entityType,
        title: {
            singular: 'Pull Request',
            plural: 'Pull Requests',
        },
        properties: [
            {
                type: 'url',
                name: 'url',
                title: 'URL',
                role: 'target',
            },
            {
                type: 'number',
                name: 'number',
                title: 'Number',
            },
            {
                type: 'text',
                name: 'title',
                title: 'Title',
                role: 'title',
            },
            {
                type: 'longtext',
                name: 'body',
                title: 'Description',
                role: 'body',
            },
            {
                type: 'enum',
                name: 'state',
                values: [
                    { label: 'Open', value: 'open' },
                    { label: 'Closed', value: 'closed' },
                ],
                title: 'State',
            },
            {
                type: 'user',
                name: 'user',
                title: 'Author',
            },
            {
                type: 'date',
                name: 'created_at',
                title: 'Created At',
            },
            {
                type: 'date',
                name: 'updated_at',
                title: 'Last Updated',
            },
            {
                type: 'boolean',
                name: 'draft',
                title: 'Is Draft',
            },
            {
                type: 'text',
                name: 'head',
                title: 'Branch',
            },
            {
                type: 'text',
                name: 'base',
                title: 'Base Branch',
            },
            {
                type: 'relation',
                name: 'repository',
                title: 'Repository',
                entity: {
                    type: getRepositoryEntityType(context),
                },
            },
        ],
    });

    logger.info(`Created ${entityType} entity schema for org: ${organizationId}`);
}

async function createPullRequestCommentEntitySchema(
    context: GithubRuntimeContext,
    organizationId: string
) {
    const entityType = getPullRequestCommentEntityType(context);
    await context.api.orgs.setEntitySchema(organizationId, entityType, {
        type: entityType,
        title: {
            singular: 'Pull Request Comment',
            plural: 'Pull Request Comments',
        },
        properties: [
            {
                type: 'url',
                name: 'url',
                title: 'URL',
                role: 'target',
            },
            {
                type: 'longtext',
                name: 'body',
                title: 'Comment',
                role: 'body',
            },
            {
                type: 'user',
                name: 'user',
                title: 'Author',
            },
            {
                type: 'date',
                name: 'created_at',
                title: 'Created At',
            },
            {
                type: 'date',
                name: 'updated_at',
                title: 'Last Updated',
            },
            {
                type: 'number',
                name: 'reaction_+1',
                title: 'Reaction +1',
            },
            {
                type: 'number',
                name: 'reaction_-1',
                title: 'Reaction -1',
            },
            {
                type: 'number',
                name: 'reaction_laugh',
                title: 'Reaction Laugh',
            },
            {
                type: 'number',
                name: 'reaction_confused',
                title: 'Reaction Confused',
            },
            {
                type: 'number',
                name: 'reaction_heart',
                title: 'Reaction Heart',
            },
            {
                type: 'number',
                name: 'reaction_hooray',
                title: 'Reaction Hooray',
            },
            {
                type: 'number',
                name: 'reaction_rocket',
                title: 'Reaction Rocket',
            },
            {
                type: 'number',
                name: 'reaction_eyes',
                title: 'Reaction Eyes',
            },
            {
                type: 'relation',
                name: 'pull_request',
                title: 'Pull Request',
                entity: {
                    type: getPullRequestEntityType(context),
                },
            },
        ],
    });

    logger.info(`Created ${entityType} entity schema for org: ${organizationId}`);
}

async function createReleaseEntitySchema(context: GithubRuntimeContext, organizationId: string) {
    const entityType = getReleaseEntityType(context);
    await context.api.orgs.setEntitySchema(organizationId, entityType, {
        type: entityType,
        title: {
            singular: 'Release',
            plural: 'Releases',
        },
        properties: [
            {
                type: 'url',
                name: 'url',
                title: 'URL',
                role: 'target',
            },
            {
                type: 'text',
                name: 'name',
                title: 'Name',
                role: 'title',
            },
            {
                type: 'text',
                name: 'tag_name',
                title: 'Tag',
            },
            {
                type: 'longtext',
                name: 'body',
                title: 'Description',
                role: 'body',
            },
            {
                type: 'date',
                name: 'created_at',
                title: 'Created At',
            },
            {
                type: 'boolean',
                name: 'draft',
                title: 'Is Draft Release',
            },
            {
                type: 'boolean',
                name: 'prerelease',
                title: 'Is Pre-Release',
            },
            {
                type: 'user',
                name: 'author',
                title: 'Author',
            },
            {
                type: 'relation',
                name: 'repository',
                title: 'Repository',
                entity: {
                    type: getRepositoryEntityType(context),
                },
            },
        ],
    });

    logger.info(`Created ${entityType} entity schema for org: ${organizationId}`);
}

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
                    description: data.description,
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

    logger.info(`Created pull request comment entity ${entityId} for org: ${organizationId}`);
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
