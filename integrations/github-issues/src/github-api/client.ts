import jwt from '@tsndr/cloudflare-worker-jwt';
import { Octokit } from 'octokit';

import { ExposableError } from '@gitbook/runtime';
import { GitHubIssuesRuntimeContext } from '../types';
import { GITBOOK_INTEGRATION_USER_AGENT, GITHUB_API_VERSION } from './utils';

/**
 * Get an authenticated Octokit instance for a GitHub app installation.
 */
export async function getOctokitClientForInstallation(
    context: GitHubIssuesRuntimeContext,
    githubInstallationId: string,
): Promise<Octokit> {
    const config = getGitHubAppConfig(context);
    if (!config.appId || !config.privateKey) {
        throw new ExposableError('GitHub App credentials not configured');
    }

    const token = await getGitHubInstallationAccessToken({
        githubInstallationId,
        appId: config.appId,
        privateKey: config.privateKey,
    });

    return new Octokit({
        auth: token,
        userAgent: GITBOOK_INTEGRATION_USER_AGENT,
    });
}
/**
 * Generate a JWT token for GitHub App authentication.
 */
async function generateGitHubAppJWT(appId: string, privateKey: string): Promise<string> {
    const now = Math.floor(Date.now() / 1000);

    const payload = {
        iat: now - 60, // Issued 60 seconds ago (for clock drift)
        exp: now + 60 * 10,
        iss: appId,
    };

    return await jwt.sign(payload, privateKey, { algorithm: 'RS256' });
}

/**
 * Get an access token for a GitHub App installation.
 */
async function getGitHubInstallationAccessToken(args: {
    githubInstallationId: string;
    appId: string;
    privateKey: string;
}): Promise<string> {
    const { githubInstallationId, appId, privateKey } = args;
    const jwtToken = await generateGitHubAppJWT(appId, privateKey);

    const octokit = new Octokit({
        auth: jwtToken,
        userAgent: GITBOOK_INTEGRATION_USER_AGENT,
    });

    try {
        const response = await octokit.request(
            'POST /app/installations/{installation_id}/access_tokens',
            {
                installation_id: parseInt(githubInstallationId),
                headers: {
                    'X-GitHub-Api-Version': GITHUB_API_VERSION,
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
export function getGitHubAppConfig(context: GitHubIssuesRuntimeContext) {
    // We store the private key in 1password with newlines escaped to avoid the newlines from being removed when stored as password field in the OP entry.
    // This means that it will also be stored with escaped newlines in the integration secret config so we need to restore the newlines
    // before we sign the JWT as we need the private key in a proper PKCS8 format.
    const privateKey = context.environment.secrets.GITHUB_PRIVATE_KEY.replace(/\\n/g, '\n');

    return {
        appId: context.environment.secrets.GITHUB_APP_ID,
        privateKey,
    };
}
