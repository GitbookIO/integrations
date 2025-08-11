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
 * Sleep for a given number of milliseconds
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Make a request to the HubSpot API with retry logic and rate limiting.
 */
export async function hubspotApiRequest<T = unknown>(
    context: HubSpotRuntimeContext,
    path: string,
    options: {
        method?: string;
        body?: unknown;
        params?: Record<string, string>;
        maxRetries?: number;
    } = {},
): Promise<T> {
    const token = await getHubSpotAccessToken(context);
    const { method = 'GET', body, params, maxRetries = 3 } = options;

    const url = new URL(`https://api.hubapi.com${path}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }

    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url.toString(), {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: body ? JSON.stringify(body) : undefined,
            });

            // Handle rate limiting (429) and server errors (5xx) with exponential backoff
            if (response.status === 429 || response.status >= 500) {
                if (attempt === maxRetries) {
                    throw new Error(`HubSpot API request failed after ${maxRetries + 1} attempts: ${response.status} ${response.statusText}`);
                }
                
                // Exponential backoff: 1s, 2s, 4s, 8s...
                const backoffMs = Math.pow(2, attempt) * 1000;
                logger.info('Rate limited or server error, retrying', {
                    attempt: attempt + 1,
                    maxRetries: maxRetries + 1,
                    backoffMs,
                    status: response.status,
                    path,
                });
                
                await sleep(backoffMs);
                continue;
            }

            if (!response.ok) {
                throw new Error(`HubSpot API request failed: ${response.status} ${response.statusText}`);
            }

            return (await response.json()) as T;
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            
            // Don't retry on non-network errors
            if (attempt === maxRetries || !error || typeof error !== 'object' || !('cause' in error)) {
                break;
            }
            
            // Exponential backoff for network errors
            const backoffMs = Math.pow(2, attempt) * 1000;
            logger.info('Network error, retrying', {
                attempt: attempt + 1,
                maxRetries: maxRetries + 1,
                backoffMs,
                error: lastError.message,
                path,
            });
            
            await sleep(backoffMs);
        }
    }

    throw lastError || new Error('Unknown error occurred');
}
