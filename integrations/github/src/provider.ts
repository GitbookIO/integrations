import * as jose from 'jose';

import { GitSyncOperationState } from '@gitbook/api';

import { createAppInstallationAccessToken, createCommitStatus } from './api';
import { GithubRuntimeContext, GitHubSpaceConfiguration } from './types';
import { parseInstallation, parseRepository } from './utils';

/**
 * Return the GitHub App JWT
 */
async function getGitHubAppJWT(context: GithubRuntimeContext) {
    const { environment } = context;

    const privateKeyBuffer = new Uint8Array(environment.secrets.PRIVATE_KEY.length);
    for (let i = 0; i < privateKeyBuffer.length; i++) {
        privateKeyBuffer[i] = environment.secrets.PRIVATE_KEY.charCodeAt(i);
    }

    const now = Math.floor(Date.now() / 1000);

    const jwt = await new jose.SignJWT({
        iat: now - 60,
        exp: now + 60 * 10,
        iss: environment.secrets.APP_ID,
    })
        .setProtectedHeader({ alg: 'RS256' })
        .sign(privateKeyBuffer);

    return jwt;
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
