import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

import { resolveFile, readIntegrationManifest } from './manifest';

const GITBOOK_OUTPUT_DIR = '.gitbook';

interface BuildOutput {
    /** path where the final script is outputted */
    path: string;
    /** the text content of built script */
    script: string;
    /** resolved manifest config used during the process */
    manifest: Awaited<ReturnType<typeof readIntegrationManifest>>;
}

/**
 * Build the script into a single worker definition.
 */
export async function buildScriptFromManifest(manifestSpecPath: string): Promise<BuildOutput> {
    const manifest = await readIntegrationManifest(manifestSpecPath);
    /**
     * Resolve the input and output file paths relatve to the manifest file.
     */
    const inputFilePath = resolveFile(manifestSpecPath, manifest.script);
    const outputFilePath = resolveFile(
        manifestSpecPath,
        path.join(GITBOOK_OUTPUT_DIR, 'script.js')
    );

    await esbuild.build({
        platform: 'neutral',
        entryPoints: [inputFilePath],
        outfile: outputFilePath,
        bundle: true,
        minify: true,
        target: ['es2020'],
        write: true,
        mainFields: ['worker', 'browser', 'module', 'jsnext', 'main'],
        conditions: ['worker', 'browser', 'import', 'production'],
        define: {
            'process.env.NODE_ENV': '"production"',
        },
        // Automatically handle JSX using the ContentKit runtime
        jsx: 'automatic',
        jsxImportSource: '@gitbook/runtime',
        // TODO: change format when we switch to Cloudflare Workers
        // but until them, we need to use "iife" to be able to use
        // the export syntax while running like an entry point.
        format: 'iife',
        globalName: '__gitbook_integration',
        loader: {
            // If importing a file as `.raw.js`, eslint will convert to string so we can use that
            // file as a string without opening it.
            '.raw.js': 'text',
        },
    });

    const script = await fs.promises.readFile(outputFilePath, 'utf8');

    return { path: outputFilePath, script, manifest };
}