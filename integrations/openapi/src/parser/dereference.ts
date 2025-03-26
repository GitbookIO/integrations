import { ExposableError } from '@gitbook/runtime';
import { dereference, type OpenAPIV3 } from '@gitbook/openapi-parser';

/**
 * Dereference the OpenAPI and return the schema.
 */
export async function getDereferencedSchema(
    args: Parameters<typeof dereference>['0'],
): Promise<OpenAPIV3.Document> {
    const dereferenceResult = await dereference(args);

    if (!dereferenceResult.schema) {
        throw new ExposableError('Failed to dereference OpenAPI spec');
    }

    return dereferenceResult.schema as OpenAPIV3.Document;
}
