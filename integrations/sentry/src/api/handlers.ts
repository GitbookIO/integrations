import * as cookie from 'cookie';

import { Logger } from '@gitbook/runtime';
import { SentryCredentials, SentryOAuthCredentials, SentryRuntimeContext } from './../types';

import * as sentry from '../api/sentry';

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
export async function oauthHandler(request: Request, { environment }: SentryRuntimeContext) {
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
            'Set-Cookie': cookie.serialize(INSTALLATION_STATE_COOKIE, environment.installation.id, {
                path: new URL(environment.integration.urls.publicEndpoint).pathname, // /v1/integrations/sentry/integration
                maxAge: 60 * 5, // 5 mins
            }),
        },
    });
}

export async function redirectHandler(
    request: Request,
    { api, environment }: SentryRuntimeContext
) {
    // TODO
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

    // gitbook integration installation retrieved from cookie
    const cookies = cookie.parse(request.headers.get('Cookie') || '');
    const state = cookies[INSTALLATION_STATE_COOKIE];
    if (!state) {
        logger.error('Missing installation state cookie');
        return new Response(null, {
            status: 302,
            headers: {
                // TODO read from env
                Location: `https://app.gitbook.com/integrations/${environment.integration.name}/`,
            },
        });
    }

    const tokens = await sentry.fetchCredentials({
        clientId: environment.secrets.CLIENT_ID,
        clientSecret: environment.secrets.CLIENT_SECRET,
        code,
        grantType: sentry.AuthorizationGrant.AuthorizationCode,
        installationId: sentryInstallationId,
    });

    const credentials = extractCredentials(tokens);

    // Store credentials and extras in gitbook's installation configuration
    try {
        await api.integrations.updateIntegrationInstallation(environment.integration.name, state, {
            configuration: {
                ...credentials,
                sentryInstallationId,
                sentryOrgSlug,
            },
        });
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
}

export async function webhookHandler(
    request: Request,
    { api, environment }: SentryRuntimeContext
) {}

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
