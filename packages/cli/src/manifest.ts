import Ajv, { Schema } from 'ajv';
import addFormats from 'ajv-formats';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

import * as api from '@gitbook/api';

import { getAPISchema, getAPIJsonSchemaFor } from './api-spec';
import { fileExists, prettyPath } from './files';

export const DEFAULT_MANIFEST_FILE = 'gitbook-manifest.yaml';

export interface IntegrationManifest {
    name: string;
    title: string;
    script: string;
    icon?: string;
    description?: string;
    summary?: string;
    target?: api.IntegrationTarget;
    scopes?: api.IntegrationScope[];
    categories?: api.IntegrationCategory[];
    blocks?: api.IntegrationBlock[];
    configurations?: api.IntegrationConfigurations;
    visibility?: api.IntegrationVisibility;
    previewImages?: api.Integration['previewImages'];
    externalLinks?: api.Integration['externalLinks'];
    organization?: string;
    secrets: { [key: string]: string };
    contentSecurityPolicy?: string;
}

/**
 * Get the default manifest file path for the current working directory.
 */
export function getDefaultManifestPath(): string {
    return path.resolve(process.cwd(), DEFAULT_MANIFEST_FILE);
}

/**
 * Resolve a file path relative to the manifest spec file directory.
 */
export function resolveFile(specFile: string, filePath: string): string {
    return path.resolve(path.dirname(specFile), filePath);
}

/**
 * Resolve a user-inputed path into a real manifest file path.
 */
export async function resolveIntegrationManifestPath(inputPath: string): Promise<string> {
    const fileType = await fileExists(inputPath);

    if (fileType === 'file') {
        return inputPath;
    }

    if (fileType === 'directory') {
        const realPath = path.join(inputPath, DEFAULT_MANIFEST_FILE);
        return resolveIntegrationManifestPath(realPath);
    }

    throw new Error(`Manifest file not found: ${prettyPath(inputPath)}`);
}

/**
 * Read, parse and validate the spec file.
 */
export async function readIntegrationManifest(filePath: string): Promise<IntegrationManifest> {
    try {
        const content = await fs.promises.readFile(filePath, 'utf8');
        const doc = yaml.load(content);
        const manifest = await validateIntegrationManifest(doc as object);

        if (manifest.secrets) {
            manifest.secrets = interpolateSecrets(manifest.secrets);
        }

        return manifest;
    } catch (e) {
        throw new Error(
            `Failed to read integration spec from ${prettyPath(filePath)}: ${e.message}`
        );
    }
}

/**
 * Write a spec file.
 */
export async function writeIntegrationManifest(
    filePath: string,
    data: IntegrationManifest
): Promise<void> {
    const normalized = await validateIntegrationManifest(data);
    const content = yaml.dump(normalized);
    await fs.promises.writeFile(filePath, content);
}

/**
 * Validate the spec file.
 */
async function validateIntegrationManifest(data: object): Promise<IntegrationManifest> {
    const [validate, ajv] = await getManifestSchema();
    const valid = validate(data);
    if (!valid) {
        throw new Error(ajv.errorsText(validate.errors));
    }

    const manifest = data as IntegrationManifest;
    return manifest;
}

/**
 * Create a schema to validate the manifest file.
 */
async function getManifestSchema() {
    const ajv = new Ajv();
    addFormats(ajv);

    const openAPISpec = await getAPISchema();

    const manifestSchema: Schema = {
        type: 'object',
        properties: {
            name: {
                ...getAPIJsonSchemaFor(
                    openAPISpec,
                    'components/schemas/Integration/properties/name'
                ),
            },
            title: {
                ...getAPIJsonSchemaFor(
                    openAPISpec,
                    'components/schemas/Integration/properties/title'
                ),
            },
            description: {
                ...getAPIJsonSchemaFor(
                    openAPISpec,
                    'components/schemas/Integration/properties/description'
                ),
            },
            summary: {
                ...getAPIJsonSchemaFor(
                    openAPISpec,
                    'components/schemas/Integration/properties/summary'
                ),
            },
            visibility: {
                ...getAPIJsonSchemaFor(
                    openAPISpec,
                    'components/schemas/Integration/properties/visibility'
                ),
            },
            target: {
                ...getAPIJsonSchemaFor(
                    openAPISpec,
                    'components/schemas/RequestPublishIntegration/properties/target'
                ),
            },
            icon: {
                type: 'string',
            },
            script: {
                type: 'string',
            },
            previewImages: {
                type: 'array',
                items: {
                    type: 'string',
                },
            },
            externalLinks: {
                ...getAPIJsonSchemaFor(
                    openAPISpec,
                    'components/schemas/Integration/properties/externalLinks'
                ),
            },
            scopes: {
                ...getAPIJsonSchemaFor(
                    openAPISpec,
                    'components/schemas/Integration/properties/scopes'
                ),
            },
            blocks: {
                ...getAPIJsonSchemaFor(
                    openAPISpec,
                    'components/schemas/Integration/properties/blocks'
                ),
            },
            categories: {
                ...getAPIJsonSchemaFor(
                    openAPISpec,
                    'components/schemas/Integration/properties/categories'
                ),
            },
            configurations: {
                ...getAPIJsonSchemaFor(
                    openAPISpec,
                    'components/schemas/Integration/properties/configurations'
                ),
            },
            secrets: {
                ...getAPIJsonSchemaFor(openAPISpec, 'components/schemas/IntegrationSecrets'),
            },
            contentSecurityPolicy: {
                ...getAPIJsonSchemaFor(
                    openAPISpec,
                    'components/schemas/IntegrationContentSecurityPolicy'
                ),
            },
            organization: {
                ...getAPIJsonSchemaFor(
                    openAPISpec,
                    'components/schemas/RequestPublishIntegration/properties/organization'
                ),
            },
        },
        required: ['name', 'title', 'script', 'scopes'],
        additionalProperties: false,
    };

    return [ajv.compile(manifestSchema), ajv] as const;
}

/**
 * Interpolate secrets with environment variables.
 */
function interpolateSecrets(secrets: { [key: string]: string }): { [key: string]: string } {
    return Object.keys(secrets).reduce((acc, key) => {
        acc[key] = secrets[key].replace(/\${{\s*env.([\S]+)\s*}}/g, (_, envVar) => {
            const secretEnvVar = process.env[envVar];
            if (!secretEnvVar) {
                throw new Error(
                    `Missing environment variable: "${envVar}" used for secret "${key}"`
                );
            }

            return secretEnvVar;
        });
        return acc;
    }, {});
}
