import type { Document, DocumentBlocksTopLevels, JSONDocument } from '@gitbook/api';
import * as doc from '@gitbook/document';
import { type OpenAPIV3 } from '@gitbook/openapi-parser';
import { extractGroupOperations, OpenAPIGroup, OpenAPISpecContent } from './spec';

/**
 * Generate a document for a group in the OpenAPI specification.
 */
export function getGroupDocument(args: {
    group: OpenAPIGroup;
    specContent: OpenAPISpecContent;
}): Document {
    const { group, specContent } = args;

    const operations = extractGroupOperations(group);

    return doc.document([
        ...(group.tag ? getTagDescriptionNodes(group.tag) : []),
        ...operations.map((operation) => {
            return doc.openapi({
                ref: { kind: 'openapi', spec: specContent.slug },
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
