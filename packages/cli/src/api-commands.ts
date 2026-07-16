import { Command } from 'commander';
import * as path from 'path';
import prompts from 'prompts';

import { startIntegrationsDevServer } from './dev';
import { promptNewIntegration } from './init';
import { DEFAULT_MANIFEST_FILE, resolveIntegrationManifestPath } from './manifest';
import { publishIntegration, unpublishIntegration } from './publish';
import { tailLogs } from './tail';
import { checkIntegrationBuild } from './check';
import {
    publishOpenAPISpecificationFromFilepath,
    publishOpenAPISpecificationFromURL,
} from './openapi/publish';
import { checkIsHTTPURL } from './util';
import { withEnvironment } from './environments';

/**
 * Hand-written companion to the auto-generated `generated-commands.ts`.
 *
 * The generator can only express operations that exist in the OpenAPI spec.
 * Commands that don't map cleanly onto a single spec operation — multi-step
 * flows, file/URL handling, bespoke output — live here instead, and are
 * registered onto the same parent Command as the generated ones so they are
 * all discoverable together.
 *
 * This file is never touched by the generator.
 *
 * These are the integration build/publish lifecycle commands ported from the
 * original `gitbook` CLI. They are grouped under `integration` (singular) to
 * keep them distinct from the spec-generated `integrations` group, which
 * exposes the raw integration API operations. Each is also exposed as a hidden
 * top-level alias (e.g. `new`, `publish`) so the historical `gitbook <verb>`
 * spelling keeps working with a deprecation warning while users migrate.
 */

interface LifecycleCommand {
    name: string;
    description: string;
    /**
     * Wire arguments + options onto a command. Called once per mount (canonical
     * + alias) so both spellings accept exactly the same input.
     */
    configure: (cmd: Command) => Command;
    /**
     * Shared action handler. The signature matches what commander passes
     * (...operands, options, command); extra trailing args are ignored.
     */
    action: (...args: any[]) => void | Promise<void>;
}

const LIFECYCLE_COMMANDS: LifecycleCommand[] = [
    {
        name: 'new',
        description: 'initialize a new project',
        configure: (cmd) => cmd.argument('[dir]', 'directory to initialize project in', undefined),
        action: async (dirPath: string) => {
            await promptNewIntegration(dirPath);
        },
    },
    {
        name: 'dev',
        description: 'run the integrations dev server',
        configure: (cmd) =>
            cmd
                .argument('[file]', 'integration definition file', DEFAULT_MANIFEST_FILE)
                .option('-a, --all', 'Proxy all events from all installations')
                .option('--env <env>', 'environment to use'),
        action: async (filePath: string, options: { all?: boolean; env?: string }) => {
            return withEnvironment(options.env, async () => {
                await startIntegrationsDevServer(
                    await resolveIntegrationManifestPath(path.resolve(process.cwd(), filePath)),
                    {
                        all: options.all ?? false,
                    },
                );
            });
        },
    },
    {
        name: 'publish',
        description: 'publish a new version of the integration',
        configure: (cmd) =>
            cmd
                .argument('[file]', 'integration definition file', DEFAULT_MANIFEST_FILE)
                .option('--env <env>', 'environment to use')
                .option(
                    '-o, --organization <organization>',
                    'organization to publish to',
                    process.env.GITBOOK_ORGANIZATION,
                ),
        action: async (filePath: string, options: { env?: string; organization?: string }) => {
            return withEnvironment(options.env, async () => {
                await publishIntegration(
                    await resolveIntegrationManifestPath(path.resolve(process.cwd(), filePath)),
                    {
                        ...(options.organization ? { organization: options.organization } : {}),
                    },
                );
            });
        },
    },
    {
        name: 'unpublish',
        description: 'unpublish an integration',
        configure: (cmd) =>
            cmd
                .argument('[integration]', 'Name of the integration to unpublish')
                .option('--env <env>', 'environment to use'),
        action: async (name: string, options: { env?: string }) => {
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
        },
    },
    {
        name: 'tail',
        description: 'fetch and print the execution logs of the integration',
        configure: (cmd) => cmd.option('--env <env>', 'environment to use'),
        action: async (options: { env?: string }) => {
            return withEnvironment(options.env, async () => {
                await tailLogs();
            });
        },
    },
    {
        name: 'check',
        description: 'check the integration build',
        configure: (cmd) =>
            cmd.argument('[file]', 'integration definition file', DEFAULT_MANIFEST_FILE),
        action: async (filePath: string) => {
            // We use a special env "test" to make it easy to configure the integration for testing.
            return withEnvironment('test', async () => {
                await checkIntegrationBuild(
                    await resolveIntegrationManifestPath(path.resolve(process.cwd(), filePath)),
                );
            });
        },
    },
];

export function registerCustomCommands(program: Command): void {
    // Derive the binary name at runtime instead of hardcoding it, so the
    // deprecation messages below stay correct regardless of the program name.
    const binName = program.name();

    const integration = program
        .command('integration')
        .description('build, run, and publish a GitBook integration');

    for (const def of LIFECYCLE_COMMANDS) {
        // Canonical home: `<bin> integration <name>`.
        def.configure(integration.command(def.name).description(def.description)).action(
            def.action,
        );

        // Backward-compat: the historical top-level spelling `<bin> <name>`,
        // hidden from help and emitting a deprecation warning (to stderr, so it
        // never pollutes machine-readable stdout) before delegating to the same
        // handler. Keeps existing scripts and muscle memory working.
        const alias = def.configure(
            program
                .command(def.name, { hidden: true })
                .description(`(deprecated) ${def.description}`),
        );
        alias.action(async (...args: any[]) => {
            console.error(
                `⚠️  \`${binName} ${def.name}\` is deprecated; use \`${binName} integration ${def.name}\` instead.`,
            );
            return def.action(...args);
        });
    }

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
}
