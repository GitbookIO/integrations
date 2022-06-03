import Ajv, { Schema } from 'ajv';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

import * as api from '@gitbook/api';

const ajv = new Ajv();

const configurationSchema: Schema = {
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: true,
};

const specSchema: Schema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            minLength: 2,
            maxLength: 30,
        },
        title: {
            type: 'string',
            minLength: 2,
            maxLength: 30,
        },
        description: {
            type: 'string',
            maxLength: 100,
        },
        summary: {
            type: 'string',
            maxLength: 400,
        },
        script: {
            type: 'string',
        },
        scopes: {
            type: 'array',
            items: {
                type: 'string',
                enum: [api.IntegrationScope.SpaceContent, api.IntegrationScope.SpaceViews],
            },
        },
        categories: {
            type: 'array',
            items: {
                type: 'string',
                enum: [
                    api.IntegrationCategory.Analytics,
                    api.IntegrationCategory.Collaboration,
                    api.IntegrationCategory.Other,
                ],
            },
        },
        env: {
            type: 'object',
            additionalProperties: { type: 'string' },
        },
        configurations: {
            type: 'object',
            properties: {
                space: configurationSchema,
            },
            additionalProperties: false,
        },
    },
    required: ['name', 'title', 'description', 'script', 'scopes'],
    additionalProperties: false,
};

const validate = ajv.compile(specSchema);

/**
 * Read, parse and validate the spec file.
 */
export async function readIntegrationSpecFile(filePath: string): Promise<api.Integration> {
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
function validateIntegrationSpec(data: object): api.Integration {
    const valid = validate(data);
    if (!valid) {
        throw new Error(ajv.errorsText(validate.errors));
    }

    return data as api.Integration;
}
