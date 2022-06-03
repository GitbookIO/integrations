import { program } from 'commander';
import * as path from 'path';
import prompts from 'prompts';

import { GITBOOK_DEFAULT_ENDPOINT } from '@gitbook/api';

import packageJSON from '../package.json';
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
        // const response = await prompts([
        //     {
        //         type: 'text',
        //         name: 'title',
        //         message: 'Title of the integration:',
        //     },
        //     {
        //         type: 'text',
        //         name: 'script',
        //         initial: 'script.js',
        //         message: 'Path to the JS/TS script (created if non-existant):',
        //     },
        // ]);
    });

program
    .command('publish')
    .argument('[file]', 'integration definition file', './integration.yaml')
    .description('publish a new version of the integration')
    .action(async (filePath, options) => {
        await publishIntegration(path.resolve(process.cwd(), filePath));
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
