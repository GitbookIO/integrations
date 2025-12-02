import { IntercomClient } from 'intercom-client';
import type { IntercomRuntimeContext } from './types';
import {
    ExposableError,
    getOAuthToken,
    Logger,
    OAuthConfig,
    OAuthResponse,
} from '@gitbook/runtime';

const logger = Logger('intercom-conversations:client');

type IntercomOAuthResponse = OAuthResponse & {
    token_type: 'Bearer';

    /**
     * Intercom returns a scope property which contains the workspace ID as "workspace_id:<id>"
     */
    scope: string;
};

/**
 * Get the OAuth configuration for the Intercom integration.
 */
export function getIntercomOAuthConfig(context: IntercomRuntimeContext) {
    const config: OAuthConfig<IntercomOAuthResponse> = {
        redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
        clientId: context.environment.secrets.CLIENT_ID,
        clientSecret: context.environment.secrets.CLIENT_SECRET,
        scopes: ['conversations.read'],
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

            logger.debug(`Intercom OAuth response received with scope "${response.scope}"`);

            const workspaceId = parseWorkspaceIdFromScope(response.scope);
            if (!workspaceId) {
                logger.error('Unable to parse workspace ID from OAuth response', response);
                throw new Error('Failed to determine Intercom workspace ID from OAuth');
            }

            logger.info(`Intercom workspace ID "${workspaceId}" extracted from OAuth scope`);

            return {
                externalIds: [workspaceId],
                configuration: {
                    oauth_credentials: {
                        access_token: response.access_token,
                    },
                },
            };
        },
    };

    return config;
}

/**
 * Initialize an Intercom API client for a given installation.
 */
export async function getIntercomClient(
    context: IntercomRuntimeContext,
    installation = context.environment.installation,
) {
    if (!installation) {
        throw new Error('Installation not found');
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

/**
 * Extract the workspace ID from the OAuth scope.
 */
function parseWorkspaceIdFromScope(scope: string): string | null {
    const workspaceIdMatch = scope.match(/workspace_id:([^\s,]+)/);
    return workspaceIdMatch ? workspaceIdMatch[1] : null;
}
