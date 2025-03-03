import * as doc from '@gitbook/document';
import { OpenAPISpecContent } from './spec';

/**
 * Generate a document for the models page in the OpenAPI specification.
 */
export function getModelsDocument(args: { specContent: OpenAPISpecContent }) {
    const { specContent } = args;

    return doc.document([
        doc.paragraph(doc.text('Models')),
        ...Object.entries(specContent.schema.components?.schemas ?? {})
            .map(([name, schema]) => {
                if ('$ref' in schema) {
                    return [doc.heading1(doc.text(name)), doc.paragraph(doc.text(schema.$ref))];
                }

                return [
                    doc.heading1(doc.text(name)),
                    ...(schema.description ? [doc.paragraph(doc.text(schema.description))] : []),
                    doc.codeblock(JSON.stringify(schema, null, 2)),
                ];
            })
            .flat(),
    ]);
}
