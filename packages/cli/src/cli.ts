#!/usr/bin/env -S node --no-warnings

// ─────────────────────────────────────────────────────────────────────────────
// `gitbook` — the GitBook CLI.
//
// The command tree is largely generated from the GitBook OpenAPI spec (see
// scripts/generate-commands.ts → generated-commands.ts): every API operation is
// exposed as a command group at the top level, e.g. `gitbook organizations list`.
//
// Hand-written commands live alongside the generated ones: `login`/`logout`/
// `auth`/`whoami` for authentication, `completion` for shell completion, and the
// integration build/publish lifecycle — the `integration` group
// (new/dev/publish/unpublish/tail/check) and `openapi publish` — registered via
// registerCustomCommands. The `integration` group is singular to stay distinct
// from the spec-generated `integrations` group (raw integration API ops); the
// historical top-level spellings (`gitbook publish`, …) remain as deprecated
// aliases.
// ─────────────────────────────────────────────────────────────────────────────

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import checkNodeVersion from 'check-node-version';
import { program } from 'commander';
import prompts from 'prompts';

import { GITBOOK_DEFAULT_ENDPOINT } from '@gitbook/api';

import packageJSON from '../package.json';
import { authenticate, login, logout, whoami } from './remote';
import { withEnvironment } from './environments';
import { registerGeneratedCommands, COMPLETIONS } from './generated-commands';
import { registerCustomCommands } from './api-commands';

program.name('gitbook').description(packageJSON.description).version(packageJSON.version);

program
    .command('login')
    .option('-e, --endpoint <endpoint>', GITBOOK_DEFAULT_ENDPOINT)
    .option('--env <env>', 'environment to authenticate to')
    .description('authenticate with gitbook.com using your browser')
    .action(async (options) => {
        return withEnvironment(options.env, async () => {
            await login({
                endpoint: options.endpoint || GITBOOK_DEFAULT_ENDPOINT,
            });
        });
    });

program
    .command('logout')
    .option('--env <env>', 'environment to sign out of')
    .description('remove the stored authentication')
    .action(async (options) => {
        return withEnvironment(options.env, async () => {
            await logout();
        });
    });

program
    .command('auth')
    .option('-t, --token <token>')
    .option('-e, --endpoint <endpoint>', GITBOOK_DEFAULT_ENDPOINT)
    .option('--env <env>', 'environment to authenticate to')
    .description('authenticate with gitbook.com using an API token')
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

const COMPLETION_MARKER = '# >>> gitbook completion >>>';

function detectShell(): string | undefined {
    const sh = process.env.SHELL ? path.basename(process.env.SHELL) : '';
    return COMPLETIONS[sh] ? sh : undefined;
}

// Wire the completion into the user's shell so it takes effect on next launch.
// bash/zsh get a `source <(gitbook completion <shell>)` line in their rc (which
// self-updates as the CLI changes); fish gets the script dropped into its
// autoloaded completions directory.
function installCompletion(shell: string): void {
    if (shell === 'fish') {
        const dir = path.join(os.homedir(), '.config', 'fish', 'completions');
        fs.mkdirSync(dir, { recursive: true });
        const target = path.join(dir, 'gitbook.fish');
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
    const block = `\n${COMPLETION_MARKER}\nsource <(gitbook completion ${shell})\n# <<< gitbook completion <<<\n`;
    fs.appendFileSync(rc, block, 'utf8');
    console.log(`Added gitbook completion to ${rc}. Run \`source ${rc}\` or start a new shell.`);
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
            // The dev server is long-running; exiting here would tear it down
            // immediately, so leave the process running. Handle both the canonical
            // `integration dev` and the deprecated top-level `dev` alias.
            const [first, second] = program.args;
            if (first === 'dev' || (first === 'integration' && second === 'dev')) {
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
