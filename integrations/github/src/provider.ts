import * as jose from 'jose';

import { GitSyncOperationState } from '@gitbook/api';
import { Logger } from '@gitbook/runtime';

import { createAppInstallationAccessToken, createCommitStatus } from './api';
import { GithubRuntimeContext, GitHubSpaceConfiguration } from './types';
import { assertIsDefined } from './utils';

const logger = Logger('github:provider');

/**
 * Return the GitHub App JWT signed with the private key.
 */
export async function getGitHubAppJWT(context: GithubRuntimeContext): Promise<string> {
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
    assertIsDefined(config.accountName, { label: 'config.accountName', statusCode: 400 });
    assertIsDefined(config.repoName, { label: 'config.repoName', statusCode: 400 });

    return `https://github.com/${config.accountName}/${config.repoName}${
        withExtension ? '.git' : ''
    }`;
}

/**
 * Returns the authentication information for the Git repository.
 */
export async function getRepositoryAuth(
    context: GithubRuntimeContext,
    config: GitHubSpaceConfiguration,
) {
    assertIsDefined(config.installation, { label: 'config.installation', statusCode: 400 });

    const appJWT = await getGitHubAppJWT(context);
    const installationAccessToken = await createAppInstallationAccessToken(
        context,
        appJWT,
        config.installation,
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
    },
) {
    assertIsDefined(config.accountName, { label: 'config.accountName', statusCode: 400 });
    assertIsDefined(config.repoName, { label: 'config.repoName', statusCode: 400 });
    assertIsDefined(config.installation, { label: 'config.installation', statusCode: 400 });

    const appJWT = await getGitHubAppJWT(context);
    const installationAccessToken = await createAppInstallationAccessToken(
        context,
        appJWT,
        config.installation,
    );

    await createCommitStatus(
        context,
        installationAccessToken,
        config.accountName,
        config.repoName,
        commitSha,
        {
            state: update.state === 'running' ? 'pending' : update.state,
            target_url: update.url,
            description: update.description,
            context: update.context || 'GitBook',
        },
    );

    logger.info(
        `Commit status updated for ${commitSha} on GitHub repo (${config.accountName}/${config.repoName})`,
    );
}

/**
 * Returns the base URL of the Git tree in the provider.
 */
export function getGitTreeURL(config: GitHubSpaceConfiguration): string {
    const ref = getPrettyGitRef(config.branch!);
    const base = getRepositoryUrl(config);
    return `${base}/blob/${ref}`;
}

/**
 * Returns the absolute URL for a commit.
 */
export function getGitCommitURL(config: GitHubSpaceConfiguration): string {
    const base = getRepositoryUrl(config);
    return `${base}/commit`;
}

/**
 * Make a remote ref pretty (e.g. refs/heads/master => master)
 */
export function getPrettyGitRef(ref: string): string {
    return ref ? ref.replace('refs/', '').replace('heads/', '') : '';
}
