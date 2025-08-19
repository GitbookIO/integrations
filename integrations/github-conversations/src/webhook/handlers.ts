import { Logger } from '@gitbook/runtime';
import pMap from 'p-map';
import { getOctokitClient } from '../client';
import { getRepoDiscussion, parseDiscussionAsGitBook } from '../query';
import { GitHubRuntimeContext, GitHubWebhookPayload } from '../types';

const logger = Logger('github-conversations');

/**
 * Handle GitHub discussion closed events
 */
export async function handleDiscussionClosed(
    context: GitHubRuntimeContext,
    payload: GitHubWebhookPayload,
): Promise<Response> {
    logger.info('Processing GitHub discussion closed event', {
        action: payload.action,
        repository: payload.repository?.full_name,
        discussionNumber: payload.discussion?.number,
    });

    const repositoryFullName = payload.repository.full_name;
    const githubInstallationId = payload.installation?.id.toString();

    if (!githubInstallationId) {
        logger.error('No GitHub installation ID in webhook payload');
        return new Response('Missing installation ID', { status: 400 });
    }

    // Find all GitBook installations matching this GitHub installation ID
    const {
        data: { items: installations },
    } = await context.api.integrations.listIntegrationInstallations(
        context.environment.integration.name,
        {
            externalId: githubInstallationId,
        },
    );

    if (installations.length === 0) {
        logger.info('No installations found for GitHub installation. Proper clean up failed', {
            githubInstallationId,
            repository: repositoryFullName,
        });
        return new Response('OK', { status: 200 });
    }

    // Process the webhook for each matching installation
    await pMap(
        installations,
        async (installation) => {
            try {
                // Create installation-specific context to get the Octokit client
                const installationContext = {
                    ...context,
                    environment: {
                        ...context.environment,
                        installation,
                    },
                };

                const octokit = await getOctokitClient(installationContext, githubInstallationId);
                const [owner, repo] = repositoryFullName.split('/');

                // Fetch the full discussion data using GraphQL
                const discussionResponse = await getRepoDiscussion(
                    octokit,
                    owner,
                    repo,
                    payload.discussion!.number,
                );

                if (!discussionResponse.repository.discussion) {
                    logger.debug('Discussion not found', {
                        discussionNumber: payload.discussion!.number,
                        repository: repositoryFullName,
                        installationId: installation.id,
                    });
                    return;
                }

                // Convert GitHub discussion to GitBook conversation using the unified parser
                const gitbookConversation = parseDiscussionAsGitBook(
                    discussionResponse.repository.discussion,
                );

                if (!gitbookConversation) {
                    logger.debug('Skipping discussion with no meaningful content', {
                        discussionId: payload.discussion!.id,
                        installationId: installation.id,
                    });
                    return;
                }

                // Create installation-specific API client for proper authentication
                const installationApiClient = await context.api.createInstallationClient(
                    context.environment.integration.name,
                    installation.id,
                );

                await installationApiClient.orgs.ingestConversation(
                    installation.target.organization,
                    [gitbookConversation],
                );
            } catch (error) {
                logger.error('Failed to process closed discussion', {
                    discussionId: payload.discussion?.id,
                    repository: repositoryFullName,
                    installationId: installation.id,
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        },
        {
            concurrency: 2,
            stopOnError: false,
        },
    );

    return new Response('OK', { status: 200 });
}

/**
 * Handle GitHub App installation deletion
 * Removes the GitHub installation ID from all GitBook installations that reference it
 */
export async function handleInstallationDeleted(
    context: GitHubRuntimeContext,
    // TODO:
    payload: any,
): Promise<Response> {
    const githubInstallationId = String(payload.installation.id);

    logger.info('GitHub App installation deleted', {
        installationId: githubInstallationId,
        account: payload.installation.account.login,
    });

    // Fetch all GitBook installations that have this GitHub installation ID
    const {
        data: { items: installations },
    } = await context.api.integrations.listIntegrationInstallations(
        context.environment.integration.name,
        {
            externalId: githubInstallationId,
        },
    );

    if (installations.length === 0) {
        logger.info('No installations found for GitHub installation deletion', {
            githubInstallationId,
        });
        return new Response('Installation webhook received', { status: 200 });
    }

    // Process each installation and remove the GitHub installation ID
    await pMap(
        installations,
        async (installation) => {
            try {
                const existingConfig = installation.configuration || {};
                const existingInstallationIds = existingConfig.installation_ids || [];

                // Remove the GitHub installation from the list
                const updatedInstallationIds = existingInstallationIds.filter(
                    (id: string) => id !== githubInstallationId,
                );

                await context.api.integrations.updateIntegrationInstallation(
                    context.environment.integration.name,
                    installation.id,
                    {
                        configuration: {
                            ...existingConfig,
                            installation_ids: updatedInstallationIds,
                        },
                        externalIds: updatedInstallationIds,
                    },
                );

                logger.info('GitHub App installation removed from GitBook installation', {
                    removedInstallationId: githubInstallationId,
                    gitbookInstallationId: installation.id,
                    remainingInstallationIds: updatedInstallationIds,
                });
            } catch (error) {
                logger.error('Error removing installation from GitBook installation', {
                    error: error instanceof Error ? error.message : String(error),
                    githubInstallationId,
                    gitbookInstallationId: installation.id,
                });
            }
        },
        { concurrency: 5 },
    );

    return new Response('Installation webhook received', { status: 200 });
}
