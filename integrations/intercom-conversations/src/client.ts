import { IntercomClient } from 'intercom-client';
import { IntercomRuntimeContext } from './types';
import { ExposableError, getOAuthToken, OAuthConfig } from '@gitbook/runtime';

/**
 * Get the OAuth configuration for the Intercom integration.
 */
export function getIntercomOAuthConfig(context: IntercomRuntimeContext) {
    const config: OAuthConfig = {
        redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
        clientId: context.environment.secrets.CLIENT_ID,
        clientSecret: context.environment.secrets.CLIENT_SECRET,
        scopes: ['conversations.read'],
        authorizeURL: () => 'https://app.intercom.com/oauth',
        accessTokenURL: () => 'https://api.intercom.io/auth/eagle/token',
    };

    return config;
}

/**
 * Initialize an Intercom API client for a given installation.
 */
export async function getIntercomClient(context: IntercomRuntimeContext) {
    const { installation } = context.environment;

    if (!installation) {
        throw new Error('Installation not found');
    }

    const { oauth_credentials } = installation.configuration;
    if (!oauth_credentials) {
        throw new Error('Intercom OAuth credentials not found');
    }

    const token = await getOAuthToken(oauth_credentials, getIntercomOAuthConfig(context), context);

    return new IntercomClient({
        token,
    });
}
