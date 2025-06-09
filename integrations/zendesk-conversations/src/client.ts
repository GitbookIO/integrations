import { ZendeskClient } from './zendesk';
import { ZendeskRuntimeContext } from './types';
import { ExposableError, getOAuthToken, OAuthConfig } from '@gitbook/runtime';
import { IntegrationInstallation } from '@gitbook/api';

/**
 * Get the OAuth configuration for the Zendesk integration.
 */
export function getZendeskOAuthConfig(context: ZendeskRuntimeContext) {
    const config: OAuthConfig = {
        redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
        clientId: context.environment.secrets.CLIENT_ID,
        clientSecret: context.environment.secrets.CLIENT_SECRET,
        scopes: ['read', 'webhooks:write'],
        authorizeURL: (installation) => {
            const subdomain = assertInstallationSubdomain(installation);
            return `https://${subdomain}.zendesk.com/oauth/authorizations/new`;
        },
        accessTokenURL: (installation) => {
            const subdomain = assertInstallationSubdomain(installation);
            return `https://${subdomain}.zendesk.com/oauth/tokens`;
        },
    };

    return config;
}

/**
 * Initialize a Zendesk API client for a given installation.
 */
export async function getZendeskClient(context: ZendeskRuntimeContext) {
    const { installation } = context.environment;

    if (!installation) {
        throw new Error('Installation not found');
    }

    const { subdomain, oauth_credentials } = installation.configuration;
    if (!subdomain || !oauth_credentials) {
        throw new Error('Zendesk subdomain or oauth credentials not found');
    }

    const token = await getOAuthToken(oauth_credentials, getZendeskOAuthConfig(context), context);

    return new ZendeskClient({
        oauthToken: token,
        subdomain,
    });
}

function assertInstallationSubdomain(installation: IntegrationInstallation) {
    const subdomain = installation?.configuration?.subdomain;
    if (!subdomain) {
        throw new ExposableError('Subdomain is not configured');
    }

    return subdomain;
}
