#!/usr/bin/env -S node --no-warnings

import checkNodeVersion from 'check-node-version';
import { program } from 'commander';
import * as path from 'path';
import prompts from 'prompts';

import { GITBOOK_DEFAULT_ENDPOINT } from '@gitbook/api';

import packageJSON from '../package.json';
import { startIntegrationsDevServer } from './dev';
import { promptNewIntegration } from './init';
import { DEFAULT_MANIFEST_FILE, resolveIntegrationManifestPath } from './manifest';
import { publishIntegration, unpublishIntegration } from './publish';
import { authenticate, whoami } from './remote';

program
    .name(Object.keys(packageJSON.bin)[0])
    .description(packageJSON.description)
    .version(packageJSON.version);

program
    .command('auth')
    .option('-t, --token <token>')
    .option('-e, --endpoint <endpoint>', GITBOOK_DEFAULT_ENDPOINT)
    .description('authenticate with gitbook.com')
    .action(async (options) => {
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

        await authenticate(options.endpoint || GITBOOK_DEFAULT_ENDPOINT, token);
    });

program
    .command('whoami')
    .description('print info about the current user configuration')
    .action(async () => {
        await whoami();
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
    .description('run the integrations dev server')
    .argument('[space]', 'ID of the development space', undefined)
    .action(async (space?: string) => {
        await startIntegrationsDevServer(space);
    });

program
    .command('publish')
    .argument('[file]', 'integration definition file', DEFAULT_MANIFEST_FILE)
    .option(
        '-o, --organization <organization>',
        'organization to publish to',
        process.env.GITBOOK_ORGANIZATION
    )
    .description('publish a new version of the integration')
    .action(async (filePath, options) => {
        await publishIntegration(
            await resolveIntegrationManifestPath(path.resolve(process.cwd(), filePath)),
            {
                ...(options.organization ? { organization: options.organization } : {}),
            }
        );
    });

program
    .command('unpublish')
    .argument('[integration]', 'Name of the integration to unpublish')
    .description('unpublish an integration')
    .action(async (name, options) => {
        const response = await prompts({
            type: 'confirm',
            name: 'confirm',
            message: `Are you sure you want to unpublish the integration "${name}"?\nIt cannot be undone, it will be removed from the marketplace, and from all installed accounts.`,
            initial: false,
        });

        if (response.confirm) {
            await unpublishIntegration(name);
        }
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
        }
    );
});
