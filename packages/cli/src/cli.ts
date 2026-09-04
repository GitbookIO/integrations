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
import dedent from 'dedent-js';
import { program } from 'commander';
import prompts from 'prompts';

import { GITBOOK_DEFAULT_ENDPOINT } from '@gitbook/api';

import packageJSON from '../package.json';
import { formatCommandFailure } from './errors';
import { reportFeedback, resolveFeedbackInput } from './feedback';
import { authenticate, login, logout, whoami } from './remote';
import { withEnvironment } from './environments';
import { registerGeneratedCommands, COMPLETIONS } from './generated-commands';
import { printResult } from './output';
import { registerCustomCommands } from './api-commands';
import { installCommandTreeHelp } from './help-tree';

program.name('gitbook').description(packageJSON.description).version(packageJSON.version);

// List subcommands alphabetically in --help (both the built-in command list and
// the nested tree in help-tree.ts), rather than in registration order.
program.configureHelp({ sortSubcommands: true });

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

program
    .command('feedback')
    .description(
        'report friction with the CLI, or suggest an improvement — agents: use it when a command confuses, blocks or fails you, or nothing can do what you need',
    )
    .option(
        '--category <category>',
        'usability | reliability | documentation | efficiency | interoperability | could-not-accomplish',
    )
    .option('--summary <summary>', 'one short sentence naming the problem (max 256 chars)')
    .option(
        '--command <command>',
        'the command it was about, without arguments; omit when nothing could do what you needed',
    )
    .option('--flag <name...>', 'flag names passed to that command (names only, never values)')
    .option('--severity <severity>', 'low | medium | high')
    .option('--detail <detail>', 'what happened and how you ran into it')
    .option('--goal <goal>', 'what you were trying to accomplish')
    .option('--workaround <workaround>', 'how you worked around it, if you did')
    .option('--model <model>', 'the model reporting, when an agent is running the CLI')
    .option('--on-demand', 'the user explicitly asked for this to be reported')
    .option('--body <json>', 'the whole report as a JSON object, instead of the flags above')
    .option('--json', 'Output as JSON (machine-readable)')
    .option('--yaml', 'Output as YAML (machine-readable)')
    .option('--pretty', 'Output in human-readable form (default when attached to a terminal)')
    .option('--full', 'Show all fields (disable compact summaries in pretty mode)')
    .option('--env <env>', 'environment to report to')
    .addHelpText(
        'after',
        dedent(`

        Report as soon as you hit the problem, while you still remember what you were trying
        to do, then carry on. Reporting is cheap and changes nothing about your current task.

        Worth reporting:
          - a command, flag or its help text that led you to the wrong choice
          - a command that failed, or produced output you could not use
          - a task that took far more commands than it should have
          - something you needed that no command could do (omit --command: that records the
            missing capability rather than blaming one command)
          - an improvement worth making, even when nothing went wrong

        Suggestions have no category of their own yet, so pick the one the improvement is
        about: efficiency for fewer commands or less output, usability for a clearer name or
        flag, interoperability for composing better, could-not-accomplish for something
        missing entirely.

        Categories:
          usability             hard to understand or use correctly
          reliability           failed unexpectedly or returned something unusable
          documentation         its own help or docs were missing, unclear or misleading
          efficiency            took more commands, steps or output than it should have
          interoperability      did not compose with other commands or formats
          could-not-accomplish  nothing available could do what was needed

        Use --severity high only when you could not finish the task at all.

        Never put flag values, file contents, credentials or anything identifying a person
        into a report. Describe the problem, not the data. --flag takes names only.

        Agents can pass the whole report as one object instead of flags:

          gitbook feedback --body '{
            "category": "documentation",
            "severity": "medium",
            "summary": "publish --draft is not documented",
            "command": "gitbook integration publish",
            "flags": ["--draft"],
            "goal": "Publish a draft integration"
          }'
        `),
    )
    .action(async (options) => {
        return withEnvironment(options.env, async () => {
            const input = resolveFeedbackInput(
                options.body ? JSON.parse(options.body) : undefined,
                {
                    category: options.category,
                    summary: options.summary,
                    command: options.command,
                    flags: options.flag,
                    severity: options.severity,
                    detail: options.detail,
                    goal: options.goal,
                    workaround: options.workaround,
                    model: options.model,
                    onDemand: options.onDemand,
                },
            );

            printResult(await reportFeedback(input), options);
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

// The integration build/publish lifecycle (new/dev/publish/…) lives under the
// singular `integration` group, kept distinct from the spec-generated plural
// `integrations` group (raw API ops). People reasonably look under `integrations`
// first, so point them across from there.
const integrationsGroup = program.commands.find((c) => c.name() === 'integrations');
integrationsGroup?.addHelpText(
    'after',
    `\nTo create, run, or publish your own integration (new, dev, publish, …), see \`${program.name()} integration --help\`.`,
);

// Reveal nested subgroups in `--help` (Commander shows only immediate children).
installCommandTreeHelp(program);

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
            console.error(formatCommandFailure(error, program.args));
            process.exit(1);
        },
    );
});
