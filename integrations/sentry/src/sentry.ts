import * as cookie from 'cookie';

import { Logger } from '@gitbook/runtime';
import {
    OAuthResponse,
    SentryCredentials,
    SentryOAuthCredentials,
    RuntimeHandlerCallback,
} from './types';

/**
 * EXPLAIN
 */
const INSTALLATION_STATE_COOKIE = '__session';

const logger = Logger('worker:integration:sentry');

/**
 * Create a fetch request handler to handle an OAuth authentication flow.
 * The credentials are stored in the installation configuration as `installationCredentialsKey`.
 *
 * When using this handler, you must configure `https://integrations.gitbook.com/integrations/{name}/` as a redirect URI.
 */
export function createOAuthHandler(): RuntimeHandlerCallback {
    return async (request, { environment }) => {
        if (!environment.installation?.id) {
            logger.error('Could not find the installation id');
            throw new Error('Stale request');
        }

        const cookies = cookie.parse(request.headers.get('Cookie') || '');
        const state = cookies[INSTALLATION_STATE_COOKIE];

        if (state) {
            logger.debug(
                `State cookie is present, but should not be. Matches current installation? ${
                    state === environment.installation.id ? 'YES' : 'NO'
                }`
            );
        }

        logger.info('Redirecting to Sentry external installation');

        return new Response(null, {
            status: 302,
            headers: {
                Location: `https://sentry.io/sentry-apps/${environment.secrets.SENTRY_APP}/external-install/`,
                'Set-Cookie': cookie.serialize(
                    INSTALLATION_STATE_COOKIE,
                    environment.installation.id,
                    // TODO
                    { path: '/v1/integrations/sentry', maxAge: 60 * 5 } // 5 mins
                ),
            },
        });
    };
}

export function createWebhoookHandler(config: SentrySecretsConfig): RuntimeHandlerCallback {
    return async (request, { api, environment }) => {
        // TODO
        // 1. refreshToken
        // 2. webhook and redirect?
        // 3. uninstallation
        // 4. Discuss limitation of one sentry org per installation

        const url = new URL(request.url);

        // sentry redirect params
        const code = url.searchParams.get('code');
        const sentryInstallationId = url.searchParams.get('installationId');
        const sentryOrgSlug = url.searchParams.get('orgSlug');
        if (!code || !sentryInstallationId || !sentryOrgSlug) {
            logger.error(
                `Missing params in sentry redirect, code: ${code}, installationId: ${sentryInstallationId}, orgSlug: ${sentryOrgSlug}`
            );
        }

        // gitbook integration installation
        const cookies = cookie.parse(request.headers.get('Cookie') || '');
        console.log('cookies', JSON.stringify(cookies));
        const state = cookies[INSTALLATION_STATE_COOKIE];
        if (!state) {
            throw Error('Missing installation state');
        }

        const data = {
            client_id: config.clientId,
            client_secret: config.clientSecret,
            code,
            grant_type: 'authorization_code',
        };

        const accessTokenURL = `https://sentry.io/api/0/sentry-app-installations/${sentryInstallationId}/authorizations/`;
        logger.info('accessTokenURL', accessTokenURL);

        const response = await fetch(accessTokenURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to exchange code for access token');
        }

        const json = await response.json<OAuthResponse>();
        const credentials = extractCredentials(json);

        // Store credentials and extras in gitbook's installation configuration
        try {
            await api.integrations.updateIntegrationInstallation(
                environment.integration.name,
                state,
                {
                    configuration: {
                        ...credentials,
                        sentryInstallationId,
                        sentryOrgSlug,
                    },
                }
            );
        } catch (err) {
            logger.error(err.stack);
            throw err;
        }

        return new Response(
            `
        <p>You can close this window now.</p>
        <script>
            window.close();
        </script>
        `,
            {
                headers: {
                    'Content-Type': 'text/html',
                },
            }
        );
    };
}

function extractCredentials(response: SentryCredentials): SentryOAuthCredentials {
    const { token, refreshToken, expiresAt, dateCreated } = response;

    return {
        oauth_credentials: {
            token,
            refreshToken,
            expiresAt,
            dateCreated,
        },
    };
}
