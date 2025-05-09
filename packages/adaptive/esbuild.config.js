const esbuild = require('esbuild');

// Common settings
const commonSettings = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ['es2020', 'chrome70', 'firefox70', 'safari12', 'edge79'],
    plugins: [],
    logLevel: 'info',
};

// Build ESM module
esbuild
    .build({
        ...commonSettings,
        outfile: 'dist/index.js',
        format: 'esm',
    })
    .catch(() => process.exit(1));

// Build CommonJS module
esbuild
    .build({
        ...commonSettings,
        outfile: 'dist/index.cjs',
        format: 'cjs',
    })
    .catch(() => process.exit(1));
