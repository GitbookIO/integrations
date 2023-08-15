import { App as GitHubApp } from '@octokit/app';
import { Octokit } from '@octokit/rest';

import { ConfigureState, GithubRuntimeContext } from './types';
import { parseInstallation, parseRepository } from './utils';

async function createGitHubApp(context: GithubRuntimeContext) {
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

export function getRepositoryUrl(config: ConfigureState) {
    const installation = parseInstallation(config);
    const repository = parseRepository(config);

    return `https://github.com/${installation.accountName}/${repository.repoName}.git`;
}

export async function getRepositoryAuth(context: GithubRuntimeContext, config: ConfigureState) {
    const githubApp = await createGitHubApp(context);

    const { token } = (await githubApp.octokit.auth({
        type: 'installation',
        installationId: parseInstallation(config).installationId,
    })) as { token: string };

    return {
        url: getRepositoryUrl(config),
        username: 'x-access-token',
        password: token,
    };
}

export async function updateCommitStatus(
    context: GithubRuntimeContext,
    config: ConfigureState,
    commitSha: string,
    update: {
        context?: string;
        state: 'running' | 'success' | 'failure';
        url: string;
        description: string;
    }
) {
    const githubApp = await createGitHubApp(context);

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
