import jwt from '@tsndr/cloudflare-worker-jwt';

import { ExposableError, Logger } from '@gitbook/runtime';
import { GitHubIssuesRuntimeContext } from './types';

const logger = Logger('github-issues:app-setup');

/**
 * Handle GitHub app installattion setup requests.
 */
export async function handleGitHubAppSetup(args: {
    context: GitHubIssuesRuntimeContext;
    githubAppInstallationId: string;
    unverifiedAppSetupState: string;
}) {
    const { context, githubAppInstallationId, unverifiedAppSetupState } = args;

    const { gitbookInstallationId } = await verifyGitHubAppSetupState(
        context,
        unverifiedAppSetupState,
    );

    if (!gitbookInstallationId) {
        return new ExposableError('Missing GitBook installation ID in GitHub app setup state');
    }

    try {
        const { data: installation } =
            await context.api.integrations.getIntegrationInstallationById(
                context.environment.integration.name,
                gitbookInstallationId,
            );

        const existingConfig = installation?.configuration || {};
        const existingInstallationIds = existingConfig.installation_ids || [];

        const updatedInstallationIds = Array.from(
            new Set([...existingInstallationIds, githubAppInstallationId]),
        );

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

        return new Response(
            `<html>
                <body>
                <h1>GitHub App Connected!</h1>
                <p>Your GitHub App has been successfully connected to GitBook.</p>
                <p>We'll start ingesting your GitHub issues shortly.</p>
                <script>window.close();</script>
                </body>
            </html>`,
            {
                headers: {
                    'Content-Type': 'text/html',
                },
            },
        );
    } catch (error) {
        logger.error(
            `Failed to update GitBook installation ${gitbookInstallationId} with GitHub installation ${githubAppInstallationId}: `,
            error instanceof Error ? error.message : String(error),
        );

        return new Response(
            `<html>
                <body>
                <h1>Setup Failed</h1>
                <p>There was an error connecting your GitHub App to GitBook.</p>
                <p>Please try again, or contact support and providing them with this error:</p>
                <pre>Error: ${error instanceof Error ? error.message : String(error)}</pre>
                </body>
            </html>`,
            {
                status: 500,
                headers: { 'Content-Type': 'text/html' },
            },
        );
    }
}

interface GitHubAppSetupState {
    /**
     * The Gitbook integration installation ID the GitHub app setup is linked to.
     */
    gitbookInstallationId: string;
}

/**
 * Create a JWT signed with integration secret to store a GitHub app setup state.
 */
export async function createGitHubAppSetupState(
    context: GitHubIssuesRuntimeContext,
    state: GitHubAppSetupState,
) {
    const token = await jwt.sign<GitHubAppSetupState>(
        { gitbookInstallationId: state.gitbookInstallationId },
        context.environment.signingSecrets.integration,
    );
    return token;
}

/**
 * Verify the signature of a JWT token that was passed as state of a Github app post installation.
 */
export async function verifyGitHubAppSetupState(
    context: GitHubIssuesRuntimeContext,
    token: string,
) {
    const verifiedToken = await jwt.verify<GitHubAppSetupState>(
        token,
        context.environment.signingSecrets.integration,
    );
    if (!verifiedToken) {
        throw new ExposableError('Invalid GitHub app setup state token signature');
    }

    const { payload } = verifiedToken;
    if (!payload || typeof payload.gitbookInstallationId !== 'string') {
        throw new ExposableError('Malformed GitHub app setup state token');
    }
    return payload;
}
