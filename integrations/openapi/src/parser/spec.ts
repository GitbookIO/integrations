import { ExposableError } from '@gitbook/runtime';
import { dereference, type OpenAPIV3, shouldIgnoreEntity } from '@gitbook/openapi-parser';
import { GitBookAPI, type JSONDocument } from '@gitbook/api';

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

export interface OpenAPIPage {
    id: string;
    title: string;
    tag?: OpenAPIV3.TagObject;
    paths: Record<string, OpenAPIV3.PathItemObject>;
    pages?: OpenAPIPage[];
}

/**
 * Split the OpenAPI specification schema into a set of pages.
 */
export function getAllOpenAPIPages(schema: OpenAPIV3.Document): OpenAPIPage[] {
    const pages: OpenAPIPage[] = [];
    const pagesIndexById = new Map<string, number>();

    const indexOperation = (
        pageId: string,
        tag: OpenAPIV3.TagObject | undefined,
        path: string,
        pathItem: OpenAPIV3.PathItemObject,
        httpMethod: HttpMethod,
        operation: OpenAPIV3.OperationObject,
    ) => {
        const pageIndex = pagesIndexById.get(pageId);
        const page =
            pageIndex !== undefined
                ? pages[pageIndex]
                : {
                      id: pageId,
                      title: (tag ? getTagTitle(tag) : '') || getTitleFromTagName(pageId),
                      tag,
                      paths: {},
                  };

        page.paths[path] = page.paths[path] ?? pathItem;
        page.paths[path][httpMethod] = operation;

        if (pageIndex === undefined) {
            pagesIndexById.set(pageId, pages.length);
            pages.push(page);
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

            // Ignore operations marked as ignored in the spec.
            if (shouldIgnoreEntity(operation)) {
                return;
            }

            const firstExistingTag = operation.tags?.find((tag) =>
                schema.tags?.some((t) => t.name === tag),
            );
            const firstTag = firstExistingTag ?? operation.tags?.[0] ?? 'default';
            const tag = schema.tags?.find((t) => t.name === firstTag);
            indexOperation(firstTag, tag, path, pathItem, httpMethod, operation);
        });
    });

    return pages;
}

/**
 * Get the OpenAPI tree from the schema.
 * This will organize the pages by their tags and parent tags.
 * It will also remove any pages that are marked as ignored in the spec.
 * The root pages will be the ones that have no parent tag.
 * The pages will be organized in a tree structure.
 */
export function getOpenAPITree(schema: OpenAPIV3.Document): OpenAPIPage[] {
    const pages = getAllOpenAPIPages(schema);

    if (!schema.tags) {
        return pages;
    }

    const pagesByParent: Record<string, OpenAPIPage[]> = {};
    const rootPages: OpenAPIPage[] = [];

    // First pass: organize pages by parent
    schema.tags.forEach((tag) => {
        // Ignore tags marked as ignored in the spec
        if (shouldIgnoreEntity(tag)) {
            return;
        }

        if (!tag.name) {
            return;
        }

        const existingPage = pages.find((p) => p.id === tag.name);
        const page =
            existingPage ??
            (schema.tags?.some((t) => getTagParent(t) === tag.name)
                ? {
                      id: tag.name,
                      title: getTagTitle(tag),
                      tag,
                      paths: {},
                  }
                : null);

        if (!page) {
            return;
        }

        const parent = getTagParent(tag);

        if (!parent) {
            rootPages.push(page);
        } else {
            pagesByParent[parent] = pagesByParent[parent] || [];
            pagesByParent[parent].push(page);
        }
    });

    // Second pass: attach children to their parents
    function attachChildren(parentPage: OpenAPIPage) {
        const children = pagesByParent[parentPage.id];
        if (children) {
            parentPage.pages = children;
            children.forEach(attachChildren);
        }
    }

    rootPages.forEach(attachChildren);

    return rootPages;
}

function getTagParent(tag: OpenAPIV3.TagObject): string | undefined {
    return typeof tag.parent === 'string'
        ? tag.parent
        : typeof tag['x-parent'] === 'string'
          ? tag['x-parent']
          : undefined;
}

export type OpenAPIOperation = {
    method: HttpMethod;
    path: string;
};

/**
 * Extract all operations from a page.
 */
export function extractPageOperations(page: OpenAPIPage): OpenAPIOperation[] {
    const operations: OpenAPIOperation[] = [];

    Object.entries(page.paths).forEach(([path, pathItem]) => {
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

/**
 * Get the title for a tag.
 */
function getTagTitle(tag: OpenAPIV3.TagObject) {
    if (typeof tag['x-page-title'] === 'string' && tag['x-page-title']) {
        return tag['x-page-title'];
    }
    if (typeof tag.name === 'string' && tag.name) {
        return getTitleFromTagName(tag.name);
    }
    return 'Unknown';
}

/**
 * Improve a tag name to be used as a page title:
 * - Capitalize the first letter
 * - Split on - and capitalize each word
 */
function getTitleFromTagName(tagName: string) {
    return tagName
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
