#!/usr/bin/env -S node --no-warnings

import checkNodeVersion from 'check-node-version';
import { program } from 'commander';
import * as path from 'path';
import { URL } from 'url';
import prompts from 'prompts';

import { GITBOOK_DEFAULT_ENDPOINT } from '@gitbook/api';

import packageJSON from '../package.json';
import { startIntegrationsDevServer } from './dev';
import { promptNewIntegration } from './init';
import { DEFAULT_MANIFEST_FILE, resolveIntegrationManifestPath } from './manifest';
import { publishIntegration, unpublishIntegration } from './publish';
import { authenticate, whoami } from './remote';
import { tailLogs } from './tail';
import { checkIntegrationBuild } from './check';
import {
    publishOpenAPISpecificationFromFilepath,
    publishOpenAPISpecificationFromURL,
} from 'openapi/publish';
import { checkIsHTTPURL } from './util';
import { withEnvironment } from './environments';

program
    .name(Object.keys(packageJSON.bin)[0])
    .description(packageJSON.description)
    .version(packageJSON.version);

program
    .command('auth')
    .option('-t, --token <token>')
    .option('-e, --endpoint <endpoint>', GITBOOK_DEFAULT_ENDPOINT)
    .option('--env <env>', 'environment to authenticate to')
    .description('authenticate with gitbook.com')
    .action(async (options) => {
        return withEnvironment(options.env, async () => {
            let token = options.token;
            if (!token) {
                const response = await prompts({
                    type: 'password',
                    name: 'token',
                    message:
                        'Enter your API token (create one at https://app.gitbook.com/account/developer):',
                });
                token = response.token;
            }

            await authenticate({
                endpoint: options.endpoint || GITBOOK_DEFAULT_ENDPOINT,
                authToken: token,
            });
        });
    });

program
    .command('whoami')
    .option('--env <env>', 'environment to authenticate to')
    .description('print info about the current user configuration')
    .action(async (options) => {
        return withEnvironment(options.env, async () => {
            await whoami();
        });
    });

program
    .command('new')
    .argument('[dir]', 'directory to initialize project in', undefined)
    .description('initialize a new project')
    .action(async (dirPath, options) => {
        await promptNewIntegration(dirPath);
    });

program
    .command('dev')
    .argument('[file]', 'integration definition file', DEFAULT_MANIFEST_FILE)
    .description('run the integrations dev server')
    .option('-a, --all', 'Proxy all events from all installations')
    .option('--env <env>', 'environment to use')
    .action(async (filePath, options) => {
        return withEnvironment(options.env, async () => {
            await startIntegrationsDevServer(
                await resolveIntegrationManifestPath(path.resolve(process.cwd(), filePath)),
                {
                    all: options.all ?? false,
                },
            );
        });
    });

program
    .command('publish')
    .argument('[file]', 'integration definition file', DEFAULT_MANIFEST_FILE)
    .option('--env <env>', 'environment to use')
    .option(
        '-o, --organization <organization>',
        'organization to publish to',
        process.env.GITBOOK_ORGANIZATION,
    )
    .description('publish a new version of the integration')
    .action(async (filePath, options) => {
        return withEnvironment(options.env, async () => {
            await publishIntegration(
                await resolveIntegrationManifestPath(path.resolve(process.cwd(), filePath)),
                {
                    ...(options.organization ? { organization: options.organization } : {}),
                },
            );
        });
    });

program
    .command('unpublish')
    .argument('[integration]', 'Name of the integration to unpublish')
    .option('--env <env>', 'environment to use')
    .description('unpublish an integration')
    .action(async (name, options) => {
        const response = await prompts({
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure you want to unpublish the integration "${name}"?\nIt cannot be undone, it will be removed from the marketplace, and from all installed accounts.`,
            initial: false,
        });

        if (response.confirm) {
            return withEnvironment(options.env, async () => {
                await unpublishIntegration(name);
            });
        }
    });

program
    .command('tail')
    .description('fetch and print the execution logs of the integration')
    .option('--env <env>', 'environment to use')
    .action(async (options) => {
        return withEnvironment(options.env, async () => {
            await tailLogs();
        });
    });

program
    .command('check')
    .argument('[file]', 'integration definition file', DEFAULT_MANIFEST_FILE)
    .description('check the integration build')
    .action(async (filePath) => {
        // We use a special env "test" to make it easy to configure the integration for testing.
        return withEnvironment('test', async () => {
            await checkIntegrationBuild(
                await resolveIntegrationManifestPath(path.resolve(process.cwd(), filePath)),
            );
        });
    });

const openAPIProgram = program.command('openapi').description('manage OpenAPI specifications');
openAPIProgram
    .command('publish')
    .description('publish an OpenAPI specification from a file or URL')
    .argument('<file-or-url>', 'OpenAPI specification file path or URL')
    .requiredOption('-s, --spec <spec>', 'name of the OpenAPI specification')
    .requiredOption('-o, --organization <organization>', 'organization to publish to')
    .action(async (filepathOrURL, options) => {
        const spec = checkIsHTTPURL(filepathOrURL)
            ? await publishOpenAPISpecificationFromURL({
                  specSlug: options.spec,
                  organizationId: options.organization,
                  url: filepathOrURL,
              })
            : await publishOpenAPISpecificationFromFilepath({
                  specSlug: options.spec,
                  organizationId: options.organization,
                  filepath: path.resolve(process.cwd(), filepathOrURL),
              });
        console.log(`OpenAPI specification "${options.spec}" published to ${spec.urls.app}`);
    });

checkNodeVersion({ node: '>= 18' }, (error, result) => {
    if (error) {
        console.error(error);
        return;
    }

    if (!result.isSatisfied) {
        console.error('The GitBook CLI requires Node v18 or later.');
        process.exit(1);
    }

    program.parseAsync().then(
        (command) => {
            /**
             * If the command is "dev", we don't want to exit the process as it will
             * kill the dev server.
             */
            if (command.args[0] === 'dev') {
                return;
            }

            process.exit(0);
        },
        (error) => {
            console.error(error.message);
            process.exit(1);
        },
    );
});
