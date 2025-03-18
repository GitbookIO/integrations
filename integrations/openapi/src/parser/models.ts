import * as doc from '@gitbook/document';
import type { OpenAPISpecContent } from './spec';
import { filterSelectedOpenAPISchemas } from '@gitbook/react-openapi';

/**
 * Generate a document for the models page in the OpenAPI specification.
 */
export function getModelsDocument(args: { specContent: OpenAPISpecContent }) {
    const { specContent } = args;

    const allSchemas = Object.keys(specContent.schema.components?.schemas ?? {});
    const schemas: string[] = filterSelectedOpenAPISchemas(specContent.schema, allSchemas).map(
        ({ name }) => name,
    );

    return doc.document([
        doc.paragraph(doc.text('Models')),
        doc.openapiSchemas({
            schemas,
            ref: {
                kind: 'openapi',
                spec: specContent.slug,
            },
        }),
    ]);
}
