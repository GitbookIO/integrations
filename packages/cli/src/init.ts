import type { JSONSchemaForNPMPackageJsonFiles2 as PackageJSON } from '@schemastore/package';
import { spawn } from 'child_process';
import detent from 'dedent-js';
import * as fs from 'fs';
import * as path from 'path';
import prompts from 'prompts';

import { IntegrationScope, IntegrationVisibility } from '@gitbook/api';

import packageJSON from '../package.json';
import { fileExists } from './files';
import { DEFAULT_MANIFEST_FILE, writeIntegrationManifest, IntegrationNameSchema } from './manifest';

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
            initial: path.basename(dir || process.cwd()),
            validate: (value: string) => {
                const result = IntegrationNameSchema.safeParse(value);
                if (result.success) {
                    return true;
                } else {
                    return `Invalid integration name: ${value}, it must begin with an alphanumeric character and only contain alphanumeric characters and hyphens.`;
                }
            },
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
                {
                    title: IntegrationScope.SpaceGitSync,
                    value: IntegrationScope.SpaceGitSync,
                },
                {
                    title: IntegrationScope.SiteMetadataRead,
                    value: IntegrationScope.SiteMetadataRead,
                },
                {
                    title: IntegrationScope.SiteAdaptiveRead,
                    value: IntegrationScope.SiteAdaptiveRead,
                },
                {
                    title: IntegrationScope.SiteAdaptiveWrite,
                    value: IntegrationScope.SiteAdaptiveWrite,
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
            `\n❌ The path ${dirPath} already contains a ${DEFAULT_MANIFEST_FILE} file.`,
        );
    }

    await initializeProject(dirPath, response);
    console.log('');
    console.log(`🎉 Your integration is ready at ${dirPath}`);
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
    },
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
        blocks: [
            {
                id: project.name,
                title: project.title,
                description: 'My GitBook Integration',
            },
        ],
        secrets: {},
    });

    await fs.promises.writeFile(scriptPath, generateScript(project));
    await fs.promises.writeFile(path.join(dirPath, 'tsconfig.json'), generateTSConfig());

    await extendPackageJson(dirPath, project.name);
    console.log(`\n⬇️  Installing dependencies...\n`);
    await installDependencies(dirPath);
}

/**
 * Extend the package.json file with the dependencies.
 */
export async function extendPackageJson(dirPath: string, projectName: string): Promise<void> {
    const packageJsonPath = path.join(dirPath, 'package.json');

    const packageJsonObject: PackageJSON = {
        name: projectName,
        private: true,
        scripts: {
            typecheck: 'tsc --noEmit',
            publish: 'gitbook publish .',
        },
        dependencies: {
            '@gitbook/runtime': '*',
        },
        devDependencies: {
            [packageJSON.name]: `^${packageJSON.version}`,
            '@gitbook/tsconfig': '*',
            '@cloudflare/workers-types': '*',
        },
    };

    await fs.promises.writeFile(packageJsonPath, JSON.stringify(packageJsonObject, null, 4));
}

/**
 * Install the project dependencies using npm.
 */
export function installDependencies(dirPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const install = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['install'], {
            stdio: 'inherit',
            cwd: dirPath,
        });

        install.on('close', (code) => {
            if (code !== 0) {
                throw new Error(`npm install exited with code ${code}`);
            }
            resolve();
        });
    });
}

/**
 * Generate the script code.
 */
export function generateScript(project: { name: string }): string {
    const src = detent(`
    import {
        createIntegration,
        createComponent,
        FetchEventCallback,
        RuntimeContext,
      } from "@gitbook/runtime";

      type IntegrationContext = {} & RuntimeContext;
      type IntegrationBlockProps = {};
      type IntegrationBlockState = { message: string };
      type IntegrationAction = { action: "click" };

      const handleFetchEvent: FetchEventCallback<IntegrationContext> = async (
        request,
        context
      ) => {
        const { api } = context;
        const user = api.user.getAuthenticatedUser();

        return new Response(JSON.stringify(user));
      };

      const exampleBlock = createComponent<
         IntegrationBlockProps,
         IntegrationBlockState,
         IntegrationAction,
         IntegrationContext
      >({
        componentId: "${project.name}",
        initialState: (props) => {
          return {
            message: "Click Me",
          };
        },
        action: async (element, action, context) => {
          switch (action.action) {
            case "click":
              console.log("Button Clicked");
              return {};
          }
        },
        render: async (element, context) => {
          return (
            <block>
              <button label={element.state.message} onPress={{ action: "click" }} />
            </block>
          );
        },
      });

      export default createIntegration({
        fetch: handleFetchEvent,
        components: [exampleBlock],
        events: {},
      });
    `).trim();

    return `${src}\n`;
}

export function generateTSConfig(): string {
    return detent(`
        {
            "extends": "@gitbook/tsconfig/integration.json",
            "compilerOptions": {
                "lib": ["ESNext", "DOM"],
                "moduleResolution": "bundler",
                "module": "ESNext",
                "strict": true
            }
        }
    `).trim();
}
