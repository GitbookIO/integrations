import detent from 'dedent-js';
import * as fs from 'fs';
import * as path from 'path';
import prompts from 'prompts';

import { IntegrationScope, IntegrationVisibility } from '@gitbook/api';

import packageJSON from '../package.json';
import { fileExists } from './files';
import { DEFAULT_MANIFEST_FILE, writeIntegrationManifest } from './manifest';

/**
 * Interactive prompt to create a new integration.
 * @param dir directory to create the integration project in.
 */
export async function promptNewIntegration(dir?: string): Promise<void> {
    const response = await prompts([
        {
            type: 'text',
            name: 'name',
            message: 'Name of the integration:',
            initial: dir ? path.basename(dir) : 'my-integration',
        },
        {
            type: 'text',
            name: 'title',
            message: 'Title of the integration:',
            initial: (prev) => prev || '',
        },
        {
            type: 'text',
            name: 'organization',
            message: 'ID or subdomain of the organization this integration is owned by',
            initial: (prev) => prev || '',
        },
        {
            type: 'multiselect',
            name: 'scopes',
            message: 'Pick scopes for this integration',
            choices: [
                {
                    title: IntegrationScope.SpaceContentRead,
                    value: IntegrationScope.SpaceContentRead,
                },
                {
                    title: IntegrationScope.SpaceContentWrite,
                    value: IntegrationScope.SpaceContentWrite,
                },
                {
                    title: IntegrationScope.SpaceMetadataRead,
                    value: IntegrationScope.SpaceMetadataRead,
                },
                {
                    title: IntegrationScope.SpaceMetadataWrite,
                    value: IntegrationScope.SpaceMetadataWrite,
                },
                {
                    title: IntegrationScope.SpaceViewsRead,
                    value: IntegrationScope.SpaceViewsRead,
                },
            ],
        },
    ]);

    // Resolve the final directory path where the integration will be created
    const dirPath = path.resolve(process.cwd(), dir || response.name);

    if ((await fileExists(dirPath)) === 'file') {
        throw new Error(`\n❌ The path ${dirPath} is an existing file.`);
    }

    if (await fileExists(path.join(dirPath, DEFAULT_MANIFEST_FILE))) {
        throw new Error(
            `\n❌ The path ${dirPath} already contains a ${DEFAULT_MANIFEST_FILE} file.`
        );
    }

    await initializeProject(dirPath, response);
    console.log('');
    console.log('Your integration is ready!');
    console.log(`Edit the ./src/index.tsx file to add your integration logic.`);
    console.log('Then, run `gitbook publish` to publish it to GitBook.');
}

/**
 * Initialize a new project.
 */
export async function initializeProject(
    dirPath: string,
    project: {
        name: string;
        title: string;
        organization: string;
        scopes: IntegrationScope[];
    }
) {
    const srcPath = path.join(dirPath, 'src');
    const scriptPath = path.join(srcPath, 'index.tsx');

    // Create the directly first
    await fs.promises.mkdir(dirPath, { recursive: true });
    await fs.promises.mkdir(srcPath, { recursive: true });

    // Write the manifest
    await writeIntegrationManifest(path.join(dirPath, DEFAULT_MANIFEST_FILE), {
        name: project.name,
        title: project.title,
        organization: project.organization,
        visibility: IntegrationVisibility.Private,
        description: '',
        script: path.relative(dirPath, scriptPath),
        scopes: project.scopes,
        secrets: {},
    });

    await fs.promises.writeFile(scriptPath, generateScript());
    await fs.promises.writeFile(path.join(dirPath, 'tsconfig.json'), generateTSConfig());
    await fs.promises.writeFile(path.join(dirPath, '.eslintrc.json'), generateESLint());

    await extendPackageJson(dirPath, project.name);
}

/**
 * Extend the package.json file with the dependencies.
 */
export async function extendPackageJson(dirPath: string, projectName: string): Promise<void> {
    const packageJsonPath = path.join(dirPath, 'package.json');

    const packageJsonObject: {
        name?: string;
        private?: boolean;
        scripts?: { [key: string]: string };
        devDependencies?: { [key: string]: string };
    } = {};

    packageJsonObject.name = projectName;
    packageJsonObject.private = true;
    packageJsonObject.scripts = {
        lint: 'eslint ./**/*.ts*',
        typecheck: 'tsc --noEmit',

        // TODO: this is GitBook-specific
        'publish-integrations-staging': 'gitbook publish .',
    };

    packageJsonObject.devDependencies = {
        ...(packageJsonObject.devDependencies || {}),
        [packageJSON.name]: `^${packageJSON.version}`,
        [`@gitbook/runtime`]: 'latest',
    };

    await fs.promises.writeFile(packageJsonPath, JSON.stringify(packageJsonObject, null, 2));
}

/**
 * Generate the script code.
 */
export function generateScript(): string {
    const src = detent(`
        import { createIntegration, FetchEventCallback, RuntimeContext } from '@gitbook/runtime';

        type IntegrationContext = {} & RuntimeContext;

        const handleFetchEvent: FetchEventCallback<IntegrationContext> = async (request, context) => {
            // Use the API to make requests to GitBook
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { api } = context;

            return new Response('Hello World');
        };

        export default createIntegration({
            fetch: handleFetchEvent,
            components: [],
            events: {},
        });
    `).trim();

    return `${src}\n`;
}

export function generateTSConfig(): string {
    return detent(`
        {
            "extends": "@gitbook/tsconfig/integration.json"
        }
    `).trim();
}

export function generateESLint(): string {
    return detent(`
        {
            "extends": ["@gitbook/eslint-config/integration"]
        }
    `).trim();
}
