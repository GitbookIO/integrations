import { Octokit } from 'octokit';
import { GitHubRuntimeContext } from './types';
import { OAuthConfig, getOAuthToken } from '@gitbook/runtime';

/** Get OAuth configuration for GitHub */
export function getGitHubOAuthConfig(context: GitHubRuntimeContext): OAuthConfig {
    return {
        redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
        clientId: context.environment.secrets.CLIENT_ID,
        clientSecret: context.environment.secrets.CLIENT_SECRET,
        authorizeURL: 'https://github.com/login/oauth/authorize',
        accessTokenURL: 'https://github.com/login/oauth/access_token',
        scopes: ['read:discussion'],
        prompt: 'consent',
    };
}

/** Initialize a GitHub API client */
export async function getGitHubClient(context: GitHubRuntimeContext) {
    const { installation } = context.environment;
    if (!installation) {
        throw new Error('Installation not found');
    }
    const { oauth_credentials } = installation.configuration;
    if (!oauth_credentials) {
        throw new Error('GitHub OAuth credentials not found');
    }

    const token = await getOAuthToken(oauth_credentials, getGitHubOAuthConfig(context), context);

    return new Octokit({ auth: token });
}
