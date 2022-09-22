import detent from 'dedent-js';
import * as fs from 'fs';
import * as path from 'path';
import prompts from 'prompts';

import { IntegrationScope } from '@gitbook/api';

import packageJSON from '../package.json';
import { fileExists } from './files';
import { DEFAULT_MANIFEST_FILE, writeIntegrationManifest } from './manifest';

/**
 * Interactive prompt to create a new integration.
 */
export async function promptNewIntegration(dirPath: string): Promise<void> {
    if ((await fileExists(dirPath)) === 'file') {
        throw new Error(`The path ${dirPath} is an existing file.`);
    }

    if (await fileExists(path.join(dirPath, DEFAULT_MANIFEST_FILE))) {
        throw new Error(`The path ${dirPath} already contains a ${DEFAULT_MANIFEST_FILE} file.`);
    }

    const response = await prompts([
        {
            type: 'text',
            name: 'name',
            message: 'Name of the integration:',
            initial: path.basename(dirPath),
        },
        {
            type: 'text',
            name: 'title',
            message: 'Title of the integration:',
            initial: (prev) => prev || '',
        },
        {
            type: 'text',
            name: 'script',
            initial: 'script.ts',
            message: 'Path to the JS/TS script (created if non-existant):',
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

    await initializeProject(dirPath, response);
    console.log('');
    console.log('Your integration is ready!');
    console.log(`Edit the ${response.script} file to add your integration logic.`);
    console.log('Then, run `gitbook publish` to upload it to GitBook.');
}

/**
 * Initialize a new project.
 */
export async function initializeProject(
    dirPath: string,
    project: {
        name: string;
        title: string;
        script: string;
        scopes: IntegrationScope[];
    }
) {
    const scriptPath = path.join(dirPath, project.script);

    // Create the directly first
    await fs.promises.mkdir(dirPath, { recursive: true });

    // Write the manifest
    await writeIntegrationManifest(path.join(dirPath, DEFAULT_MANIFEST_FILE), {
        name: project.name,
        title: project.title,
        script: path.relative(dirPath, scriptPath),
        scopes: project.scopes,
        secrets: {},
    });

    if (!(await fileExists(scriptPath))) {
        await fs.promises.writeFile(scriptPath, generateScript());
    }

    await extendPackageJson(dirPath, project.name);
}

/**
 * Extend the package.json file with the dependencies.
 */
export async function extendPackageJson(dirPath: string, projectName: string): Promise<void> {
    const packageJsonPath = path.join(dirPath, 'package.json');

    let packageJsonObject: {
        name?: string;
        private?: boolean;
        scripts?: { [key: string]: string };
        devDependencies?: { [key: string]: string };
    } = {};

    if ((await fileExists(packageJsonPath)) === 'file') {
        packageJsonObject = JSON.parse(await fs.promises.readFile(packageJsonPath, 'utf8'));
    } else {
        packageJsonObject.name = projectName;
        packageJsonObject.private = true;
        packageJsonObject.scripts = {
            publish: 'gitbook publish',
        };
    }

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
    return detent(`
        import { api } from '@gitbook/runtime';

        addEventListener('installation:setup', async (event) => {
            // Do something when the integration has been installed 
        });

        addEventListener('fetch', async (event) => {
            // Do something when receiving an HTTP request
            event.respondWith(new Response('Hello world!'));
        });

        addEventListener('space:content:updated', async (event) => {
            // Depending on the scopes of your integration
            // You can listen to different events related to user actions.
        });
    `).trim();
}
