import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';

import { readIntegrationManifest } from './manifest';
import { getAPIClient } from './remote';

/**
 * Publish the integration to GitBook.
 * If it already exists, it'll update it.
 */
export async function publishIntegration(filePath: string): Promise<void> {
    const manifest = await readIntegrationManifest(filePath);
    const api = await getAPIClient(true);

    // Build the script
    const script = await buildScript(resolveFile(filePath, manifest.script));

    // Publish the integration.
    const created = await api.integrations.publishIntegration(manifest.name, {
        title: manifest.title,
        icon: manifest.icon
            ? await readImage(resolveFile(filePath, manifest.icon), 'icon')
            : undefined,
        description: manifest.description,
        summary: manifest.summary,
        scopes: manifest.scopes,
        categories: manifest.categories,
        blocks: manifest.blocks,
        configurations: manifest.configurations,
        secrets: manifest.secrets,
        visibility: manifest.visibility,
        organization: manifest.organization,
        externalLinks: manifest.externalLinks,
        previewImages: await Promise.all(
            (manifest.previewImages || []).map(async (imageFilePath) =>
                readImage(resolveFile(filePath, imageFilePath), 'preview')
            )
        ),
        script,
    });

    console.log(`Integration "${created.data.name}" published`);
    console.log(`👉 ${created.data.urls.app}`);
}

/**
 * Delete an integration
 */
export async function unpublishIntegration(name: string): Promise<void> {
    const api = await getAPIClient(true);
    await api.integrations.unpublishIntegration(name);

    console.log(`👌 Integration "${name}" has been deleted`);
}

/**
 * Build the script into a single worker definition.
 */
async function buildScript(filePath: string): Promise<string> {
    const result = await esbuild.build({
        platform: 'neutral',
        entryPoints: [filePath],
        bundle: true,
        minify: false, // true,
        target: ['es2020'],
        write: false,
        mainFields: ['worker', 'browser', 'module', 'jsnext', 'main'],
        conditions: ['worker', 'browser', 'import', 'production'],
        define: {},
        // Automatically handle JSX using the ContentKit runtime
        jsx: 'automatic',
        jsxImportSource: '@gitbook/runtime',
        // TODO: change format when we switch to Cloudflare Workers
        // but until them, we need to use "iife" to be able to use
        // the export syntax while running like an entry point.
        format: 'iife',
        globalName: '__gitbook_integration',
    });

    return result.outputFiles[0].text;
}

/**
 * Read and compile an icon.
 */
async function readImage(filePath: string, type: 'icon' | 'preview'): Promise<string> {
    const imageMaxSizes: {
        [key in typeof type]: number;
    } = {
        icon: 250 * 1024,
        preview: 1024 * 1024,
    };

    const sizeLimit = imageMaxSizes[type];

    if (path.extname(filePath) !== '.png') {
        throw new Error(
            `Invalid image file extension for ${filePath}. Only PNG files are accepted.`
        );
    }

    const content = await fs.promises.readFile(filePath);
    if (content.length > sizeLimit) {
        throw new Error(
            `Image file ${filePath} is too large. Maximum size is ${sizeLimit / 1024}KB.`
        );
    }

    return content.toString('base64');
}

function resolveFile(specFile: string, filePath: string): string {
    return path.resolve(path.dirname(specFile), filePath);
}
