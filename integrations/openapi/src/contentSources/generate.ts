import type {
    ContentRefOpenAPI,
    DocumentBlocksTopLevels,
    InputPage,
    JSONDocument,
} from '@gitbook/api';
import * as doc from '@gitbook/document';
import {
    type ContentSourceDependenciesValueFromRef,
    ContentSourceInput,
    createContentSource,
    ExposableError,
} from '@gitbook/runtime';
import { dereference, type OpenAPIV3 } from '@gitbook/openapi-parser';
import { assertNever, getTagTitle, improveTagName } from './utils';
import type { OpenAPIRuntimeContext } from '../types';

const HTTP_METHODS = [
    'get',
    'post',
    'put',
    'delete',
    'options',
    'head',
    'patch',
    'trace',
] as OpenAPIV3.HttpMethods[]; // @TODO expose enum in @gitbook/openapi-parser

type GetRevisionProps = {
    /**
     * Should a models page be generated?
     * @default true
     */
    models?: boolean;
};

type GenerateGroupPageProps = {
    doc: 'operations';
    group: string;
};

type GenerateModelsPageProps = {
    doc: 'models';
};

type GetPageDocumentProps = GenerateGroupPageProps | GenerateModelsPageProps;

export type GenerateContentSourceDependencies = {
    spec: { ref: ContentRefOpenAPI };
};

/**
 * Content source to generate pages from an OpenAPI specification.
 */
export const generateContentSource = createContentSource<
    GetRevisionProps,
    GetPageDocumentProps,
    GenerateContentSourceDependencies
>({
    sourceId: 'generate',

    getRevision: async ({ props, dependencies }, ctx) => {
        const spec = await getOpenAPISpec(dependencies, ctx);
        const groups = divideOpenAPISpec(spec.schema);

        const groupPages = groups.map((group) => {
            const documentProps: GenerateGroupPageProps = {
                doc: 'operations',
                group: group.id,
            };

            const page: InputPage = {
                type: 'document',
                title: (group.tag ? getTagTitle(group.tag) : '') || improveTagName(group.id),
                icon: group.tag?.['x-page-icon'],
                description: group.tag?.['x-page-description'] ?? '',
                computed: {
                    integration: 'openapi',
                    source: 'generate',
                    props: documentProps,
                    dependencies: {
                        spec: {
                            ref: { kind: 'openapi' as const, spec: spec.slug },
                        },
                    },
                },
            };

            return page;
        });

        return {
            pages: [
                ...groupPages,
                ...(props.models
                    ? [
                          {
                              type: 'document' as const,
                              title: 'Models',
                              computed: {
                                  integration: 'openapi',
                                  source: 'generate',
                                  props: { doc: 'models' },
                                  dependencies: {
                                      spec: {
                                          ref: { kind: 'openapi' as const, spec: spec.slug },
                                      },
                                  },
                              },
                          },
                      ]
                    : []),
            ],
        };
    },

    getPageDocument: async ({ props, dependencies }, ctx) => {
        switch (props.doc) {
            case 'operations':
                return generateGroupDocument({ props, dependencies }, ctx);
            case 'models':
                return generateModelsDocument({ props, dependencies }, ctx);
            default:
                assertNever(props);
        }
    },
});

/**
 * Generate a document for a group in the OpenAPI specification.
 */
async function generateGroupDocument(
    input: ContentSourceInput<GenerateGroupPageProps, GenerateContentSourceDependencies>,
    ctx: OpenAPIRuntimeContext,
) {
    const { props, dependencies } = input;
    const spec = await getOpenAPISpec(dependencies, ctx);
    const groups = divideOpenAPISpec(spec.schema);

    const group = groups.find((g) => g.id === props.group);

    if (!group) {
        throw new Error(`Group ${props.group} not found`);
    }

    const operations = extractOperations(group);

    return doc.document([
        ...(group.tag ? getTagDescriptionNodes(group.tag) : []),
        ...operations.map((operation) => {
            return doc.openapi({
                ref: { kind: 'openapi', spec: spec.slug },
                method: operation.method,
                path: operation.path,
            });
        }),
    ]);
}

function getTagDescriptionNodes(tag: OpenAPIV3.TagObject): DocumentBlocksTopLevels[] {
    if ('x-gitbook-description-document' in tag && tag['x-gitbook-description-document']) {
        const descriptionDocument = tag['x-gitbook-description-document'] as JSONDocument;
        return descriptionDocument.nodes;
    }

    if (tag.description) {
        return [doc.paragraph(doc.text(tag.description))];
    }

    return [];
}

/**
 * Generate a document for the models page in the OpenAPI specification.
 */
async function generateModelsDocument(
    input: ContentSourceInput<GenerateModelsPageProps, GenerateContentSourceDependencies>,
    ctx: OpenAPIRuntimeContext,
) {
    const { props, dependencies } = input;
    const spec = await getOpenAPISpec(dependencies, ctx);

    return doc.document([
        doc.paragraph(doc.text('Models')),
        ...Object.entries(spec.schema.components?.schemas ?? {})
            .map(([name, schema]) => {
                if ('$ref' in schema) {
                    return [doc.heading1(doc.text(name)), doc.paragraph(doc.text(schema.$ref))];
                }

                return [
                    doc.heading1(doc.text(name)),
                    doc.paragraph(doc.text(schema.description ?? '')),
                    doc.codeblock(JSON.stringify(schema, null, 2)),
                ];
            })
            .flat(),
    ]);
}

/**
 * Get the OpenAPI specification from the OpenAPI specification dependency.
 */
async function getOpenAPISpec(
    dependencies: ContentSourceDependenciesValueFromRef<GenerateContentSourceDependencies>,
    ctx: OpenAPIRuntimeContext,
) {
    const { api } = ctx;
    const { installation } = ctx.environment;
    const specValue = dependencies.spec.value;

    if (!installation) {
        throw new ExposableError('Installation not found');
    }

    if (specValue?.object !== 'openapi-spec') {
        throw new ExposableError('Invalid spec');
    }

    if (!specValue.lastVersion) {
        throw new ExposableError('No version found for spec');
    }

    const { data: content } = await api.orgs.getOpenApiSpecVersionContentById(
        installation.target.organization,
        specValue.slug,
        specValue.lastVersion,
    );

    const dereferenceResult = await dereference(content.filesystem);

    if (!dereferenceResult.schema) {
        throw new ExposableError('Failed to dereference OpenAPI spec');
    }

    return {
        schema: dereferenceResult.schema as OpenAPIV3.Document,
        url: content.url,
        slug: specValue.slug,
    };
}

interface OpenAPIGroup {
    id: string;
    tag?: OpenAPIV3.TagObject;
    paths: Record<string, OpenAPIV3.PathItemObject>;
}

/**
 * Split the OpenAPI specification into a set of pages
 */
function divideOpenAPISpec(schema: OpenAPIV3.Document) {
    const groups: OpenAPIGroup[] = [];
    const groupsIndexById = new Map<string, number>();

    const indexOperation = (
        groupId: string,
        tag: OpenAPIV3.TagObject | undefined,
        path: string,
        pathItem: OpenAPIV3.PathItemObject,
        httpMethod: OpenAPIV3.HttpMethods,
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

/**
 * Extract all operations in a group.
 */
function extractOperations(group: OpenAPIGroup) {
    const operations: Array<{ method: OpenAPIV3.HttpMethods; path: string }> = [];

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
