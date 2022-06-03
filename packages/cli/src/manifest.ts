import toJsonSchema from '@openapi-contrib/openapi-schema-to-json-schema';
import Ajv, { Schema } from 'ajv';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

import * as api from '@gitbook/api';
// eslint-disable-next-line import/no-internal-modules
import openAPISpec from '@gitbook/api/spec/openapi.dereference.json';

export const DEFAULT_MANIFEST_FILE = 'gitbook-manifest.yaml';

const ajv = new Ajv();

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
    secrets: Record<string, string>;
}

const manifestSchema: Schema = {
    type: 'object',
    properties: {
        name: {
            ...openAPISpec.components.schemas.Integration.properties.name,
        },
        title: {
            ...openAPISpec.components.schemas.Integration.properties.title,
        },
        description: {
            ...openAPISpec.components.schemas.Integration.properties.description,
        },
        summary: {
            ...openAPISpec.components.schemas.Integration.properties.summary,
        },
        icon: {
            type: 'string',
        },
        script: {
            type: 'string',
        },
        scopes: {
            ...toJsonSchema(openAPISpec.components.schemas.Integration.properties.scopes),
        },
        categories: {
            ...toJsonSchema(openAPISpec.components.schemas.Integration.properties.categories),
        },
        configurations: {
            ...openAPISpec.components.schemas.Integration.properties.configurations,
        },
        secrets: {
            ...openAPISpec.components.schemas.IntegrationSecrets,
        },
    },
    required: ['name', 'title', 'script', 'scopes'],
    additionalProperties: false,
};

const validate = ajv.compile(manifestSchema);

/**
 * Read, parse and validate the spec file.
 */
export async function readIntegrationManifest(filePath: string): Promise<IntegrationManifest> {
    try {
        const content = await fs.promises.readFile(filePath, 'utf8');
        const doc = yaml.load(content);
        return validateIntegrationManifest(doc);
    } catch (e) {
        throw new Error(`Failed to read integration spec from ${filePath}: ${e.message}`);
    }
}

/**
 * Write a spec file.
 */
export async function writeIntegrationManifest(
    filePath: string,
    data: IntegrationManifest
): Promise<void> {
    const content = yaml.dump(validateIntegrationManifest(data));
    await fs.promises.writeFile(filePath, content);
}

/**
 * Validate the spec file.
 */
function validateIntegrationManifest(data: object): IntegrationManifest {
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
 * Interpolate secrets with environment variables.
 */
function interpolateSecrets(secrets: Record<string, string>): Record<string, string> {
    return Object.keys(secrets).reduce((acc, key) => {
        acc[key] = secrets[key].replace(/\${env.([^}]+)}/g, (_, envVar) => process.env[envVar]);
        return acc;
    }, {});
}
