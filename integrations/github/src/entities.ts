import { Logger } from '@gitbook/runtime';

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
            createReleaseEntitySchema(context, organizationId),
            createIssueEntitySchema(context, organizationId),
            createIssueCommentEntitySchema(context, organizationId),
            createPullRequestEntitySchema(context, organizationId),
            createPullRequestCommentEntitySchema(context, organizationId),
        ]);
    }
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
                type: 'text',
                name: 'repository',
                title: 'Repository',
            },
            {
                type: 'url',
                name: 'repository_url',
                title: 'Repository URL',
            },
        ],
    });

    logger.info(`Created ${entityType} entity schema for org: ${organizationId}`);
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
                type: 'text',
                name: 'repository',
                title: 'Issue Repository',
            },
            {
                type: 'url',
                name: 'repository_url',
                title: 'Issue Repository URL',
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
                type: 'text',
                name: 'repository',
                title: 'Pull Request Repository',
            },
            {
                type: 'url',
                name: 'repository_url',
                title: 'Pull Request Repository URL',
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

function getReleaseEntityType(context: GithubRuntimeContext) {
    return `${context.environment.integration.name}:release` as const;
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
