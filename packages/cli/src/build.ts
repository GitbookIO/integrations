import * as esbuild from 'esbuild';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { resolveFile, readIntegrationManifest } from './manifest';

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
export async function buildScriptFromManifest(
    manifestSpecPath: string,
    options: {
        mode?: 'development' | 'production';
    } = { mode: 'production' },
): Promise<BuildOutput> {
    const manifest = await readIntegrationManifest(manifestSpecPath);
    /**
     * Resolve the input and output file paths relatve to the manifest file.
     */
    const inputFilePath = resolveFile(manifestSpecPath, manifest.script);
    const outputFilePath = path.join(os.tmpdir(), '.gitbook', manifest.name, 'script.js');

    await esbuild.build({
        platform: 'neutral',
        entryPoints: [inputFilePath],
        outfile: outputFilePath,
        bundle: true,
        minify: options.mode === 'production',
        sourcemap: options.mode === 'development',
        target: ['es2020'],
        write: true,
        mainFields: ['worker', 'browser', 'module', 'jsnext', 'main'],
        conditions: ['worker', 'browser', 'import', 'production'],
        define: {
            'process.env.NODE_ENV': JSON.stringify(options.mode),
            MODE: JSON.stringify(options.mode),
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
            // If importing a file as `.raw.js`, esbuild will convert to string so we can use that
            // file as a string without opening it.
            '.raw.js': 'text',
        },
    });

    const script = await fs.promises.readFile(outputFilePath, 'utf8');

    return { path: outputFilePath, script, manifest };
}
