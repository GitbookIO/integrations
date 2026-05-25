import * as fs from 'fs';
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
    const slug = validateSlug(args.specSlug);
    const api = await getAPIClient(true);
    const spec = await api.orgs.createOrUpdateOpenApiSpecBySlug(args.organizationId, slug, {
        source: {
            url: args.url,
        },
    });
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
    const slug = validateSlug(args.specSlug);
    const api = await getAPIClient(true);
    const fileContent = await readOpenAPIFile(args.filepath);
    const spec = await api.orgs.createOrUpdateOpenApiSpecBySlug(args.organizationId, slug, {
        source: {
            text: fileContent,
        },
    });
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

const OPENAPISPEC_SLUG_REGEX = new RegExp(api.OPEN_APISPEC_SLUG_PATTERN);
/**
 * Validate the OpenAPI specification slug.
 * It should match the pattern and be between the minimum and maximum length.
 */
function validateSlug(specSlug: string) {
    if (!OPENAPISPEC_SLUG_REGEX.test(specSlug)) {
        throw new Error(
            `Invalid OpenAPI specification slug, must match pattern: ${api.OPEN_APISPEC_SLUG_PATTERN}`,
        );
    }

    if (
        specSlug.length < api.OPEN_APISPEC_SLUG_MIN_LENGTH ||
        specSlug.length > api.OPEN_APISPEC_SLUG_MAX_LENGTH
    ) {
        throw new Error(
            `Invalid OpenAPI specification slug, must be between ${api.OPEN_APISPEC_SLUG_MIN_LENGTH} and ${api.OPEN_APISPEC_SLUG_MAX_LENGTH} characters`,
        );
    }

    return specSlug;
}
