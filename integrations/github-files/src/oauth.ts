import type { OAuthConfig, OAuthResponse } from '@gitbook/runtime';
import type { GithubRuntimeContext } from './types';

type GithubOAuthResponse = Partial<OAuthResponse> & { error?: string };

export function getGithubOAuthConfiguration(
    context: GithubRuntimeContext,
): OAuthConfig<GithubOAuthResponse> {
    return {
        redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
        clientId: context.environment.secrets.CLIENT_ID,
        clientSecret: context.environment.secrets.CLIENT_SECRET,
        authorizeURL: 'https://github.com/login/oauth/authorize',
        accessTokenURL: 'https://github.com/login/oauth/access_token',
        scopes: ['repo'],
        prompt: 'consent',
        pkce: true,
        extractCredentials: (response) => {
            // GitHub can return an OAuth error in an HTTP 200 response. Reject it before
            // createOAuthHandler replaces the installation's existing credentials.
            if (
                response?.error !== undefined ||
                typeof response?.access_token !== 'string' ||
                !response.access_token.trim()
            ) {
                throw new Error(
                    'GitHub authorization did not return an access token. Start authorization again.',
                );
            }

            return {
                configuration: {
                    oauth_credentials: {
                        access_token: response.access_token,
                        // Non-expiring OAuth tokens do not include expires_in.
                        ...(typeof response.expires_in === 'number' &&
                        Number.isFinite(response.expires_in) &&
                        response.expires_in > 0
                            ? { expires_at: Date.now() + response.expires_in * 1000 }
                            : {}),
                        ...(typeof response.refresh_token === 'string' && response.refresh_token
                            ? { refresh_token: response.refresh_token }
                            : {}),
                    },
                },
            };
        },
    };
}
