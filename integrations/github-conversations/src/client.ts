import { ExposableError, Logger } from '@gitbook/runtime';
import jwt from '@tsndr/cloudflare-worker-jwt';
import { Octokit } from 'octokit';
import { GitHubRuntimeContext } from './types';

const logger = Logger('github-conversations:client');

/**
 * Get an authenticated Octokit instance for the installation
 */
export async function getOctokitClient(
    context: GitHubRuntimeContext,
    installationId?: string,
): Promise<Octokit> {
    const { installation } = context.environment;
    if (!installation) {
        throw new ExposableError('Installation not found');
    }

    // Use provided installationId or fall back to first available
    let targetInstallationId = installationId;
    if (!targetInstallationId) {
        const installationIds = installation.configuration.installation_ids || [];
        if (installationIds.length === 0) {
            throw new ExposableError('No GitHub App installation IDs found');
        }
        targetInstallationId = installationIds[0];
    }

    const config = getGitHubAppConfig(context);
    if (!config.appId || !config.privateKey) {
        throw new ExposableError('GitHub App credentials not configured');
    }

    const token = await getInstallationAccessToken(
        targetInstallationId,
        config.appId,
        config.privateKey,
    );

    return new Octokit({
        auth: token,
        userAgent: 'GitBook-GitHub-Conversations',
    });
}
/**
 * Generate a JWT token for GitHub App authentication.
 */
async function generateJWT(appId: string, privateKey: string): Promise<string> {
    const now = Math.floor(Date.now() / 1000);

    const payload = {
        iat: now - 60, // Issued 60 seconds ago (for clock drift)
        exp: now + 600, // Expires in 10 minutes
        iss: appId,
    };

    // Sign with RS256 algorithm using the private key
    return await jwt.sign(payload, privateKey, { algorithm: 'RS256' });
}

/**
 * Get an installation access token for GitHub App.
 */
export async function getInstallationAccessToken(
    installationId: string,
    appId: string,
    privateKey: string,
): Promise<string> {
    const jwtToken = await generateJWT(appId, privateKey);

    const octokit = new Octokit({
        auth: jwtToken,
        userAgent: 'GitBook-GitHub-Conversations',
    });

    try {
        const response = await octokit.request(
            'POST /app/installations/{installation_id}/access_tokens',
            {
                installation_id: parseInt(installationId),
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28',
                },
            },
        );

        return response.data.token;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to get installation access token: ${errorMessage}`);
    }
}

/**
 * Get GitHub App configuration for installation-based authentication.
 */
export function getGitHubAppConfig(context: GitHubRuntimeContext) {
    return {
        appId: context.environment.secrets.GITHUB_APP_ID,
        privateKey: context.environment.secrets.GITHUB_PRIVATE_KEY,
        installationIds: context.environment.installation?.configuration?.installation_ids,
    };
}
