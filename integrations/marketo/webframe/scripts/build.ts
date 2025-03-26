import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Build the Javascript code bundle that is running in the integration webframe.
 */
async function buildWebFrameScript(scriptPath: string): Promise<string> {
    const result = await esbuild.build({
        platform: 'browser',
        entryPoints: [scriptPath],
        bundle: true,
        minify: true,
        write: false,
        format: 'esm',
        mainFields: ['worker', 'browser', 'module', 'jsnext', 'main'],
        conditions: ['worker', 'browser', 'import', 'production'],
        define: {},
        globalName: '__gitbook_runkit_webframe',
    });

    return result.outputFiles[0].text;
}

/**
 * Build the HTML for the integration webframe.
 */
async function buildWebFrameHTML(htmlPath: string, webframeJS: string) {
    const htmlTemplate = await fs.promises.readFile(htmlPath, 'utf-8');
    return htmlTemplate.replace(
        '<!-- WEBFRAME_INTEGRATION_CODE -->',
        `<script>${webframeJS}</script>`,
    );
}

async function build() {
    const webframeScriptPath = path.join(__dirname, '../src/webframe.ts');
    const webframeJSCode = await buildWebFrameScript(webframeScriptPath);

    const htmlTemplatePath = path.join(__dirname, '../public/webframe.html');
    const webframeHTML = await buildWebFrameHTML(htmlTemplatePath, webframeJSCode);

    const webframeModule = `
export const webFrameHTML: string = \`
${webframeHTML}
\`
`;
    await fs.promises.writeFile(path.join(__dirname, '../../src/webframe.ts'), webframeModule);
}

build().then(
    () => {
        process.exit(0);
    },
    (error) => {
        console.error(`⨯ Generation of WebFrame HTML failed.`);
        process.exit(1);
    },
);
