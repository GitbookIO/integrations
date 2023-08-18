import jwt from '@tsndr/cloudflare-worker-jwt';

import { GitSyncOperationState } from '@gitbook/api';

import { createAppInstallationAccessToken, createCommitStatus } from './api';
import { GithubRuntimeContext, GitHubSpaceConfiguration } from './types';
import { parseInstallation, parseRepository } from './utils';

/**
 * Return the GitHub App JWT
 */
async function getGitHubAppJWT(context: GithubRuntimeContext): Promise<string> {
    const { environment } = context;

    const now = Math.floor(Date.now() / 1000);

    const token = await jwt.sign(
        {
            iat: now - 60,
            exp: now + 60 * 10,
            iss: environment.secrets.APP_ID,
        },
        environment.secrets.PRIVATE_KEY,
        { algorithm: 'RS256' }
    );

    return token;
}

/**
 * Returns the URL of the Git repository.
 */
export function getRepositoryUrl(config: GitHubSpaceConfiguration, withExtension = false): string {
    const installation = parseInstallation(config);
    const repository = parseRepository(config);

    return `https://github.com/${installation.accountName}/${repository.repoName}${
        withExtension ? '.git' : ''
    }`;
}

/**
 * Returns the authentication information for the Git repository.
 */
export async function getRepositoryAuth(
    context: GithubRuntimeContext,
    config: GitHubSpaceConfiguration
) {
    const appJWT = await getGitHubAppJWT(context);

    const installationAccessToken = await createAppInstallationAccessToken(
        appJWT,
        parseInstallation(config).installationId
    );

    return {
        url: getRepositoryUrl(config, true),
        username: 'x-access-token',
        password: installationAccessToken,
    };
}

/**
 * Update the commit status
 */
export async function updateCommitStatus(
    context: GithubRuntimeContext,
    config: GitHubSpaceConfiguration,
    commitSha: string,
    update: {
        context?: string;
        state: GitSyncOperationState;
        url: string;
        description: string;
    }
) {
    const appJWT = await getGitHubAppJWT(context);

    const installation = parseInstallation(config);
    const repository = parseRepository(config);

    await createCommitStatus(appJWT, installation.accountName, repository.repoName, commitSha, {
        state: update.state === 'running' ? 'pending' : update.state,
        target_url: update.url,
        description: update.description,
        context: update.context || 'GitBook',
    });
}

/**
 * Returns the base URL of the Git tree in the provider.
 */
export function getGitTreeURL(config: GitHubSpaceConfiguration): string {
    const base = getRepositoryUrl(config);
    return `${base}/blob/${config.branch}`;
}

/**
 * Returns the absolute URL for a commit.
 */
export function getGitCommitURL(config: GitHubSpaceConfiguration): string {
    const base = getRepositoryUrl(config);
    return `${base}/commit`;
}

/**
 * Returns the Git ref to use for the synchronization.
 */
export function getGitRef(branch: string): string {
    return `refs/heads/${branch}`;
}
