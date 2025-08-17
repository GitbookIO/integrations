import pMap from 'p-map';
import { Logger } from '@gitbook/runtime';
import { GitHubRuntimeContext, GitHubWebhookPayload } from './types';
import { parseWebhookDiscussionAsGitBook } from './conversations';

const logger = Logger('github-conversations');

/**
 * Verify GitHub webhook signature
 * https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries
 */
async function verifyGitHubSignature(
    signature: string,
    body: string,
    secret: string,
): Promise<boolean> {
    try {
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign'],
        );

        const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
        const hashArray = Array.from(new Uint8Array(signatureBuffer));
        const computedSignature =
            'sha256=' + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

        return computedSignature === signature;
    } catch (error) {
        logger.error('Failed to verify webhook signature', {
            error: error instanceof Error ? error.message : String(error),
        });
        return false;
    }
}

/**
 * Handle incoming GitHub webhooks for discussion events
 */
export async function handleWebhook(
    context: GitHubRuntimeContext,
    payload: GitHubWebhookPayload,
    request?: Request,
    rawBody?: string,
): Promise<Response> {
    // Verify webhook signature for security
    if (request && rawBody) {
        const signature = request.headers.get('x-hub-signature-256');
        const webhookSecret = context.environment.secrets.WEBHOOK_SECRET;

        if (!signature || !webhookSecret) {
            logger.error('Missing required signature or webhook secret');
            return new Response('Unauthorized', { status: 401 });
        }

        const isValidSignature = await verifyGitHubSignature(signature, rawBody, webhookSecret);
        if (!isValidSignature) {
            logger.error('Invalid webhook signature received');
            return new Response('Unauthorized', { status: 401 });
        }
    }

    logger.info('Processing GitHub webhook', {
        action: payload.action,
        event: request?.headers.get('x-github-event'),
        repository: payload.repository?.full_name,
        discussionNumber: payload.discussion?.number,
    });

    // Only process closed discussions
    if (payload.action === 'closed' && payload.discussion) {
        const repositoryFullName = payload.repository.full_name;
        const githubInstallationId = payload.installation?.id?.toString();

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

        logger.info('Found matching installations', {
            count: installations.length,
            githubInstallationId,
            repository: repositoryFullName,
        });

        if (installations.length === 0) {
            logger.info('No installations found for GitHub installation', {
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
                    // Convert GitHub discussion to GitBook conversation
                    const gitbookConversation = parseWebhookDiscussionAsGitBook(
                        payload.discussion!,
                        repositoryFullName,
                    );

                    if (!gitbookConversation) {
                        logger.info('Skipping discussion with no meaningful content', {
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

                    logger.info('Successfully processed closed discussion', {
                        discussionId: payload.discussion!.id,
                        discussionNumber: payload.discussion!.number,
                        repository: repositoryFullName,
                        installationId: installation.id,
                    });
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
    } else {
        logger.debug('Ignoring webhook', {
            action: payload.action,
            hasDiscussion: !!payload.discussion,
        });
    }

    return new Response('OK', { status: 200 });
}
