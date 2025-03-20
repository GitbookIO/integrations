import { type OpenAPIV3, shouldIgnoreEntity } from '@gitbook/openapi-parser';
import { HTTP_METHODS, type HttpMethod } from '../http-methods';
import { ExposableError } from '@gitbook/runtime';

export interface OpenAPIOperationsPage {
    id: string;
    type: 'operations';
    title: string;
    tag?: OpenAPIV3.TagObject;
    paths: Record<string, OpenAPIV3.PathItemObject>;
    operations: OpenAPIOperation[];
    pages?: OpenAPIOperationsPage[];
}

/**
 * Get the OpenAPI operation root pages from the schema.
 * This will organize the pages by their tags and parent tags.
 * It will also remove any pages that are marked as ignored in the spec.
 * The root pages will be the ones that have no parent tag.
 * The pages will be organized in a tree structure.
 */
export function getRootPages(schema: OpenAPIV3.Document): OpenAPIOperationsPage[] {
    const operationsPages = getOperationsPages(schema);

    if (!schema.tags) {
        return operationsPages;
    }

    const pagesByParent: Record<string, OpenAPIOperationsPage[]> = {};
    const rootPages: OpenAPIOperationsPage[] = [];

    // First pass: organize pages by parent
    schema.tags.forEach((tag) => {
        // Ignore tags marked as ignored in the spec
        if (shouldIgnoreEntity(tag)) {
            return;
        }

        if (!tag.name) {
            return;
        }

        const existingPage = operationsPages.find((p) => tag.name && p.id === tagToId(tag.name));
        const page =
            existingPage ??
            (schema.tags?.some((t) => getTagParent(t) === tag.name)
                ? {
                      id: tagToId(tag.name),
                      type: 'operations',
                      title: getTagTitle(tag),
                      tag,
                      paths: {},
                      operations: [],
                  }
                : null);

        if (!page) {
            return;
        }

        const parent = getTagParent(tag);

        if (!parent) {
            rootPages.push(page);
        } else {
            const parentId = tagToId(parent);
            pagesByParent[parentId] = pagesByParent[parentId] || [];
            pagesByParent[parentId].push(page);
        }
    });

    // Second pass: attach children to their parents
    function attachChildren(parentPage: OpenAPIOperationsPage) {
        const children = pagesByParent[parentPage.id];
        if (children) {
            parentPage.pages = children;
            children.forEach(attachChildren);
        }
    }

    rootPages.forEach(attachChildren);

    return rootPages;
}

/**
 * Get an operations page by its ID.
 */
export function getPageById(
    schema: OpenAPIV3.Document,
    pageId: string,
): OpenAPIOperationsPage | null {
    const pages = getOperationsPages(schema);
    return pages.find((page) => page.id === pageId) ?? null;
}

function getTagParent(tag: OpenAPIV3.TagObject): string | undefined {
    return typeof tag.parent === 'string'
        ? tag.parent
        : typeof tag['x-parent'] === 'string'
          ? tag['x-parent']
          : undefined;
}

/**
 * Get pages that contain operations from the OpenAPI schema.
 */
function getOperationsPages(schema: OpenAPIV3.Document): OpenAPIOperationsPage[] {
    const pages: OpenAPIOperationsPage[] = [];
    const pagesIndexById = new Map<string, number>();

    const indexOperation = (
        firstTag: string,
        tag: OpenAPIV3.TagObject | undefined,
        path: string,
        pathItem: OpenAPIV3.PathItemObject,
        httpMethod: HttpMethod,
        operation: OpenAPIV3.OperationObject,
    ) => {
        const pageId = tagToId(firstTag);
        const pageIndex = pagesIndexById.get(pageId);
        const page: OpenAPIOperationsPage =
            pageIndex !== undefined
                ? pages[pageIndex]
                : {
                      id: pageId,
                      type: 'operations',
                      title: (tag ? getTagTitle(tag) : '') || getTitleFromTagName(firstTag),
                      tag,
                      paths: {},
                      operations: [],
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

    return pages.map((page) => {
        const operations = extractPageOperations(page);
        return {
            ...page,
            operations,
        };
    });
}

export type OpenAPIOperation = {
    method: HttpMethod;
    path: string;
};

/**
 * Extract all operations from a page.
 */
function extractPageOperations(page: OpenAPIOperationsPage): OpenAPIOperation[] {
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
 * Get the ID for a tag.
 */
function tagToId(tagName: string): string {
    return `tag-${tagName}`;
}

/**
 * Get the title for a tag.
 */
function getTagTitle(tag: OpenAPIV3.TagObject) {
    if (typeof tag['x-page-title'] === 'string' && tag['x-page-title']) {
        return tag['x-page-title'];
    }
    if (typeof tag['x-displayName'] === 'string' && tag['x-displayName']) {
        return tag['x-displayName'];
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
