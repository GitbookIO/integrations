import { program } from 'commander';
import * as path from 'path';
import prompts from 'prompts';

import { GITBOOK_DEFAULT_ENDPOINT } from '@gitbook/api';

import packageJSON from '../package.json';
import { promptNewIntegration } from './init';
import { DEFAULT_MANIFEST_FILE, resolveIntegrationManifestPath } from './manifest';
import { publishIntegration } from './publish';
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
    .argument('[dir]', 'directory to initialize project in', './')
    .description('initialize a new project')
    .action(async (dirPath, options) => {
        await promptNewIntegration(path.resolve(process.cwd(), dirPath));
    });

program
    .command('publish')
    .argument('[file]', 'integration definition file', DEFAULT_MANIFEST_FILE)
    .description('publish a new version of the integration')
    .action(async (filePath, options) => {
        await publishIntegration(
            await resolveIntegrationManifestPath(path.resolve(process.cwd(), filePath))
        );
    });

program.parseAsync().then(
    () => {
        process.exit(0);
    },
    (error) => {
        console.error(error.message);
        process.exit(1);
    }
);
