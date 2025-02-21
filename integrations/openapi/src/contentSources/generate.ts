import { ContentRefOpenAPI, InputPage } from '@gitbook/api';
import * as doc from '@gitbook/document';
import {
    ContentSourceDependenciesValueFromRef,
    createContentSource,
    ExposableError,
} from '@gitbook/runtime';
import { openapi } from '@scalar/openapi-parser';
import { fetchUrls } from '@scalar/openapi-parser/plugins/fetch-urls';
import { OpenAPIV3 } from '@scalar/openapi-types';
import { getTagTitle, improveTagName } from './utils';
import { OpenAPIRuntimeContext } from '../types';

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
    /**
     * Should a models page be generated?
     * @default true
     */
    models?: boolean;
};

/** Props passed to the `getPageDocument` method. */
type GenerateGroupPageProps = GenerateContentSourceProps & {
    doc: 'operations';
    group: string;
};
type GenerateModelsPageProps = GenerateContentSourceProps & {
    doc: 'models';
};

export type GenerateContentSourceDependencies = {
    // TODO: add openapi dependency here
    // spec: ContentRefOpenAPI;
    spec: { ref: ContentRefOpenAPI };
};

/**
 * Content source to generate pages from an OpenAPI specification.
 */
export const generateContentSource = createContentSource<
    GenerateContentSourceProps | GenerateGroupPageProps | GenerateModelsPageProps,
    GenerateContentSourceDependencies
>({
    sourceId: 'generate',

    getRevision: async ({ props, dependencies }, ctx) => {
        const { data: spec, specSlug } = await getOpenAPISpec({ props, dependencies }, ctx);
        const groups = divideOpenAPISpec(props, spec);

        const groupPages = groups.map((group) => {
            const documentProps: GenerateGroupPageProps = {
                ...props,
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
                            ref: { kind: 'openapi' as const, spec: specSlug },
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
                                          ref: { kind: 'openapi' as const, spec: specSlug },
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
        if (!('doc' in props)) {
            throw new Error('Doc is required');
        }

        if (props.doc === 'models') {
            return generateModelsDocument({ props, dependencies }, ctx);
        }

        if (props.doc === 'operations') {
            return generateGroupDocument({ props, dependencies }, ctx);
        }

        throw new Error('Invalid document generation request');
    },
});

/**
 * Generate a document for a group in the OpenAPI specification.
 */
async function generateGroupDocument(
    {
        props,
        dependencies,
    }: {
        props: GenerateGroupPageProps;
        dependencies: ContentSourceDependenciesValueFromRef<GenerateContentSourceDependencies>;
    },
    ctx: OpenAPIRuntimeContext,
) {
    const { data: spec, specSlug } = await getOpenAPISpec({ props, dependencies }, ctx);
    const groups = divideOpenAPISpec(props, spec);

    const group = groups.find((g) => g.id === props.group);
    if (!group) {
        throw new Error(`Group ${props.group} not found`);
    }

    const operations = extractOperations(group);

    return doc.document([
        // TODO: return or parse the description as markdown
        ...(group.tag?.description ? [doc.paragraph(doc.text(group.tag.description))] : []),
        ...operations.map((operation) => {
            return doc.openapi({
                ref: { kind: 'openapi', spec: specSlug },
                method: operation.method,
                path: operation.path,
            });
        }),
    ]);
}

/**
 * Generate a document for the models page in the OpenAPI specification.
 */
async function generateModelsDocument(
    {
        props,
        dependencies,
    }: {
        props: GenerateModelsPageProps;
        dependencies: ContentSourceDependenciesValueFromRef<GenerateContentSourceDependencies>;
    },
    ctx: OpenAPIRuntimeContext,
) {
    const { data: spec } = await getOpenAPISpec({ props, dependencies }, ctx);

    return doc.document([
        doc.paragraph(doc.text('Models')),
        ...Object.entries(spec.components?.schemas ?? {})
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
    {
        dependencies,
    }: {
        props: GenerateContentSourceProps;
        dependencies: ContentSourceDependenciesValueFromRef<GenerateContentSourceDependencies>;
    },
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

    const { data: version } = await api.orgs.getOpenApiSpecVersionById(
        installation.target.organization,
        specValue.slug,
        specValue.lastVersion,
    );

    const result = await openapi()
        .load(version.url, {
            plugins: [
                fetchUrls({
                    limit: 10,
                }),
            ],
        })
        .upgrade()
        .get();

    if (result.errors && result.errors.length > 0) {
        throw new ExposableError(`Failed to parse OpenAPI spec`);
    }

    return { data: result.specification as OpenAPIV3.Document, specSlug: specValue.slug };
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

    Object.entries(spec.paths ?? {}).forEach(([path, pathItem]) => {
        if (!pathItem) {
            return;
        }

        HTTP_METHODS.forEach((httpMethod) => {
            const operation = pathItem[httpMethod];
            if (!operation) {
                return;
            }

            const firstTag = operation.tags?.[0] ?? 'default';
            const tag = spec.tags?.find((t) => t.name === firstTag);
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
