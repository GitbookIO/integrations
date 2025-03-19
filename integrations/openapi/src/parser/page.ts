import type { Document, DocumentBlocksTopLevels, JSONDocument } from '@gitbook/api';
import * as doc from '@gitbook/document';
import { type OpenAPIV3 } from '@gitbook/openapi-parser';
import type { OpenAPIPage } from './pages';
import type { OpenAPISpecContent } from './spec';
import { assertNever } from '../utils';

/**
 * Generate a document for a group in the OpenAPI specification.
 */
export function getOpenAPIPageDocument(args: {
    page: OpenAPIPage;
    specContent: OpenAPISpecContent;
}): Document {
    const { page, specContent } = args;

    switch (page.type) {
        case 'operations': {
            return doc.document([
                ...(page.tag ? getTagDescriptionNodes(page.tag) : []),
                ...page.operations.map((operation) => {
                    return doc.openapiOperation({
                        ref: { kind: 'openapi', spec: specContent.slug },
                        method: operation.method,
                        path: operation.path,
                    });
                }),
            ]);
        }
        case 'info': {
            return doc.document(page.content.nodes);
        }
        default:
            assertNever(page);
    }
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
