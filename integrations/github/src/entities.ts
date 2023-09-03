import { Logger } from '@gitbook/runtime';

import { GithubRuntimeContext } from './types';

const logger = Logger('github:entities');

export async function createReleaseEntitySchema(
    context: GithubRuntimeContext,
    organizationId: string
) {
    logger.info(`Creating release entity schema for org: ${organizationId}`);
    const { api, environment } = context;
    const entityType = `${environment.integration.name}:release`;
    await api.orgs.setEntitySchema(organizationId, entityType, {
        type: entityType,
        title: {
            singular: 'Release',
            plural: 'Releases',
        },
        properties: [
            {
                type: 'url',
                name: 'html_url',
                title: 'Release URL',
                role: 'target',
            },
            {
                type: 'text',
                name: 'name',
                title: 'Release Name',
                role: 'title',
            },
            {
                type: 'text',
                name: 'tag_name',
                title: 'Release Tag',
            },
            {
                type: 'longtext',
                name: 'body',
                title: 'Release Description',
                role: 'body',
            },
            {
                type: 'date',
                name: 'created_at',
                title: 'Release Date',
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
                title: 'Release Author',
            },
        ],
    });
}
