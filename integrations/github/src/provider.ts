import { App as GitHubApp } from '@octokit/app';
import { Octokit } from '@octokit/rest';

import { Logger } from '@gitbook/runtime';

import { GithubRuntimeContext, GitHubSpaceConfiguration } from './types';
import { parseInstallation, parseRepository } from './utils';

const logger = Logger('github:provider');

export async function getGitHubApp(context: GithubRuntimeContext) {
    const { environment } = context;
    const githubApp = new GitHubApp({
        appId: environment.secrets.APP_ID,
        privateKey: environment.secrets.PRIVATE_KEY,
        webhooks: {
            secret: environment.secrets.WEBHOOK_SECRET,
        },
        oauth: {
            clientId: environment.secrets.CLIENT_ID,
            clientSecret: environment.secrets.CLIENT_SECRET,
        },
        Octokit,
    });

    return githubApp;
}

export async function triggerImport(
    context: GithubRuntimeContext,
    config: GitHubSpaceConfiguration,
    options: {
        /**
         * To import from the provider a standalone content.
         * Main space content will not be updated.
         */
        standalone?: {
            ref: string;
        };

        /** Force the synchronization even if content has already been imported */
        force?: boolean;

        /** Whether the git info should be updated on the space */
        updateGitInfo?: boolean;
    } = {}
) {
    const { environment } = context;
    const { force = false, updateGitInfo = false, standalone } = options;

    logger.info('Initiating an import to GitBook');

    if (!environment.spaceInstallation) {
        throw new Error('Expected an installation on the space');
    }

    const repoURL = getRepositoryUrl(config, true);
    const auth = await getRepositoryAuth(context, config);

    const urlWithAuth = new URL(repoURL);
    urlWithAuth.username = auth.username;
    urlWithAuth.password = auth.password;

    await context.api.spaces.importGitRepository(environment.spaceInstallation?.space, {
        url: urlWithAuth.toString(),
        ref: standalone?.ref ?? getGitRef(config.branch ?? ''),
        repoTreeURL: getGitTreeURL(config),
        repoCommitURL: getGitCommitURL(config),
        repoProjectDirectory: config.projectDirectory,
        repoCacheID: config.key,
        force,
        standalone: !!standalone,
        ...(updateGitInfo ? { gitInfo: { provider: 'github', url: repoURL } } : {}),
    });
}

export async function triggerExport(
    context: GithubRuntimeContext,
    config: GitHubSpaceConfiguration,
    options: {
        /** Force the synchronization even if content has already been exported */
        force?: boolean;

        /** Whether the git info should be updated on the space */
        updateGitInfo?: boolean;
    } = {}
) {
    const { environment } = context;
    const { force = false, updateGitInfo = false } = options;

    logger.info('Initiating an export to GitHub');

    if (!environment.spaceInstallation) {
        throw new Error('Expected an installation on the space');
    }

    const repoURL = getRepositoryUrl(config, true);
    const auth = await getRepositoryAuth(context, config);

    const urlWithAuth = new URL(repoURL);
    urlWithAuth.username = auth.username;
    urlWithAuth.password = auth.password;

    await context.api.spaces.exportToGitRepository(environment.spaceInstallation?.space, {
        url: urlWithAuth.toString(),
        ref: getGitRef(config.branch ?? ''),
        repoTreeURL: getGitTreeURL(config),
        repoCommitURL: getGitCommitURL(config),
        repoProjectDirectory: config.projectDirectory,
        repoCacheID: config.key,
        force,
        commitMessage: 'export',
        ...(updateGitInfo ? { gitInfo: { provider: 'github', url: repoURL } } : {}),
    });
}

export async function updateCommitStatus(
    context: GithubRuntimeContext,
    config: GitHubSpaceConfiguration,
    commitSha: string,
    update: {
        context?: string;
        state: 'running' | 'success' | 'failure';
        url: string;
        description: string;
    }
) {
    const githubApp = await getGitHubApp(context);

    const installation = parseInstallation(config);
    const repository = parseRepository(config);

    const octokit = await githubApp.getInstallationOctokit(installation.installationId);

    await octokit.repos.createCommitStatus({
        owner: installation.accountName,
        repo: repository.repoName,
        sha: commitSha,
        state: update.state === 'running' ? 'pending' : update.state,
        target_url: update.url,
        description: update.description,
        context: update.context || 'GitBook',
    });
}

/**
 * Compute the query key for the configuration. This will be useful to list or find
 * all configuration(s) that match this combination of installation, repository and ref.
 */
export function computeConfigQueryKeyBase(
    installationId: number,
    repoID: number,
    ref: string
): string {
    return `${installationId}/${repoID}/${ref}`;
}

/**
 * Same as computeConfigQueryKeyBase, but with the previewExternalBranches flag.
 */
export function computeConfigQueryKeyPreviewExternalBranches(
    installationId: number,
    repoID: number,
    ref: string
): string {
    return `${computeConfigQueryKeyBase(installationId, repoID, ref)}/previewExternalBranches:true`;
}

/**
 * Returns the Git ref to use for the synchronization.
 */
export function getGitRef(branch: string): string {
    return `refs/heads/${branch}`;
}

/**
 * Returns the URL of the Git repository.
 */
function getRepositoryUrl(config: GitHubSpaceConfiguration, withExtension = false): string {
    const installation = parseInstallation(config);
    const repository = parseRepository(config);

    return `https://github.com/${installation.accountName}/${repository.repoName}${
        withExtension ? '.git' : ''
    }`;
}

/**
 * Returns the authentication information for the Git repository.
 */
async function getRepositoryAuth(context: GithubRuntimeContext, config: GitHubSpaceConfiguration) {
    const githubApp = await getGitHubApp(context);

    const { token } = (await githubApp.octokit.auth({
        type: 'installation',
        installationId: parseInstallation(config).installationId,
    })) as { token: string };

    return {
        url: getRepositoryUrl(config, true),
        username: 'x-access-token',
        password: token,
    };
}

/**
 * Returns the base URL of the Git tree in the provider.
 */
function getGitTreeURL(config: GitHubSpaceConfiguration): string {
    const base = getRepositoryUrl(config);
    return `${base}/blob/${config.branch}`;
}

/**
 * Returns the absolute URL for a commit.
 */
function getGitCommitURL(config: GitHubSpaceConfiguration): string {
    const base = getRepositoryUrl(config);
    return `${base}/commit`;
}
