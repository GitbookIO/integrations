import { ExposableError, getOAuthToken, Logger, OAuthConfig } from '@gitbook/runtime';
import { HubSpotRuntimeContext, HubSpotAccountInfo } from './types';

const logger = Logger('hubspot-conversations:client');

/**
 * Get the OAuth configuration for the HubSpot integration.
 */
export function getHubSpotOAuthConfig(context: HubSpotRuntimeContext) {
    const config: OAuthConfig = {
        redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
        clientId: context.environment.secrets.CLIENT_ID,
        clientSecret: context.environment.secrets.CLIENT_SECRET,
        scopes: ['oauth', 'conversations.read'],
        authorizeURL: () => 'https://app.hubspot.com/oauth/authorize',
        accessTokenURL: () => 'https://api.hubapi.com/oauth/v1/token',
        extractCredentials: async (response) => {
            if (!response.access_token) {
                throw new Error(
                    `Failed to exchange code for access token: ${JSON.stringify(response)}`,
                );
            }

            logger.debug('HubSpot OAuth response received');

            // Get account information using the access token
            try {
                const accountResponse = await fetch(
                    'https://api.hubapi.com/account-info/v3/details',
                    {
                        headers: {
                            Authorization: `Bearer ${response.access_token}`,
                            'Content-Type': 'application/json',
                        },
                    },
                );

                if (!accountResponse.ok) {
                    throw new Error(
                        `Failed to fetch account info: ${accountResponse.status} ${accountResponse.statusText}`,
                    );
                }

                const accountData = (await accountResponse.json()) as HubSpotAccountInfo;
                logger.info('Retrieved HubSpot account info', { portalId: accountData.portalId });

                const portalId = accountData.portalId?.toString();
                if (!portalId) {
                    throw new ExposableError('No portalId found in account info response');
                }

                return {
                    externalIds: [portalId],
                    configuration: {
                        oauth_credentials: {
                            access_token: response.access_token,
                            refresh_token: response.refresh_token || '',
                        },
                    },
                };
            } catch (error) {
                logger.error('Failed to fetch HubSpot account info', {
                    error: error instanceof Error ? error.message : String(error),
                });
                throw new ExposableError(`Failed to get HubSpot account ID: ${error}`);
            }
        },
    };

    return config;
}

/**
 * Get the access token for HubSpot API calls.
 */
export async function getHubSpotAccessToken(context: HubSpotRuntimeContext) {
    const { installation } = context.environment;

    if (!installation) {
        throw new Error('Installation not found');
    }

    const { oauth_credentials } = installation.configuration;
    if (!oauth_credentials) {
        throw new Error('HubSpot OAuth credentials not found');
    }

    return await getOAuthToken(oauth_credentials, getHubSpotOAuthConfig(context), context);
}

/**
 * Make a request to the HubSpot API.
 */
export async function hubspotApiRequest<T = unknown>(
    context: HubSpotRuntimeContext,
    path: string,
    options: {
        method?: string;
        body?: unknown;
        params?: Record<string, string>;
    } = {},
): Promise<T> {
    const token = await getHubSpotAccessToken(context);
    const { method = 'GET', body, params } = options;

    const url = new URL(`https://api.hubapi.com${path}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }

    const response = await fetch(url.toString(), {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`HubSpot API request failed: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
}
