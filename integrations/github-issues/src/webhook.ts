import pMap from 'p-map';

import { ExposableError, Logger } from '@gitbook/runtime';
import { GitHubIssuesRuntimeContext, GitHubWebhookEventPayload } from './types';
import { getGitHubInstallationIds } from './utils';

const logger = Logger('github-issues:webhook');

/**
 * Process a GitHub App "installation" deleted event by removing it from the linked GitBook installations.
 */
export async function handleGitHubAppInstallationDeletedEvent(
    context: GitHubIssuesRuntimeContext,
    payload: Extract<GitHubWebhookEventPayload['installation'], { action: 'deleted' }>,
) {
    const githubInstallationId = String(payload.installation.id);

    logger.info(
        `handling GitHub App installation deleted event for installation ID ${githubInstallationId}...`,
    );

    const {
        data: { items: installations },
    } = await context.api.integrations.listIntegrationInstallations(
        context.environment.integration.name,
        {
            externalId: githubInstallationId,
        },
    );

    if (installations.length === 0) {
        logger.info(
            `No GitBook installations found for deleted GitHub installation: ${githubInstallationId}`,
        );
        return new Response('Installation webhook received', { status: 200 });
    }

    await pMap(
        installations,
        async (installation) => {
            try {
                const existingConfig = installation.configuration || {};
                const existingInstallationIds = existingConfig.installation_ids || [];

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

                logger.info(
                    `GitHub App installation ${githubInstallationId} removed from GitBook installation ${installation.id}`,
                );
            } catch (error) {
                logger.error(
                    `Error removing GitHub installation ${githubInstallationId} from GitBook installation ${installation.id}: `,
                    error instanceof Error ? error.message : String(error),
                );
            }
        },
        { concurrency: 5 },
    );

    return new Response('Installation webhook received', { status: 200 });
}

/**
 * Process a GitHub App "installation_repositories" event when an installation was granted access to one or more repositories
 * by triggering an inital ingestion for these repos.
 */
export async function handleGitHubAppRepositoryAddedToInstallation(
    context: GitHubIssuesRuntimeContext,
    payload: Extract<GitHubWebhookEventPayload['installation_repositories'], { action: 'added' }>,
) {
    const { installation: gitbookInstallation } = context.environment;
    if (!gitbookInstallation) {
        throw new ExposableError('GitBook installation not found');
    }

    const githubInstallationId = String(payload.installation.id);
    const githubInstallationIds = getGitHubInstallationIds(context);
    if (githubInstallationIds.length === 0) {
        throw new ExposableError('No GitHub App installation IDs found');
    }

    if (!githubInstallationId.includes(githubInstallationId)) {
        throw new ExposableError(
            `GitHub App installation ID ${githubInstallationId} not found in GitBook installation ${gitbookInstallation}`,
        );
    }

    logger.info(
        `handling GitHub App installation_repositories event with added repositories for installation ID ${githubInstallationId}...`,
    );

    const addedRepos = payload.repositories_added.map((addedRepo) => {
        const [owner, name] = addedRepo.full_name.split('/');

        return { owner, name };
    });

    let totalRepoToProcess = addedRepos.length;

    if (!totalRepoToProcess) {
        logger.info('No repository added. Skipping');
    }

    const pendingTaskPromises: Array<Promise<void>> = [];
    for (const repo of addedRepos) {
        pendingTaskPromises.push(
            context.integration.queueTask({
                task: {
                    type: 'ingest:github-repo:closed-issues',
                    payload: {
                        organization: gitbookInstallation.target.organization,
                        gitbookInstallationId: gitbookInstallation.id,
                        githubInstallationId: githubInstallationId,
                        repository: {
                            owner: repo.owner,
                            name: repo.name,
                        },
                    },
                },
            }),
        );
    }

    context.waitUntil(Promise.all(pendingTaskPromises));

    logger.info(
        `Dispatched ${pendingTaskPromises.length} tasks to ingest a total of ${totalRepoToProcess} github repositories`,
    );

    return new Response('Installation repositories added webhook received', { status: 200 });
}

/**
 * Verify a GitHub webhook signature.
 *
 * {@link https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries}
 */
export async function verifyGitHubWebhookSignature(
    context: GitHubIssuesRuntimeContext,
    request: Request,
    rawBody: string,
): Promise<boolean> {
    const signature = request.headers.get('x-hub-signature-256');
    const webhookSecret = context.environment.secrets.WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
        return false;
    }

    try {
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(webhookSecret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign'],
        );

        const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
        const hashArray = Array.from(new Uint8Array(signatureBuffer));
        const computedSignature =
            'sha256=' + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

        return computedSignature === signature;
    } catch (error) {
        logger.error(
            'Failed to verify webhook signature: ',
            error instanceof Error ? error.message : String(error),
        );
        return false;
    }
}
