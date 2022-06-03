import toJsonSchema from '@openapi-contrib/openapi-schema-to-json-schema';
import Ajv, { Schema } from 'ajv';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

import * as api from '@gitbook/api';
// eslint-disable-next-line import/no-internal-modules
import openAPISpec from '@gitbook/api/spec/openapi.dereference.json';

const ajv = new Ajv();

export interface IntegrationConfigSpec {
    name: string;
    title: string;
    script: string;
    icon?: string;
    description?: string;
    summary?: string;
    scopes?: api.IntegrationScope[];
    categories?: api.IntegrationCategory[];
    configurations?: api.IntegrationConfigurations;
}

const specSchema: Schema = {
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
    },
    required: ['name', 'title', 'description', 'script', 'scopes'],
    additionalProperties: false,
};

const validate = ajv.compile(specSchema);

/**
 * Read, parse and validate the spec file.
 */
export async function readIntegrationSpecFile(filePath: string): Promise<IntegrationConfigSpec> {
    try {
        const content = await fs.promises.readFile(filePath, 'utf8');
        const doc = yaml.load(content);
        return validateIntegrationSpec(doc);
    } catch (e) {
        throw new Error(`Failed to read integration spec from ${filePath}: ${e.message}`);
    }
}

/**
 * Validate the spec file.
 */
function validateIntegrationSpec(data: object): IntegrationConfigSpec {
    const valid = validate(data);
    if (!valid) {
        throw new Error(ajv.errorsText(validate.errors));
    }

    return data as IntegrationConfigSpec;
}
