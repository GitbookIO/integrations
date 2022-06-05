import toJsonSchema from '@openapi-contrib/openapi-schema-to-json-schema';
import { Resolver } from '@stoplight/json-ref-resolver';

// eslint-disable-next-line import/no-internal-modules
import openAPISpec from '@gitbook/api/spec/openapi.json';

/**
 * Return a complete OpenAPI schema without ref.
 */
export async function getAPISchema(): Promise<object> {
    const resolver = new Resolver();
    const resolved = await resolver.resolve(openAPISpec);

    return resolved.result;
}

/**
 * Return a component from the OpenAPI schema as a JSON schema.
 */
export function getAPIJsonSchemaFor(schema: object, path: string): Promise<object> {
    let result = schema;

    const parts = path.split('/');
    for (const part of parts) {
        result = result[part];
        if (!result) {
            throw new Error(`Could not find ${path} (${part}) in the API spec`);
        }
    }

    return toJsonSchema(result);
}
