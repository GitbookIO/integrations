import { defineConfig } from 'vite';
// eslint-disable-next-line import/no-unresolved
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
    plugins: [react()],
    define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env': JSON.stringify({ NODE_ENV: 'production' }),
    },
    build: {
        outDir: 'dist',
        lib: {
            entry: path.resolve(__dirname, 'src/widget.tsx'),
            name: 'VaultriceWidget',
            formats: ['es'],
            fileName: 'voting',
        },
        minify: true,
        sourcemap: false,
        target: 'es2018',
    },
});
