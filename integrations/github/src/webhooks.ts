import type {
    EventPayloadMap,
    PullRequestOpenedEvent,
    PullRequestSynchronizeEvent,
} from '@octokit/webhooks-types';
import httpError from 'http-errors';

import { Logger } from '@gitbook/runtime';

import { querySpaceInstallations } from './installation';
import { triggerImport } from './sync';
import { GithubRuntimeContext, GitHubSpaceConfiguration } from './types';
import { computeConfigQueryKeyBase, computeConfigQueryKeyPreviewExternalBranches } from './utils';

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

        const queryKey = computeConfigQueryKeyBase(
            githubInstallationId,
            githubRepositoryId,
            githubRef
        );

        const spaceInstallations = await querySpaceInstallations(context, queryKey);

        logger.info(
            `handling push event on ref "${payload.ref}" of "${payload.repository.id}" (installation "${payload.installation.id}"): ${spaceInstallations.length} space configurations are affected`
        );

        await Promise.all(
            spaceInstallations.map((spaceInstallation) => {
                return triggerImport(
                    context,
                    spaceInstallation.configuration as GitHubSpaceConfiguration
                );
            })
        );
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

        const queryKey = isPRFromFork
            ? computeConfigQueryKeyPreviewExternalBranches(
                  githubInstallationId,
                  githubRepositoryId,
                  baseRef
              )
            : computeConfigQueryKeyBase(githubInstallationId, githubRepositoryId, baseRef);

        const spaceInstallations = await querySpaceInstallations(context, queryKey);

        logger.info(
            `handling ${eventType} event on ref "${headRef}" of "${payload.repository.id}" (installation "${payload.installation.id}"): ${spaceInstallations.length} space configurations are affected`
        );

        await Promise.all(
            spaceInstallations.map((spaceInstallation) => {
                return triggerImport(
                    context,
                    spaceInstallation.configuration as GitHubSpaceConfiguration,
                    {
                        standalone: { ref: headRef },
                    }
                );
            })
        );
    }
}

/**
 * Convert an array buffer to a hex string
 */
function arrayToHex(arr: ArrayBuffer) {
    return [...new Uint8Array(arr)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Constant-time string comparison. Equivalent of `crypto.timingSafeEqual`.
 **/
function safeCompare(expected: string, actual: string) {
    const lenExpected = expected.length;
    let result = 0;

    if (lenExpected !== actual.length) {
        actual = expected;
        result = 1;
    }

    for (let i = 0; i < lenExpected; i++) {
        result |= expected.charCodeAt(i) ^ actual.charCodeAt(i);
    }

    return result === 0;
}
