import * as esbuild from 'esbuild';
import * as path from 'path';

import { getAPIClient } from './remote';
import { readIntegrationSpecFile } from './spec';

/**
 * Publish the integration to GitBook.
 * If it already exists, it'll update it.
 */
export async function publishIntegration(filePath: string): Promise<void> {
    const spec = await readIntegrationSpecFile(filePath);
    const api = await getAPIClient(true);

    // Build the script
    const script = await buildScript(resolveFile(filePath, spec.script));

    // Publish the integration.
    const created = await api.integrations.publish(spec.name, {
        title: spec.title,
        description: spec.description,
        summary: spec.summary,
        scopes: spec.scopes,
        categories: spec.categories,
        configurations: spec.configurations,
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

function resolveFile(specFile: string, filePath: string): string {
    return path.resolve(path.dirname(specFile), filePath);
}
