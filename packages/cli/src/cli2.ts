#!/usr/bin/env -S node --no-warnings

// ─────────────────────────────────────────────────────────────────────────────
// `gitbook2` — standalone CLI for exercising the GitBook API.
//
// This is a separate binary from the main `gitbook` CLI (which builds and
// publishes integrations). It exists so the spec-generated API commands can be
// developed and tested in isolation, without cluttering the stable `gitbook`
// command tree. The generated and hand-written commands are mounted at the top
// level here (no `api` wrapper), so e.g. `gitbook2 organizations list`.
//
// It shares auth/config/build with the main CLI — `auth` and `whoami` are
// re-exposed so the binary is self-contained, and the integration lifecycle
// commands from the main CLI are ported here too: the `integration` group
// (new/dev/publish/unpublish/tail/check) and `openapi publish`, registered via
// registerCustomCommands. The `integration` group is singular to stay distinct
// from the spec-generated `integrations` group (raw integration API ops).
// ─────────────────────────────────────────────────────────────────────────────

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import checkNodeVersion from 'check-node-version';
import { program } from 'commander';
import prompts from 'prompts';

import { GITBOOK_DEFAULT_ENDPOINT } from '@gitbook/api';

import packageJSON from '../package.json';
import { authenticate, whoami } from './remote';
import { withEnvironment } from './environments';
import { registerGeneratedCommands, COMPLETIONS } from './generated-commands';
import { registerCustomCommands } from './api-commands';

program.name('gitbook2').description('GitBook API testing CLI').version(packageJSON.version);

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
    .option('--json', 'Output as JSON (machine-readable)')
    .option('--yaml', 'Output as YAML (machine-readable)')
    .description('print info about the current user configuration')
    .action(async (options) => {
        return withEnvironment(options.env, async () => {
            await whoami({ json: options.json, yaml: options.yaml });
        });
    });

const COMPLETION_MARKER = '# >>> gitbook2 completion >>>';

function detectShell(): string | undefined {
    const sh = process.env.SHELL ? path.basename(process.env.SHELL) : '';
    return COMPLETIONS[sh] ? sh : undefined;
}

// Wire the completion into the user's shell so it takes effect on next launch.
// bash/zsh get a `source <(gitbook2 completion <shell>)` line in their rc (which
// self-updates as the CLI changes); fish gets the script dropped into its
// autoloaded completions directory.
function installCompletion(shell: string): void {
    if (shell === 'fish') {
        const dir = path.join(os.homedir(), '.config', 'fish', 'completions');
        fs.mkdirSync(dir, { recursive: true });
        const target = path.join(dir, 'gitbook2.fish');
        fs.writeFileSync(target, COMPLETIONS.fish, 'utf8');
        console.log(`Installed fish completion to ${target}. Start a new shell to use it.`);
        return;
    }

    const rc = path.join(os.homedir(), shell === 'zsh' ? '.zshrc' : '.bashrc');
    const existing = fs.existsSync(rc) ? fs.readFileSync(rc, 'utf8') : '';
    if (existing.includes(COMPLETION_MARKER)) {
        console.log(`Completion already installed in ${rc}. Nothing to do.`);
        return;
    }
    const block = `\n${COMPLETION_MARKER}\nsource <(gitbook2 completion ${shell})\n# <<< gitbook2 completion <<<\n`;
    fs.appendFileSync(rc, block, 'utf8');
    console.log(`Added gitbook2 completion to ${rc}. Run \`source ${rc}\` or start a new shell.`);
}

program
    .command('completion [shell]')
    .description('print a shell completion script (bash, zsh, or fish)')
    .option('--install', "install the completion into your shell's config instead of printing it")
    .action((shellArg: string | undefined, options: { install?: boolean }) => {
        const shell = shellArg ?? detectShell();
        if (!shell || !COMPLETIONS[shell]) {
            console.error(
                shell
                    ? `Unknown shell '${shell}'. Supported: ${Object.keys(COMPLETIONS).join(', ')}.`
                    : `Could not detect your shell. Pass one explicitly: ${Object.keys(COMPLETIONS).join(', ')}.`,
            );
            process.exit(1);
        }
        if (options.install) {
            installCompletion(shell);
        } else {
            process.stdout.write(COMPLETIONS[shell]);
        }
    });

// Mount the spec-generated and hand-written API commands at the top level.
registerGeneratedCommands(program);
registerCustomCommands(program);

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
        () => {
            // `integration dev` starts a long-running dev server; exiting here
            // would tear it down immediately, so leave the process running.
            if (program.args[0] === 'integration' && program.args[1] === 'dev') {
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
