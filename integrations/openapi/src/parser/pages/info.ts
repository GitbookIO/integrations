import type { OpenAPIV3 } from '@gitbook/openapi-parser';
import type { DocumentBlock, DocumentInline, DocumentText, JSONDocument } from '@gitbook/api';
import { assertNever } from '../../utils';
import { ExposableError } from '@gitbook/runtime';

export interface OpenAPIInfoPage {
    id: string;
    type: 'info';
    title: string;
    pages: OpenAPIInfoPage[];
    content: JSONDocument;
}

/**
 * Get root pages from the OpenAPI info description.
 */
export function getRootPages(schema: OpenAPIV3.Document): OpenAPIInfoPage[] {
    const document = getInfoDescriptionDocument(schema);

    if (!document) {
        return [];
    }

    const rootPages: OpenAPIInfoPage[] = [];
    let currentPages: OpenAPIInfoPage[] = rootPages;
    let currentContent: JSONDocument | null = null;

    let _id = 0;
    const genId = () => `info-${_id++}`;

    for (const node of document.nodes) {
        switch (node.object) {
            case 'block': {
                switch (node.type) {
                    case 'heading-1':
                    case 'heading-2': {
                        const pages: OpenAPIInfoPage[] = [];
                        const content: JSONDocument = {
                            object: 'document',
                            nodes: [],
                            data: {},
                        };
                        const page: OpenAPIInfoPage = {
                            id: genId(),
                            type: 'info',
                            title: getNodeText(node),
                            pages,
                            content,
                        };
                        if (node.type === 'heading-1') {
                            rootPages.push(page);
                            currentPages = pages;
                        } else {
                            currentPages.push(page);
                        }
                        currentContent = content;
                        break;
                    }
                    default: {
                        if (currentContent) {
                            currentContent.nodes.push(node);
                        }
                        break;
                    }
                }
                break;
            }
            default:
                assertNever(node.object);
        }
    }

    return rootPages;
}

/**
 * Get an info page by its ID.
 */
export function getPageById(schema: OpenAPIV3.Document, pageId: string): OpenAPIInfoPage | null {
    const pages = getRootPages(schema);

    const findPageById = (pages: OpenAPIInfoPage[], id: string): OpenAPIInfoPage | null => {
        for (const page of pages) {
            if (page.id === id) return page;
            if (page.pages) {
                const found = findPageById(page.pages, id);
                if (found) return found;
            }
        }
        return null;
    };

    return findPageById(pages, pageId);
}

/**
 * Get the OpenAPI info description document.
 * This is the description of the OpenAPI parsed into a GitBook document.
 */
function getInfoDescriptionDocument(schema: OpenAPIV3.Document): JSONDocument | null {
    if (
        !schema.info ||
        !('x-gitbook-description-document' in schema.info) ||
        !schema.info['x-gitbook-description-document']
    ) {
        return null;
    }

    return schema.info['x-gitbook-description-document'] as JSONDocument;
}

/**
 * Get the text content of a node.
 */
function getNodeText(node: DocumentInline | DocumentText | DocumentBlock): string {
    if (node.object === 'text') {
        return node.leaves.map((leaf) => leaf.text).join('');
    }

    if ('nodes' in node) {
        return node.nodes.map(getNodeText).join('');
    }

    return '';
}
