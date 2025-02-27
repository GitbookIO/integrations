import { ExposableError } from '@gitbook/runtime';
import { dereference, type OpenAPIV3 } from '@gitbook/openapi-parser';
import { GitBookAPI, OpenAPISpec } from '@gitbook/api';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'options' | 'head' | 'patch' | 'trace';

const HTTP_METHODS: HttpMethod[] = [
    'get',
    'post',
    'put',
    'delete',
    'options',
    'head',
    'patch',
    'trace',
];

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

    const schema = await dereferenceOpenAPISpec(content.filesystem);

    return {
        schema,
        url: content.url,
        slug: openAPISpec.slug,
    };
}

/**
 * Dereference the OpenAPI and return the schema.
 */
export async function dereferenceOpenAPISpec(
    args: Parameters<typeof dereference>['0'],
): Promise<OpenAPIV3.Document> {
    const dereferenceResult = await dereference(args);

    if (!dereferenceResult.schema) {
        throw new ExposableError('Failed to dereference OpenAPI spec');
    }

    return dereferenceResult.schema as OpenAPIV3.Document;
}

export interface OpenAPIGroup {
    id: string;
    tag?: OpenAPIV3.TagObject;
    paths: Record<string, OpenAPIV3.PathItemObject>;
}

/**
 * Split the OpenAPI specification schema into a set of groups.
 */
export function divideOpenAPISpecSchema(schema: OpenAPIV3.Document): OpenAPIGroup[] {
    const groups: OpenAPIGroup[] = [];
    const groupsIndexById = new Map<string, number>();

    const indexOperation = (
        groupId: string,
        tag: OpenAPIV3.TagObject | undefined,
        path: string,
        pathItem: OpenAPIV3.PathItemObject,
        httpMethod: HttpMethod,
        operation: OpenAPIV3.OperationObject,
    ) => {
        const groupIndex = groupsIndexById.get(groupId);
        const group =
            groupIndex !== undefined
                ? groups[groupIndex]
                : {
                      id: groupId,
                      tag,
                      paths: {},
                  };

        group.paths[path] = group.paths[path] ?? pathItem;
        group.paths[path][httpMethod] = operation;

        if (groupIndex === undefined) {
            groupsIndexById.set(groupId, groups.length);
            groups.push(group);
        }
    };

    Object.entries(schema.paths ?? {}).forEach(([path, pathItem]) => {
        if (!pathItem) {
            return;
        }

        HTTP_METHODS.forEach((httpMethod) => {
            const operation = pathItem[httpMethod];
            if (!operation) {
                return;
            }

            const firstTag = operation.tags?.[0] ?? 'default';
            const tag = schema.tags?.find((t) => t.name === firstTag);
            indexOperation(firstTag, tag, path, pathItem, httpMethod, operation);
        });
    });

    return groups;
}

export type OpenAPIOperation = {
    method: HttpMethod;
    path: string;
};

/**
 * Extract all operations from a group.
 */
export function extractGroupOperations(group: OpenAPIGroup): OpenAPIOperation[] {
    const operations: OpenAPIOperation[] = [];

    Object.entries(group.paths).forEach(([path, pathItem]) => {
        HTTP_METHODS.forEach((httpMethod) => {
            const operation = pathItem[httpMethod];
            if (!operation) {
                return;
            }

            operations.push({ method: httpMethod, path });
        });
    });

    return operations;
}
