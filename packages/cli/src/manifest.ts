import { z } from 'zod';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

import * as api from '@gitbook/api';

import { fileExists, prettyPath } from './files';

export const DEFAULT_MANIFEST_FILE = 'gitbook-manifest.yaml';

const IntegrationManifestConfigurationComponent = z.object({
    componentId: z.string(),
});

const JSONSchemaBaseSchema = z.object({
    title: z.string().max(30).optional(),
    description: z.string().max(100).optional(),
});

const IntegrationManifestSchemaConfiguration = z.object({
    properties: z.record(
        z.string(),
        z.union([
            JSONSchemaBaseSchema.extend({
                type: z.literal('string'),
                default: z.string().optional(),
            }),
            JSONSchemaBaseSchema.extend({
                type: z.literal('number'),
                default: z.number().optional(),
            }),
            JSONSchemaBaseSchema.extend({
                type: z.literal('boolean'),
                default: z.boolean().optional(),
            }),
            JSONSchemaBaseSchema.extend({
                type: z.literal('button'),
                callback_url: z.string(),
                button_text: z.string(),
            }),
        ]),
    ),
    required: z.array(z.string()).optional(),
});

const IntegrationManifestConfiguration = z.union([
    IntegrationManifestConfigurationComponent,
    IntegrationManifestSchemaConfiguration,
]);

const IntegrationManifestBlock = z.object({
    id: z.string(),
    title: z.string().min(2).max(40),
    description: z.string().min(0).max(150).optional(),
    icon: z.string().optional(),
    urlUnfurl: z.array(z.string()).optional(),
    markdown: z
        .object({
            codeblock: z.string(),
            body: z.string(),
        })
        .optional(),
});

const IntegrationManifestSchema = z.object({
    name: z.string(),
    title: z.string(),
    script: z.string(),
    icon: z.string().optional(),
    description: z.string().optional(),
    summary: z.string().optional(),
    target: z.nativeEnum(api.IntegrationTarget).optional(),
    scopes: z.array(z.nativeEnum(api.IntegrationScope)),
    categories: z.array(z.nativeEnum(api.IntegrationCategory)).optional(),
    blocks: z.array(IntegrationManifestBlock).optional(),
    configurations: z
        .object({
            account: IntegrationManifestConfiguration.optional(),
            space: IntegrationManifestConfiguration.optional(),
            site: IntegrationManifestConfiguration.optional(),
        })
        .optional(),
    visibility: z.nativeEnum(api.IntegrationVisibility).optional(),
    previewImages: z.array(z.string()).max(3).optional(),
    externalLinks: z
        .array(
            z.object({
                label: z.string(),
                url: z.string().url(),
            }),
        )
        .optional(),
    organization: z.string(),
    secrets: z.record(z.string()).optional(),
    contentSecurityPolicy: z.union([z.string(), z.record(z.string(), z.string())]).optional(),
});

export type IntegrationManifest = z.infer<typeof IntegrationManifestSchema>;

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
    } catch (error) {
        throw new Error(
            `Failed to read integration spec from ${prettyPath(filePath)}: ${(error as Error).message}`,
        );
    }
}

/**
 * Write a spec file.
 */
export async function writeIntegrationManifest(
    filePath: string,
    data: IntegrationManifest,
): Promise<void> {
    const normalized = await validateIntegrationManifest(data);
    const content = yaml.dump(normalized);
    await fs.promises.writeFile(filePath, content);
}

/**
 * Validate the spec file.
 */
async function validateIntegrationManifest(data: object): Promise<IntegrationManifest> {
    try {
        const manifest = IntegrationManifestSchema.parse(data);
        return manifest;
    } catch (error) {
        throw new Error(`Invalid integration manifest: ${(error as z.ZodError).message}`);
    }
}

/**
 * Interpolate secrets with environment variables.
 */
function interpolateSecrets(secrets: { [key: string]: string }): { [key: string]: string } {
    return Object.keys(secrets).reduce(
        (acc, key) => {
            acc[key] = secrets[key].replace(/\${{\s*env.([\S]+)\s*}}/g, (_, envVar) => {
                const secretEnvVar = process.env[envVar];
                if (!secretEnvVar) {
                    throw new Error(
                        `Missing environment variable: "${envVar}" used for secret "${key}"`,
                    );
                }

                return secretEnvVar;
            });
            return acc;
        },
        {} as { [key: string]: string },
    );
}
