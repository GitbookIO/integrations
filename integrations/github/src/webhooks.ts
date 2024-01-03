import type {
    EventPayloadMap,
    PullRequestOpenedEvent,
    PullRequestSynchronizeEvent,
} from '@octokit/webhooks-types';
import httpError from 'http-errors';

import { GitBookAPI } from '@gitbook/api';
import { Logger } from '@gitbook/runtime';

import { querySpaceInstallations } from './installation';
import { triggerImport } from './sync';
import { queueTaskForImportSpaces } from './tasks';
import { GithubRuntimeContext, IntegrationTaskImportSpaces } from './types';
import { arrayToHex, computeConfigQueryKey, safeCompare } from './utils';

const logger = Logger('github:webhooks');

/**
 * Verify the signature of a GitHub webhook request. This is used to ensure that the request
 * is coming from GitHub and not a malicious third party.
 * Source: https://github.com/gr2m/cloudflare-worker-github-app-example/blob/main/lib/verify.js
 */
export async function verifyGitHubWebhookSignature(
    payload: string,
    signature: string,
    secret: string
) {
    if (!signature) {
        throw httpError(400, 'No signature found on request');
    } else if (!signature.startsWith('sha256=')) {
        throw httpError(400, 'Invalid format: signature is not using sha256');
    }

    const algorithm = { name: 'HMAC', hash: 'SHA-256' };
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(secret), algorithm, false, [
        'sign',
        'verify',
    ]);

    const signed = await crypto.subtle.sign(algorithm.name, key, enc.encode(payload));
    const expectedSignature = `sha256=${arrayToHex(signed)}`;
    if (!safeCompare(expectedSignature, signature)) {
        throw httpError(400, 'Signature does not match event payload and secret');
    }

    // All good!
}

/**
 * Push on the main branch of an installation triggers a sync.
 */
export async function handlePushEvent(
    context: GithubRuntimeContext,
    payload: EventPayloadMap['push']
) {
    if (payload.installation) {
        const githubInstallationId = payload.installation.id;
        const githubRepositoryId = payload.repository.id;
        const githubRef = payload.ref;

        logger.info(
            `handling push event on ref "${payload.ref}" of "${payload.repository.id}" (installation "${payload.installation.id}")`
        );

        const queryKey = computeConfigQueryKey(githubInstallationId, githubRepositoryId, githubRef);

        const total = await handleImportDispatchForSpaces(context, {
            configQuery: queryKey,
        });

        logger.debug(`${total} space configurations are affected`);
    }
}

/**
 * Push on pull-requests triggers an import to preview the changes.
 */
export async function handlePullRequestEvents(
    context: GithubRuntimeContext,
    payload: PullRequestOpenedEvent | PullRequestSynchronizeEvent
) {
    const eventType = `pull_request.${payload.action}`;
    const isPRFromFork = payload.pull_request.head.repo?.id !== payload.repository.id;

    const baseRef = `refs/heads/${payload.pull_request.base.ref}`;
    const headRef = `refs/pull/${payload.pull_request.number}/head`;

    if (payload.installation) {
        const githubInstallationId = payload.installation.id;
        const githubRepositoryId = payload.repository.id;

        logger.info(
            `handling ${eventType} event on ref "${headRef}" of "${payload.repository.id}" (installation "${payload.installation.id}")`
        );

        const queryKey = computeConfigQueryKey(
            githubInstallationId,
            githubRepositoryId,
            baseRef,
            isPRFromFork ? true : undefined
        );

        const total = await handleImportDispatchForSpaces(context, {
            configQuery: queryKey,
            standaloneRef: headRef,
        });

        logger.debug(`${total} space configurations are affected`);
    }
}

/**
 * This function is used to trigger an import for all the spaces that match the given config query.
 * It will handle pagination by queueing itself if there are more spaces to import.
 *
 * `NOTE`: It is important that the total number of external network calls in this function is less
 * than 50 as that is the limit imposed by Cloudflare workers.
 */
export async function handleImportDispatchForSpaces(
    context: GithubRuntimeContext,
    payload: IntegrationTaskImportSpaces['payload']
): Promise<number | undefined> {
    const { configQuery, page, standaloneRef } = payload;

    logger.debug(`handling import dispatch for spaces with payload: ${JSON.stringify(payload)}`);

    const {
        data: spaceInstallations,
        nextPage,
        total,
    } = await querySpaceInstallations(context, configQuery, {
        limit: 10,
        page,
    });

    await Promise.allSettled(
        spaceInstallations.map(async (spaceInstallation) => {
            try {
                // Obtain the installation API token needed to trigger the import
                const { data: installationAPIToken } =
                    await context.api.integrations.createIntegrationInstallationToken(
                        spaceInstallation.integration,
                        spaceInstallation.installation
                    );

                // Set the token in the duplicated context to be used by the API client
                const installationContext: GithubRuntimeContext = {
                    ...context,
                    api: new GitBookAPI({
                        endpoint: context.environment.apiEndpoint,
                        authToken: installationAPIToken.token,
                    }),
                    environment: {
                        ...context.environment,
                        authToken: installationAPIToken.token,
                    },
                };

                await triggerImport(installationContext, spaceInstallation, {
                    standalone: standaloneRef
                        ? {
                              ref: standaloneRef,
                          }
                        : undefined,
                });
            } catch (error) {
                logger.error(
                    `error while triggering ${
                        standaloneRef ? `standalone (${standaloneRef})` : ''
                    } import for space ${spaceInstallation.space}`,
                    error
                );
            }
        })
    );

    // Queue the next page if there is one
    if (nextPage) {
        logger.debug(`queueing next page ${nextPage} of import dispatch for spaces`);
        await queueTaskForImportSpaces(context, {
            type: 'import:spaces',
            payload: {
                page: nextPage,
                configQuery,
                standaloneRef,
            },
        });
    }

    return total;
}
