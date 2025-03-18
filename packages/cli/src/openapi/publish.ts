import * as fs from 'fs';
import * as path from 'path';

import * as api from '@gitbook/api';
import { getAPIClient } from '../remote';

/**
 * Publish an OpenAPI specification to GitBook.
 * If it already exists, it'll update it.
 */
export async function publishOpenAPISpecification(args: {
    /**
     * The slug of the OpenAPI specification.
     */
    specSlug: string;
    /**
     * The path to the OpenAPI specification file.
     */
    specFilepath: string;

    /**
     * The organization to publish to.
     */
    organizationId: string;
}): Promise<api.OpenAPISpec> {
    const api = await getAPIClient(true);
    const fileContent = await readOpenAPIFile(args.specFilepath);
    const spec = await api.orgs.createOrUpdateOpenApiSpecBySlug(
        args.organizationId,
        args.specSlug,
        {
            source: {
                text: fileContent,
            },
        },
    );
    return spec.data;
}

async function readOpenAPIFile(filePath: string): Promise<string> {
    try {
        const fileContent = await fs.promises.readFile(filePath, 'utf8');
        return fileContent;
    } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
            throw new Error(`OpenAPI specification file not found: ${filePath}`);
        }
        throw error;
    }
}
