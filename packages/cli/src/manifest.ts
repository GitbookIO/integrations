import Ajv, { Schema } from 'ajv';
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
    scopes?: api.IntegrationScope[];
    categories?: api.IntegrationCategory[];
    configurations?: api.IntegrationConfigurations;
    secrets: { [key: string]: string };
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
        return validateIntegrationManifest(doc);
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

    if (manifest.secrets) {
        manifest.secrets = interpolateSecrets(manifest.secrets);
    }

    return manifest;
}

/**
 * Create a schema to validate the manifest file.
 */
async function getManifestSchema() {
    const ajv = new Ajv();

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
            icon: {
                type: 'string',
            },
            script: {
                type: 'string',
            },
            scopes: {
                ...getAPIJsonSchemaFor(
                    openAPISpec,
                    'components/schemas/Integration/properties/scopes'
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
        acc[key] = secrets[key].replace(/\${env.([^}]+)}/g, (_, envVar) => process.env[envVar]);
        return acc;
    }, {});
}
