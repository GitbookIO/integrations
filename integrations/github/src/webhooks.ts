import type {
    EventPayloadMap,
    PullRequestOpenedEvent,
    PullRequestSynchronizeEvent,
} from '@octokit/webhooks-types';
import httpError from 'http-errors';

import { Logger } from '@gitbook/runtime';

import { handleImportDispatchForSpaces } from './tasks';
import { GithubRuntimeContext } from './types';
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
