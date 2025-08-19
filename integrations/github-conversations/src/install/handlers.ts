import { Logger } from '@gitbook/runtime';
import { GitHubRuntimeContext } from '../types';

const logger = Logger('github-conversations');

/**
 * Handle fresh GitHub App installation
 */
export async function handleInstallationSetup(
    context: GitHubRuntimeContext,
    githubInstallationId: string,
    gitbookInstallationId: string,
): Promise<Response> {
    try {
        // Fetch the latest installation data to ensure we don't overwrite existing installations
        let existingConfig: any = {};
        let existingInstallationIds: string[] = [];

        try {
            const { data: installation } =
                await context.api.integrations.getIntegrationInstallationById(
                    context.environment.integration.name,
                    gitbookInstallationId,
                );
            existingConfig = installation?.configuration || {};
            existingInstallationIds = existingConfig.installation_ids || [];

            logger.info('Fetched existing installation data', {
                existingInstallationIds,
                gitbookInstallationId,
            });
        } catch (error) {
            logger.info('No existing installation found or error fetching it', {
                error: error instanceof Error ? error.message : String(error),
                gitbookInstallationId,
            });
            // Use context as fallback if API call fails
            existingConfig = context.environment.installation?.configuration || {};
            existingInstallationIds = existingConfig.installation_ids || [];
        }

        // Add the new GitHub installation to the list
        const updatedInstallationIds = Array.from(
            new Set([...existingInstallationIds, githubInstallationId]),
        );

        logger.info('Adding GitHub installation', {
            githubInstallationId,
            existingInstallationIds,
            updatedInstallationIds,
            gitbookInstallationId,
        });

        await context.api.integrations.updateIntegrationInstallation(
            context.environment.integration.name,
            gitbookInstallationId,
            {
                configuration: {
                    ...existingConfig,
                    installation_ids: updatedInstallationIds,
                },
                externalIds: updatedInstallationIds,
            },
        );

        logger.info('GitHub App installation stored in GitBook installation', {
            githubInstallationId,
            gitbookInstallationId,
            totalInstallations: updatedInstallationIds.length,
        });

        return new Response(
            `<html><body>
                <h1>GitHub App Connected!</h1>
                <p>Your GitHub App has been successfully connected to GitBook.</p>
                <p>We'll start ingesting your discussions shortly.</p>
                <script>window.close();</script>
            </body></html>`,
            {
                headers: {
                    'Content-Type': 'text/html',
                },
            },
        );
    } catch (error) {
        logger.error('Failed to store GitHub installation_id', {
            error: error instanceof Error ? error.message : String(error),
            githubInstallationId,
            gitbookInstallationId,
        });

        return new Response(
            `<html><body>
                <h1>Setup Failed</h1>
                <p>There was an error connecting your GitHub App to GitBook.</p>
                <p>Please try again or contact support.</p>
                <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
            </body></html>`,
            {
                status: 500,
                headers: { 'Content-Type': 'text/html' },
            },
        );
    }
}
