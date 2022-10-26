import * as cookie from 'cookie';
// eslint-disable-next-line import/no-internal-modules
import hmacSHA256 from 'crypto-js/hmac-sha256';

import { Logger } from '@gitbook/runtime';

import * as sentry from './sentry';
import {
    SentryCredentials,
    SentryInstallationWebhookPayload,
    SentryOAuthCredentials,
    SentryRuntimeContext,
} from './types';

export const logger = Logger('integration:sentry');

/**
 * This cookie is used to store the state (installationId) of the sentry integration in GitBook.
 * We cannot pass this state (or any other) parameter because Sentry doesn't support it.
 *
 * The reason this cookie is named __session is because ALL other cookies are stripped from the request by Cloud Functions,
 * which is where the request is routed before reaching the integration.
 *
 * @see https://firebase.google.com/docs/hosting/manage-cache#using_cookies
 */
const INSTALLATION_STATE_COOKIE = '__session';

/**
 * Redirect to a Sentry (external) app where the user will install the GitBook integration in their chosen Sentry org.
 * Passes our installation ID in the cookies (to be used when Sentry redirects back)
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

/**
 * Handles the OAuth callback from Sentry.
 * Exchanges the code for an access token and refresh token.
 */
export async function redirectHandler(
    request: Request,
    { api, environment }: SentryRuntimeContext
) {
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
            },
            externalIds: [sentryInstallationId, sentryOrgSlug],
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

/**
 * Handle the `installation.deleted` webhook from Sentry
 * Ignores the `installation.created` which is handled by the redirect handler
 */
export async function webhookHandler(
    request: Request & { content: SentryInstallationWebhookPayload },
    { api, environment }: SentryRuntimeContext
) {
    const resource = request.headers.get('Sentry-Hook-Resource');
    const payload = request.content;

    if (resource !== 'installation' || payload.action !== 'deleted') {
        return new Response(null, { status: 404 });
    }

    const sentryInstallationId = payload.data.installation.uuid;
    logger.info(
        `Sentry "installation.deleted" integration hook received with installation id ${sentryInstallationId}`
    );

    // Lookup the concerned installations
    const {
        data: { items: installations },
    } = await api.integrations.listIntegrationInstallations(environment.integration.name, {
        externalId: sentryInstallationId,
    });

    const installation = installations[0];
    if (!installation) {
        logger.error(`Could not find installation for sentry installation ${sentryInstallationId}`);
        return new Response(null, { status: 200 });
    }

    // remove installation in gitbook
    const gitbookInstallationId = installation.id;
    const res = await api.integrations.updateIntegrationInstallation(
        environment.integration.name,
        gitbookInstallationId,
        {
            configuration: {},
            externalIds: [],
        }
    );

    if (!res.ok) {
        logger.error(
            `Could not remove installation for sentry installation ${sentryInstallationId}`
        );
    } else {
        logger.info(
            `Remove installation for sentry installation ${sentryInstallationId} and gitbook installation ${gitbookInstallationId}`
        );
    }

    return new Response(null, { status: 200 });
}

/**
 * Verify the sentry webhook request middleware
 */
export async function withSignatureVerification(
    request: Request & { content: SentryInstallationWebhookPayload },
    { environment }: SentryRuntimeContext
) {
    const signature = getSignatureBody(request.content);
    const digest = hmacSHA256(signature, environment.secrets.CLIENT_SECRET).toString();

    if (
        // HACK: The signature header may be one of these two values
        digest === request.headers.get('Sentry-Hook-Signature') ||
        digest === request.headers.get('Sentry-App-Signature')
    ) {
        // itty-router middleware, continue to next handler
        return;
    }

    logger.error('Unauthorized: Could not verify request came from Sentry');
    return new Response(null, { status: 401 });
}

// There are few hacks in this verification step (denoted with HACK) that we at Sentry hope
// to migrate away from in the future. Presently however, for legacy reasons, they are
// necessary to keep around, so we've shown how to deal with them here.
function getSignatureBody(payload: any): string {
    const stringifiedBody = JSON.stringify(payload);
    // HACK: This is necessary since express.json() converts the empty request body to {}
    return stringifiedBody === '{}' ? '' : stringifiedBody;
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
