import * as fs from 'fs';
import * as path from 'path';

import * as api from '@gitbook/api';
import { getAPIClient } from '../remote';

/**
 * Publish an OpenAPI specification to GitBook from a URL.
 * If it already exists, it'll update it.
 */
export async function publishOpenAPISpecificationFromURL(args: {
    /**
     * The slug of the OpenAPI specification.
     */
    specSlug: string;
    /**
     * The organization to publish to.
     */
    organizationId: string;
    /**
     * The URL pointing to the OpenAPI specification.
     */
    url: string;
}): Promise<api.OpenAPISpec> {
    const api = await getAPIClient(true);
    const spec = await api.orgs.createOrUpdateOpenApiSpecBySlug(
        args.organizationId,
        args.specSlug,
        {
            source: {
                url: args.url,
            },
        },
    );
    return spec.data;
}

/**
 * Publish an OpenAPI specification to GitBook from a file.
 * If it already exists, it'll update it.
 */
export async function publishOpenAPISpecificationFromFilepath(args: {
    /**
     * The slug of the OpenAPI specification.
     */
    specSlug: string;
    /**
     * The organization to publish to.
     */
    organizationId: string;
    /**
     * The path to the OpenAPI specification file.
     */
    filepath: string;
}): Promise<api.OpenAPISpec> {
    const api = await getAPIClient(true);
    const fileContent = await readOpenAPIFile(args.filepath);
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

/**
 * Read the OpenAPI specification file.
 */
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
