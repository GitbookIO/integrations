import type {
    IssueCommentEvent,
    IssuesEvent,
    PullRequestEvent,
    PullRequestReviewCommentEvent,
    ReleaseEvent,
    RepositoryEvent,
} from '@octokit/webhooks-types';
import httpError from 'http-errors';

import { IntegrationInstallation } from '@gitbook/api';
import { Logger } from '@gitbook/runtime';

import {
    createIssueCommentEntity,
    createIssueEntity,
    createPullRequestCommentEntity,
    createPullRequestEntity,
    createReleaseEntity,
    createRepositoryEntity,
    deleteIssueCommentEntity,
    deleteIssueEntity,
    deleteReleaseEntity,
    deleteRepositoryEntity,
} from './entities';
import { GithubRuntimeContext } from './types';
import { arrayToHex, authenticateAsIntegrationInstallation, safeCompare } from './utils';

const logger = Logger('github-entities:webhooks');

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

export async function handleRepositoryEvent(
    context: GithubRuntimeContext,
    payload: RepositoryEvent
) {
    if (payload.installation) {
        const integrationInstallations = await queryIntegrationInstallations(
            context,
            payload.installation.id.toString()
        );
        await Promise.all(
            integrationInstallations.map(async (installation) => {
                const installationContext = await authenticateAsIntegrationInstallation(
                    context,
                    installation.id
                );
                if (payload.action === 'deleted') {
                    await deleteRepositoryEntity(
                        installationContext,
                        installation.target.organization,
                        // @ts-ignore
                        payload.repository
                    );
                } else {
                    await createRepositoryEntity(
                        installationContext,
                        installation.target.organization,
                        // @ts-ignore
                        payload.repository
                    );
                }
            })
        );
    }
}

export async function handleReleaseEvent(context: GithubRuntimeContext, payload: ReleaseEvent) {
    if (payload.installation) {
        const integrationInstallations = await queryIntegrationInstallations(
            context,
            payload.installation.id.toString()
        );
        await Promise.all(
            integrationInstallations.map(async (installation) => {
                const installationContext = await authenticateAsIntegrationInstallation(
                    context,
                    installation.id
                );
                if (payload.action === 'deleted') {
                    await deleteReleaseEntity(
                        installationContext,
                        installation.target.organization,
                        payload.repository.id,
                        // @ts-ignore
                        payload.release
                    );
                } else {
                    await createReleaseEntity(
                        installationContext,
                        installation.target.organization,
                        payload.repository.id,
                        // @ts-ignore
                        payload.release
                    );
                }
            })
        );
    }
}

export async function handleIssueEvent(context: GithubRuntimeContext, payload: IssuesEvent) {
    if (payload.installation) {
        const integrationInstallations = await queryIntegrationInstallations(
            context,
            payload.installation.id.toString()
        );

        await Promise.all(
            integrationInstallations.map(async (installation) => {
                const installationContext = await authenticateAsIntegrationInstallation(
                    context,
                    installation.id
                );
                if (payload.action === 'deleted') {
                    await deleteIssueEntity(
                        installationContext,
                        installation.target.organization,
                        payload.repository.id,
                        // @ts-ignore
                        payload.issue
                    );
                } else {
                    await createIssueEntity(
                        installationContext,
                        installation.target.organization,
                        payload.repository.id,
                        // @ts-ignore
                        payload.issue
                    );
                }
            })
        );
    }
}

export async function handlePullRequestEvent(
    context: GithubRuntimeContext,
    payload: PullRequestEvent
) {
    if (payload.installation) {
        const integrationInstallations = await queryIntegrationInstallations(
            context,
            payload.installation.id.toString()
        );
        await Promise.all(
            integrationInstallations.map(async (installation) => {
                const installationContext = await authenticateAsIntegrationInstallation(
                    context,
                    installation.id
                );
                await createPullRequestEntity(
                    installationContext,
                    installation.target.organization,
                    payload.repository.id,
                    // @ts-ignore
                    payload.pull_request
                );
            })
        );
    }
}

export async function handleIssueCommentEvent(
    context: GithubRuntimeContext,
    payload: IssueCommentEvent
) {
    if (payload.installation) {
        const integrationInstallations = await queryIntegrationInstallations(
            context,
            payload.installation.id.toString()
        );
        await Promise.all(
            integrationInstallations.map(async (installation) => {
                const installationContext = await authenticateAsIntegrationInstallation(
                    context,
                    installation.id
                );
                if (payload.action === 'deleted') {
                    deleteIssueCommentEntity(
                        installationContext,
                        installation.target.organization,
                        payload.repository.id,
                        payload.issue.number,
                        payload.comment
                    );
                } else {
                    await createIssueCommentEntity(
                        installationContext,
                        installation.target.organization,
                        payload.repository.id,
                        payload.issue.number,
                        payload.comment
                    );
                }
            })
        );
    }
}

export async function handlePullRequestReviewCommentEvent(
    context: GithubRuntimeContext,
    payload: PullRequestReviewCommentEvent
) {
    if (payload.installation) {
        const integrationInstallations = await queryIntegrationInstallations(
            context,
            payload.installation.id.toString()
        );
        await Promise.all(
            integrationInstallations.map(async (installation) => {
                const installationContext = await authenticateAsIntegrationInstallation(
                    context,
                    installation.id
                );
                if (payload.action === 'deleted') {
                    deleteIssueCommentEntity(
                        installationContext,
                        installation.target.organization,
                        payload.repository.id,
                        payload.pull_request.number,
                        payload.comment
                    );
                } else {
                    await createPullRequestCommentEntity(
                        installationContext,
                        installation.target.organization,
                        payload.repository.id,
                        payload.pull_request.number,
                        payload.comment
                    );
                }
            })
        );
    }
}

/**
 * List installations that match the given external ID. It takes
 * care of pagination and returns all installations at once.
 */
export async function queryIntegrationInstallations(
    context: GithubRuntimeContext,
    externalId: string,
    page?: string
): Promise<Array<IntegrationInstallation>> {
    const { api, environment } = context;

    logger.debug(`Querying installations for external ID ${externalId} (page: ${page ?? 1})`);

    const { data } = await api.integrations.listIntegrationInstallations(
        environment.integration.name,
        {
            limit: 100,
            externalId,
            page,
        }
    );

    const installations = [...data.items];

    // Recursively fetch next pages
    if (data.next) {
        const nextInstallations = await queryIntegrationInstallations(
            context,
            externalId,
            data.next.page
        );
        installations.push(...nextInstallations);
    }

    logger.info(`Found ${installations.length} installations for external ID ${externalId}`);

    return installations;
}
