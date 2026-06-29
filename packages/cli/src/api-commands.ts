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
 * exposes the raw integration API operations.
 */
export function registerCustomCommands(program: Command): void {
    const integration = program
        .command('integration')
        .description('build, run, and publish a GitBook integration');

    integration
        .command('new')
        .argument('[dir]', 'directory to initialize project in', undefined)
        .description('initialize a new project')
        .action(async (dirPath) => {
            await promptNewIntegration(dirPath);
        });

    integration
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

    integration
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

    integration
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

    integration
        .command('tail')
        .description('fetch and print the execution logs of the integration')
        .option('--env <env>', 'environment to use')
        .action(async (options) => {
            return withEnvironment(options.env, async () => {
                await tailLogs();
            });
        });

    integration
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
}
