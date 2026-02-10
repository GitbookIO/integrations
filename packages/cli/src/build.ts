import * as esbuild from 'esbuild';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';

import { resolveFile, readIntegrationManifest } from './manifest';

const require = createRequire(import.meta.url);

function logGitBookAPIDiagnostics(referencePath: string) {
    try {
        const pkgPath = require.resolve('@gitbook/api/package.json', {
            paths: [path.dirname(referencePath)],
        });
        const pkgDir = path.dirname(pkgPath);
        const distDir = path.join(pkgDir, 'dist');
        const expectedFiles = ['index.js', 'index.cjs', 'index.d.ts'];
        const statuses = expectedFiles.map((filename) => ({
            filename,
            exists: fs.existsSync(path.join(distDir, filename)),
        }));
        const missing = statuses.filter((status) => !status.exists);

        if (missing.length > 0) {
            const distExists = fs.existsSync(distDir);
            const distContents = distExists ? fs.readdirSync(distDir) : [];
            console.warn(
                [
                    '[diagnostic] @gitbook/api build artifacts missing.',
                    `  Resolved path: ${pkgDir}`,
                    `  Missing: ${missing
                        .map((status) => path.join('dist', status.filename))
                        .join(', ')}`,
                    distExists
                        ? `  dist contents: ${distContents.length > 0 ? distContents.join(', ') : '(empty)'}`
                        : '  dist directory is missing entirely.',
                ].join('\n'),
            );
        } else {
            console.log(`[#diagnostic] @gitbook/api build artifacts detected at ${distDir}.`);
        }
    } catch (error) {
        console.warn(
            `[#diagnostic] Failed to resolve @gitbook/api relative to ${referencePath}: ${
                (error as Error).message
            }`,
        );
    }
}

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

    logGitBookAPIDiagnostics(inputFilePath);

    await esbuild.build({
        platform: 'neutral',
        entryPoints: [inputFilePath],
        outfile: outputFilePath,
        bundle: true,
        format: 'esm',
        target: 'es2020',
        minify: options.mode === 'production',
        sourcemap: options.mode === 'development',
        write: true,
        mainFields: ['worker', 'browser', 'module', 'jsnext', 'main'],
        conditions: ['worker', 'browser', 'import', 'production'],
        define: {
            'process.env.NODE_ENV': JSON.stringify(options.mode),
            MODE: JSON.stringify(options.mode),
        },
        external: ['node:*', 'cloudflare:*'],
        // Automatically handle JSX using the ContentKit runtime
        jsx: 'automatic',
        jsxImportSource: '@gitbook/runtime',
        globalName: '__gitbook_integration',
        loader: {
            // If importing a file as `.raw.js`, esbuild will convert to string so we can use that
            // file as a string without opening it.
            '.raw.js': 'text',
            // If importing a file as `.raw.css`, esbuild will convert to string so we can use that
            // file as a string without opening it.
            '.raw.css': 'text',
        },
    });

    const script = await fs.promises.readFile(outputFilePath, 'utf8');

    return { path: outputFilePath, script, manifest };
}
