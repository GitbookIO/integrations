import { InputPage } from '@gitbook/api';
import * as doc from '@gitbook/document';
import { createContentSource, ExposableError } from '@gitbook/runtime';
import { openapi } from '@scalar/openapi-parser'
import { fetchUrls } from '@scalar/openapi-parser/plugins/fetch-urls';
import { OpenAPIV3 } from '@scalar/openapi-types'
import { getTagTitle } from './utils';

const HTTP_METHODS = [
    OpenAPIV3.HttpMethods.GET,
    OpenAPIV3.HttpMethods.POST,
    OpenAPIV3.HttpMethods.PUT,
    OpenAPIV3.HttpMethods.DELETE,
    OpenAPIV3.HttpMethods.OPTIONS,
    OpenAPIV3.HttpMethods.HEAD,
    OpenAPIV3.HttpMethods.PATCH,
    OpenAPIV3.HttpMethods.TRACE,
];

/** Props passed to the `getRevision` method. */
export type GenerateContentSourceProps = {
    specURL: string;
}

/** Props passed to the `getPageDocument` method. */
export type GenerateContentSourceDocumentProps = GenerateContentSourceProps & {
    group: string;
}

export type GenerateContentSourceDependencies = {
    // TODO: add openapi dependency here
    // spec: ContentRefOpenAPI;
}

/**
 * Content source to generate pages from an OpenAPI specification.
 */
export const generateContentSource = createContentSource<GenerateContentSourceProps | GenerateContentSourceDocumentProps, GenerateContentSourceDependencies>({
    sourceId: 'generate',

    getRevision: async ({ props }, ctx) => {
        const spec = await getOpenAPISpec(props.specURL);
        const groups = divideOpenAPISpec(props, spec);

        return {
            pages: groups.map(group => {
                const documentProps: GenerateContentSourceDocumentProps = {
                    specURL: props.specURL,
                    group: group.id,
                }

                const page: InputPage = {
                    type: 'document',
                    title: (group.tag ? getTagTitle(group.tag) : '') || group.id,
                    icon: group.tag?.['x-page-icon'],
                    description: group.tag?.['x-page-description'] ?? '',
                    computed: {
                        integration: 'openapi',
                        source: 'generate',
                        props: documentProps
                    }
                };

                return page;
            })
        }
    },

    getPageDocument: async ({ props }, ctx) => {
        if (!('group' in props)) {
            throw new Error('Group is required');
        }

        const spec = await getOpenAPISpec(props.specURL);
        const groups = divideOpenAPISpec(props, spec);

        const group = groups.find(g => g.id === props.group);
        if (!group) {
            throw new Error(`Group ${props.group} not found`);
        }

        const operations = extractOperations(group);

        return doc.document([
            // TODO: return or parse the description as markdown
            ...(group.tag?.description ? [doc.paragraph(doc.text(group.tag.description))] : []),
            ...operations.map(operation => {
                return doc.openapi({
                    ref: { url: props.specURL, kind: 'url' },
                    method: operation.method,
                    path: operation.path,
                });
            })
        ]);
    },
});

/**
 * Get the OpenAPI specification from the given URL.
 */
async function getOpenAPISpec(specURL: string) {
    const result = await openapi()
        .load(
            specURL,
            {
                plugins: [fetchUrls({
                    limit: 10,
                })],
            }
        )
        .upgrade()
        .get();

    if (result.errors && result.errors.length > 0) {
        throw new ExposableError(`Failed to parse OpenAPI spec: ${specURL}`);
    }

    return result.specification as OpenAPIV3.Document;
}

interface OpenAPIGroup {
    id: string;
    tag?: OpenAPIV3.TagObject;
    paths: Record<string, OpenAPIV3.PathItemObject>;
}

/**
 * Split the OpenAPI specification into a set of pages
 */
function divideOpenAPISpec(props: GenerateContentSourceProps, spec: OpenAPIV3.Document) {
    const groups: OpenAPIGroup[] = [];
    const groupsIndexById = new Map<string, number>();

    const indexOperation = (
        groupId: string,
        tag: OpenAPIV3.TagObject | undefined,
        path: string,
        pathItem: OpenAPIV3.PathItemObject,
        httpMethod: OpenAPIV3.HttpMethods,
        operation: OpenAPIV3.OperationObject
    ) => {
        const groupIndex = groupsIndexById.get(groupId);
        const group = groupIndex !== undefined ? groups[groupIndex] : {
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

    Object.entries(spec.paths ?? {}).forEach(([path, pathItem]) => {
        if (!pathItem) {
            return;
        }

        HTTP_METHODS.forEach(httpMethod => {
            const operation = pathItem[httpMethod];
            if (!operation) {
                return;
            }

            const firstTag = operation.tags?.[0];
            if (firstTag) {
                const tag = spec.tags?.find(t => t.name === firstTag);
                indexOperation(firstTag, tag, path, pathItem, httpMethod, operation);
            } else {
                indexOperation('default', {
                    id: 'default',
                    name: 'Default',
                }, path, pathItem, httpMethod, operation);
            }
        });
    });

    return groups;
}

/**
 * Extract all operations in a group.
 */
function extractOperations(group: OpenAPIGroup) {
    const operations: Array<{ method: OpenAPIV3.HttpMethods, path: string }> = [];

    Object.entries(group.paths).forEach(([path, pathItem]) => {
        HTTP_METHODS.forEach(httpMethod => {
            const operation = pathItem[httpMethod];
            if (!operation) {
                return;
            }

            operations.push({ method: httpMethod, path });
        });
    }); 

    return operations;
}
