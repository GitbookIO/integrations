import { IntercomClient } from 'intercom-client';
import { IntercomRuntimeContext, IntercomMeResponse } from './types';
import { ExposableError, getOAuthToken, Logger, OAuthConfig } from '@gitbook/runtime';

const logger = Logger('intercom-conversations:client');

/**
 * Get the OAuth configuration for the Intercom integration.
 */
export function getIntercomOAuthConfig(context: IntercomRuntimeContext) {
    const config: OAuthConfig = {
        redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
        clientId: context.environment.secrets.CLIENT_ID,
        clientSecret: context.environment.secrets.CLIENT_SECRET,
        scopes: ['conversations.read', 'read_admins'],
        authorizeURL: () => 'https://app.intercom.com/oauth',
        accessTokenURL: () => 'https://api.intercom.io/auth/eagle/token',
        extractCredentials: async (response) => {
            if (!response.access_token) {
                logger.error('OAuth response missing access_token', {
                    responseKeys: Object.keys(response),
                });
                throw new Error(
                    `Failed to exchange code for access token: ${JSON.stringify(response)}`,
                );
            }

            logger.debug('Intercom OAuth response received', {
                hasAccessToken: !!response.access_token,
                tokenLength: response.access_token?.length,
            });

            // Get workspace information using the access token
            // We use fetch here instead of IntercomClient because this is during OAuth setup
            try {
                const meResponse = await fetch('https://api.intercom.io/me', {
                    headers: {
                        Authorization: `Bearer ${response.access_token}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'Intercom-Version': '2.13',
                    },
                });

                if (!meResponse.ok) {
                    const errorText = await meResponse.text();
                    throw new Error(
                        `Failed to fetch workspace info: ${meResponse.status} ${meResponse.statusText} - ${errorText}`,
                    );
                }

                const meData = (await meResponse.json()) as IntercomMeResponse;

                const workspaceId = meData.app?.id_code;
                if (!workspaceId) {
                    logger.error('No workspace ID in /me response', { meData });
                    throw new ExposableError('No workspace ID found in response');
                }

                return {
                    externalIds: [workspaceId],
                    configuration: {
                        oauth_credentials: {
                            access_token: response.access_token,
                        },
                    },
                };
            } catch (error) {
                logger.error('Failed to fetch Intercom workspace info', {
                    error: error instanceof Error ? error.message : String(error),
                    tokenPrefix: response.access_token
                        ? response.access_token.substring(0, 10) + '...'
                        : 'undefined',
                });
                throw new ExposableError(`Failed to get Intercom workspace ID: ${error}`);
            }
        },
    };

    return config;
}

/**
 * Initialize an Intercom API client for a given installation.
 */
export async function getIntercomClient(context: IntercomRuntimeContext) {
    const { installation } = context.environment;

    if (!installation) {
        throw new ExposableError('Installation not found');
    }

    const { oauth_credentials } = installation.configuration;
    if (!oauth_credentials) {
        throw new ExposableError('Intercom OAuth credentials not found');
    }

    const token = await getOAuthToken(oauth_credentials, getIntercomOAuthConfig(context), context);

    return new IntercomClient({
        token,
    });
}
