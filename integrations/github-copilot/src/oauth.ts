import { defaultOAuthExtractCredentials } from '@gitbook/runtime';

import { fetchGitHubInstallations } from './github';
import type { GitHubCopilotConfiguration, GitHubCopilotRuntimeContext } from './types';

/**
 * Get the OAut configuration for a context.
 */
export function getGitHubOAuthConfiguration(ctx: GitHubCopilotRuntimeContext) {
    return {
        redirectURL: `${ctx.environment.integration.urls.publicEndpoint}/oauth`,
        clientId: ctx.environment.secrets.CLIENT_ID,
        clientSecret: ctx.environment.secrets.CLIENT_SECRET,
        authorizeURL: 'https://github.com/login/oauth/authorize',
        accessTokenURL: 'https://github.com/login/oauth/access_token',
        scopes: [],
        prompt: 'consent',

        // By default select all accounts as enabled in the configuration
        // The user can still edits the list from the configuration UI
        extractCredentials: async (response) => {
            const res = defaultOAuthExtractCredentials(response);
            const token = (res.configuration as GitHubCopilotConfiguration).oauth_credentials
                ?.access_token;
            if (!token) {
                throw new Error('Expected a token');
            }

            const githubInstallations = await fetchGitHubInstallations(token);
            return {
                ...res,
                externalIds: githubInstallations
                    .map((githubInstallation) => githubInstallation.id.toString())
                    .slice(0, 5),
            };
        },
    };
}
