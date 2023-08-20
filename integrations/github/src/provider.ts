import * as jose from 'jose';

import { GitSyncOperationState } from '@gitbook/api';
import { Logger } from '@gitbook/runtime';

import { createAppInstallationAccessToken, createCommitStatus } from './api';
import { GithubRuntimeContext, GitHubSpaceConfiguration } from './types';
import { parseInstallationOrThrow, parseRepositoryOrThrow } from './utils';

const logger = Logger('github:provider');

/**
 * Return the GitHub App JWT
 */
async function getGitHubAppJWT(context: GithubRuntimeContext): Promise<string> {
    const { environment } = context;

    const now = Math.floor(Date.now() / 1000);

    const appId = environment.secrets.APP_ID;
    const pkcs8 = environment.secrets.PRIVATE_KEY;

    const alg = 'RS256';

    const privateKey = await jose.importPKCS8(pkcs8, alg);

    const jwt = await new jose.SignJWT({
        iat: now - 60,
        exp: now + 60 * 10,
        iss: appId,
    })
        .setProtectedHeader({ alg })
        .sign(privateKey);

    return jwt;
}

/**
 * Returns the URL of the Git repository.
 */
export function getRepositoryUrl(config: GitHubSpaceConfiguration, withExtension = false): string {
    const installation = parseInstallationOrThrow(config);
    const repository = parseRepositoryOrThrow(config);

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
        parseInstallationOrThrow(config).installationId
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

    const installation = parseInstallationOrThrow(config);
    const repository = parseRepositoryOrThrow(config);

    await createCommitStatus(appJWT, installation.accountName, repository.repoName, commitSha, {
        state: update.state === 'running' ? 'pending' : update.state,
        target_url: update.url,
        description: update.description,
        context: update.context || 'GitBook',
    });

    logger.info(
        `Commit status updated for ${commitSha} on GitHub repo (${installation.accountName}/${repository.repoName})`
    );
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
