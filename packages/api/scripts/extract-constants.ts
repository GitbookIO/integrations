import fs from 'fs';
import path from 'path';

const fileContentPrefix = `/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED                                   ##
 * ##                                                           ##
 * ## See extract-constants.ts for more details             ##
 * ---------------------------------------------------------------
 */
`;

const inputPath = path.resolve(process.cwd(), 'spec/openapi.json');
const outputPath = path.resolve(process.cwd(), 'src/constants.ts');

const file = await fs.promises.readFile(inputPath, 'utf-8');
const api = JSON.parse(file);
const constants: Record<string, number | string | string[] | number[]> = {};
for (const [schemaName, schema] of Object.entries(api.components.schemas)) {
    if (
        schema &&
        typeof schema === 'object' &&
        'maxLength' in schema &&
        typeof schema.maxLength === 'number'
    ) {
        constants[formatKey(schemaName, 'maxLength')] = schema.maxLength;
    }

    if (
        schema &&
        typeof schema === 'object' &&
        'minLength' in schema &&
        typeof schema.minLength === 'number'
    ) {
        constants[formatKey(schemaName, 'minLength')] = schema.minLength;
    }

    if (
        schema &&
        typeof schema === 'object' &&
        'pattern' in schema &&
        typeof schema.pattern === 'string'
    ) {
        constants[formatKey(schemaName, 'pattern')] = schema.pattern;
    }

    if (
        schema &&
        typeof schema === 'object' &&
        'pattern' in schema &&
        typeof schema.pattern === 'string'
    ) {
        constants[formatKey(schemaName, 'pattern')] = schema.pattern;
    }

    if (
        schema &&
        typeof schema === 'object' &&
        'enum' in schema &&
        Array.isArray(schema.enum) &&
        (schema.enum.every((item) => typeof item === 'string') ||
            schema.enum.every((item) => typeof item === 'number'))
    ) {
        constants[formatKey(schemaName, 'enum')] = schema.enum;
    }
}
const constantLines = Object.entries(constants)
    .map(([key, value]) => {
        if (Array.isArray(value)) {
            return `export const ${key}:${JSON.stringify(value)}  = ${JSON.stringify(value)};`;
        }
        return `export const ${key} = ${JSON.stringify(value)};`;
    })
    .join('\n');

await fs.promises.writeFile(outputPath, `${fileContentPrefix}\n${constantLines}`);

function formatKey(schemaName: string, key: string) {
    return convertCamelToSnake(`${schemaName}_${key}`);
}

function convertCamelToSnake(str: string) {
    return str.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
}
