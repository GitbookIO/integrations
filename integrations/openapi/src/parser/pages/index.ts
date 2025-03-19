import type { OpenAPIV3 } from '@gitbook/openapi-parser';
import * as info from './info';
import * as operations from './operations';

export type OpenAPIPage = info.OpenAPIInfoPage | operations.OpenAPIOperationsPage;

/**
 * Get the OpenAPI root pages from the schema.
 */
export function getRootPages(schema: OpenAPIV3.Document): OpenAPIPage[] {
    return [...info.getRootPages(schema), ...operations.getRootPages(schema)];
}
