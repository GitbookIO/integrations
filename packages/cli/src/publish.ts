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
        icon: manifest.icon ? await readIcon(resolveFile(filePath, manifest.icon)) : undefined,
        description: manifest.description,
        summary: manifest.summary,
        scopes: manifest.scopes,
        categories: manifest.categories,
        configurations: manifest.configurations,
        secrets: manifest.secrets,
        visibility: manifest.visibility,
        organization: manifest.organization,
        script,
    });

    console.log(`Integration "${created.data.name}" published.`);
}

/**
 * Build the script into a single worker definition.
 */
async function buildScript(filePath: string): Promise<string> {
    const result = await esbuild.build({
        platform: 'neutral',
        entryPoints: [filePath],
        bundle: true,
        minify: true,
        target: ['es2020'],
        write: false,
        mainFields: ['worker', 'browser', 'module', 'jsnext', 'main'],
        conditions: ['worker', 'browser', 'import', 'production'],
        define: {},
    });

    return result.outputFiles[0].text;
}

/**
 * Read and compile an icon.
 */
export async function readIcon(filePath: string): Promise<string> {
    if (path.extname(filePath) !== '.png') {
        throw new Error(
            `Invalid icon file extension for ${filePath}. Only PNG files are accepted.`
        );
    }

    const content = await fs.promises.readFile(filePath);
    if (content.length > 250 * 1024) {
        throw new Error(`Icon file ${filePath} is too large. Maximum size is 250KB.`);
    }

    return content.toString('base64');
}

function resolveFile(specFile: string, filePath: string): string {
    return path.resolve(path.dirname(specFile), filePath);
}
