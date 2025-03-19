import { ExposableError } from '@gitbook/runtime';
import { dereference, type OpenAPIV3, shouldIgnoreEntity } from '@gitbook/openapi-parser';
import { GitBookAPI, type JSONDocument } from '@gitbook/api';
import { getDereferencedSchema } from './dereference';

export type OpenAPISpecContent = {
    schema: OpenAPIV3.Document;
    url: string;
    slug: string;
};

/**
 * Get the latest OpenAPI spec content from the OpenAPI spec.
 */
export async function getLatestOpenAPISpecContent(args: {
    openAPISpec: {
        object: 'openapi-spec';
        id: string;
        slug: string;
        lastVersion?: string;
    };
    api: GitBookAPI;
    organizationId: string;
}): Promise<OpenAPISpecContent> {
    const { openAPISpec, api, organizationId } = args;

    if (!openAPISpec.lastVersion) {
        throw new ExposableError('No version found for spec');
    }

    const { data: content } = await api.orgs.getOpenApiSpecVersionContentById(
        organizationId,
        openAPISpec.slug,
        openAPISpec.lastVersion,
    );

    const schema = await getDereferencedSchema(content.filesystem);

    return {
        schema,
        url: content.url,
        slug: openAPISpec.slug,
    };
}
