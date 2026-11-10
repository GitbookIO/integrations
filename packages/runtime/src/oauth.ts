import {
    GitBookAPIError,
    type IntegrationInstallation,
    type RequestUpdateIntegrationInstallation,
} from '@gitbook/api';

import type { RuntimeCallback, RuntimeContext } from './context';
import { Logger } from './logger';

/**
 * Utility interface for typing the response from a Slack OAuth call.
 */
export interface OAuthResponse {
    ok?: boolean;
    access_token: string;
    refresh_token?: string;
    expires_in: number;
}

export type OAuthConfiguration = {
    access_token: string;
    refresh_token?: string;
    expires_at?: string;
};

export interface OAuthConfig<TOAuthResponse = OAuthResponse> {
    /**
     * Redirect URL to use. When the OAuth identity provider only accept a static one.
     */
    redirectURL?: string;

    /**
     * ID of the client application in the OAuth provider.
     */
    clientId: string;

    /**
     * Secret of the client application in the OAuth provider.
     */
    clientSecret: string;

    /**
     * URL to redirect the user to, for authrorization.
     */
    authorizeURL: string | ((installation: IntegrationInstallation) => string);

    /**
     * URL to exchange the OAuth code for an access token.
     */
    accessTokenURL: string | ((installation: IntegrationInstallation) => string);

    /**
     * Scopes to ask for.
     */
    scopes?: string[];

    /**
     * Optional configuration for a prompt during the OAuth process.
     */
    prompt?: string;

    /**
     * Extract the credentials from the code exchange response.
     */
    extractCredentials?: (
        response: TOAuthResponse,
    ) => RequestUpdateIntegrationInstallation | Promise<RequestUpdateIntegrationInstallation>;

    /**
     * Send a PKCE (S256) `code_challenge` when authorizing and the matching `code_verifier` when
     * exchanging the code. Only applies to flows started by GitBook with an OAuth transaction.
     * Enable it only if the OAuth provider supports PKCE for this client.
     * @default false
     */
    pkce?: boolean;
}

/**
 * Target of an OAuth flow, where the credentials are written.
 */
interface OAuthTarget {
    installationId: string;
    spaceId?: string;
    siteId?: string;
}

const MAX_ERROR_DETAIL_LENGTH = 200;

/**
 * Transaction IDs and PKCE S256 challenges are both 32 bytes encoded as unpadded base64url.
 */
const OAUTH_TRANSACTION_VALUE_REGEX = /^[A-Za-z0-9_-]{43}$/;

const logger = Logger('oauth');

/**
 * Create a fetch request handler to handle an OAuth authentication flow.
 * The credentials are stored in the installation configuration as `installationCredentialsKey`.
 *
 * When using this handler, register the exact redirect URI with the OAuth provider: `redirectURL`
 * when set (usually `<integration publicEndpoint>/oauth`), otherwise the URL of the handler's route.
 * Do not register a prefix such as `https://integrations.gitbook.com/`.
 *
 * When GitBook starts the flow with an OAuth transaction, `state` is the transaction ID and the
 * credentials are written to the installation, space or site bound to the transaction.
 */
export function createOAuthHandler<TOAuthResponse = OAuthResponse>(
    config: OAuthConfig<TOAuthResponse>,
    options: {
        /**
         * Whether to replace the existing installation configuration or merge it
         * with the new oauth credentials.
         * @default true
         */
        replace?: boolean;
    } = {},
): RuntimeCallback<[Request], Promise<Response>> {
    const { extractCredentials = defaultOAuthExtractCredentials } = config;
    const { replace = true } = options;

    return async (request, { api, environment }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get('code');

        let redirectUri = config.redirectURL;
        if (!redirectUri) {
            const redirectUriObj = new URL(request.url);
            redirectUriObj.search = '';
            redirectUri = redirectUriObj.toString();
        }

        //
        // Redirect to authorization
        //
        if (!code) {
            if (!environment.installation) {
                logger.error('Cannot initiate OAuth flow without an installation');
                return new Response(
                    JSON.stringify({
                        error: 'Cannot initiate OAuth flow without an installation',
                    }),
                    {
                        status: 400,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                );
            }

            const transactionId = url.searchParams.get('gitbook_oauth_transaction');
            const codeChallenge = url.searchParams.get('gitbook_oauth_code_challenge');
            if (
                (transactionId !== null || codeChallenge !== null) &&
                (transactionId === null ||
                    codeChallenge === null ||
                    !isOAuthTransactionValue(transactionId) ||
                    !isOAuthTransactionValue(codeChallenge))
            ) {
                logger.error('Invalid OAuth transaction parameters');
                return createRestartResponse();
            }

            const authorizeURL =
                typeof config.authorizeURL === 'function'
                    ? config.authorizeURL(environment.installation)
                    : config.authorizeURL;

            logger.debug(`handle redirect to authorization at: ${getURLForLogging(authorizeURL)}`);

            const redirectTo = new URL(authorizeURL);
            redirectTo.searchParams.set('client_id', config.clientId);
            redirectTo.searchParams.set('redirect_uri', redirectUri);
            redirectTo.searchParams.set('response_type', 'code');
            if (transactionId !== null && codeChallenge !== null) {
                redirectTo.searchParams.set('state', transactionId);
                if (config.pkce) {
                    redirectTo.searchParams.set('code_challenge', codeChallenge);
                    redirectTo.searchParams.set('code_challenge_method', 'S256');
                }
            } else {
                redirectTo.searchParams.set(
                    'state',
                    JSON.stringify({
                        installationId: environment.installation.id,
                        ...(environment.spaceInstallation?.space
                            ? { spaceId: environment.spaceInstallation?.space }
                            : {}),
                        ...(environment.siteInstallation?.site
                            ? { siteId: environment.siteInstallation?.site }
                            : {}),
                    }),
                );
            }

            if (config.scopes?.length) {
                redirectTo.searchParams.set('scope', 'SCOPE_PLACEHOLDER');
            }

            if (config.prompt) {
                redirectTo.searchParams.set('prompt', config.prompt);
            }

            const authorizationURL = redirectTo
                .toString()
                .replace('SCOPE_PLACEHOLDER', config.scopes?.join('%20') ?? '');

            logger.debug(`oauth redirecting to ${getURLForLogging(authorizationURL)}`);

            return Response.redirect(authorizationURL);
        }

        //
        // Exchange the code for an access token
        //
        else {
            const rawState = url.searchParams.get('state');
            if (!rawState) {
                throw new Error('Missing state parameter in OAuth callback');
            }

            let target: OAuthTarget;
            let oauthTransaction: string | undefined;
            let codeVerifier: string | undefined;

            if (isOAuthTransactionValue(rawState)) {
                // The target comes only from the consumed transaction, never from the request.
                try {
                    const { data: transaction } =
                        await api.integrations.consumeIntegrationOAuthTransaction(
                            environment.integration.name,
                            rawState,
                            { redirectUri, code },
                        );
                    target = {
                        installationId: transaction.installation,
                        ...(transaction.space ? { spaceId: transaction.space } : {}),
                        ...(transaction.site ? { siteId: transaction.site } : {}),
                    };
                    oauthTransaction = rawState;
                    codeVerifier = transaction.codeVerifier;
                } catch (error) {
                    logger.error(
                        `Failed to consume the OAuth transaction: ${
                            error instanceof GitBookAPIError
                                ? `HTTP ${error.code}`
                                : 'request error'
                        }`,
                    );
                    return createRestartResponse();
                }

                if (config.pkce && !codeVerifier) {
                    logger.error('Missing PKCE code verifier in the OAuth transaction');
                    return createRestartResponse();
                }
            } else {
                /**
                 * Parse the JSON encoded state parameter.
                 *
                 * If the state contains a spaceId, then the Oauth flow was initiated from a space installation
                 * public url and thus we need to update the space installation config
                 *
                 * If the state contains a siteId, then the Oauth flow was initiated from a site installation
                 * public url and thus we need to update the site installation config
                 *
                 * If the state does not contain a spaceId or siteId, then the Oauth flow was initiated from
                 * a regular installation public url and thus we need to update the installation config
                 */
                target = JSON.parse(rawState);
            }

            let installation: IntegrationInstallation | null = null;

            let accessTokenURL = '';
            if (typeof config.accessTokenURL === 'function') {
                const result = await api.integrations.getIntegrationInstallationById(
                    environment.integration.name,
                    target.installationId,
                );
                installation = result.data;
                accessTokenURL = config.accessTokenURL(installation);
            } else {
                accessTokenURL = config.accessTokenURL;
            }

            logger.debug(`handle oauth access token exchange: ${getURLForLogging(accessTokenURL)}`);

            const params = new URLSearchParams();
            params.set('client_id', config.clientId);
            params.set('client_secret', config.clientSecret);
            params.set('code', code);
            params.set('redirect_uri', redirectUri);
            params.set('grant_type', 'authorization_code');
            if (config.pkce && codeVerifier) {
                params.set('code_verifier', codeVerifier);
            }

            const response = await fetch(accessTokenURL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
            });

            logger.debug(`received oauth response ${response.status}: ${response.statusText}`);

            if (!response.ok) {
                throw new Error(
                    `Failed to exchange code for access token: ${await getOAuthErrorSummary(response)}`,
                );
            }

            const json = (await response.json()) as TOAuthResponse;

            // Store the credentials in the installation configuration
            // @ts-ignore
            const credentials = await extractCredentials(json);
            logger.debug('exchanged code for credentials', {
                installationId: target.installationId,
                spaceId: target.spaceId,
                siteId: target.siteId,
            });

            const existing = {
                configuration: {},
            };

            // Properties outside of the credentials configuration (such as externalIds) are also
            // passed. The credentials are written in a single call: an OAuth transaction grant is single-use.
            const { configuration: credentialsConfiguration, ...credentialsMinusConfiguration } =
                credentials;
            const buildUpdate = () => ({
                configuration: {
                    ...existing.configuration,
                    ...credentialsConfiguration,
                },
                ...credentialsMinusConfiguration,
                ...(oauthTransaction ? { oauthTransaction } : {}),
            });

            if (target.spaceId) {
                if (!replace) {
                    const { data: spaceInstallation } =
                        await api.integrations.getIntegrationSpaceInstallation(
                            environment.integration.name,
                            target.installationId,
                            target.spaceId,
                        );
                    existing.configuration = spaceInstallation.configuration;
                }

                await api.integrations.updateIntegrationSpaceInstallation(
                    environment.integration.name,
                    target.installationId,
                    target.spaceId,
                    buildUpdate(),
                );
            } else if (target.siteId) {
                if (!replace) {
                    const { data: siteInstallation } =
                        await api.integrations.getIntegrationSiteInstallation(
                            environment.integration.name,
                            target.installationId,
                            target.siteId,
                        );
                    existing.configuration = siteInstallation.configuration;
                }

                await api.integrations.updateIntegrationSiteInstallation(
                    environment.integration.name,
                    target.installationId,
                    target.siteId,
                    buildUpdate(),
                );
            } else {
                if (!replace) {
                    if (!installation) {
                        const result = await api.integrations.getIntegrationInstallationById(
                            environment.integration.name,
                            target.installationId,
                        );
                        installation = result.data;
                    }
                    existing.configuration = installation.configuration;
                }

                await api.integrations.updateIntegrationInstallation(
                    environment.integration.name,
                    target.installationId,
                    buildUpdate(),
                );
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
                },
            );
        }
    };
}

/**
 * Get the OAuth token from the credentials.
 * It will refresh the token if it's expired.
 */
export async function getOAuthToken<TOAuthResponse extends OAuthResponse = OAuthResponse>(
    credentials: OAuthConfiguration,
    config: Pick<
        OAuthConfig<TOAuthResponse>,
        'accessTokenURL' | 'clientId' | 'clientSecret' | 'extractCredentials'
    >,
    context: RuntimeContext,
): Promise<string> {
    const { extractCredentials = defaultOAuthExtractCredentials } = config;

    if (
        !credentials.expires_at ||
        new Date(credentials.expires_at).getTime() - Date.now() > 10000
    ) {
        return credentials.access_token;
    }

    if (!credentials.refresh_token) {
        throw new Error(
            `No refresh token available to refresh the OAuth token, expired at ${credentials.expires_at}`,
        );
    }

    // Refresh using the refresh_token
    const params = new URLSearchParams();
    params.set('client_id', config.clientId);
    params.set('client_secret', config.clientSecret);
    params.set('grant_type', 'refresh_token');
    params.set('refresh_token', credentials.refresh_token);

    const accessTokenURL =
        typeof config.accessTokenURL === 'function'
            ? config.accessTokenURL(context.environment.installation!)
            : config.accessTokenURL;

    const response = await fetch(accessTokenURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });

    logger.debug(`received oauth response ${response.status}: ${response.statusText}`);

    if (!response.ok) {
        throw new Error(
            `Failed to refresh the OAuth access token: ${await getOAuthErrorSummary(response)}`,
        );
    }

    const json = (await response.json()) as OAuthResponse & TOAuthResponse;
    const creds = await extractCredentials(json);
    const accessToken = (creds.configuration?.['oauth_credentials'] as OAuthConfiguration)
        ?.access_token;
    if (!accessToken) {
        throw new Error('Failed to retrieve access_token from OAuth response');
    }

    await context.api.integrations.updateIntegrationInstallation(
        context.environment.integration.name,
        context.environment.installation!.id,
        {
            configuration: {
                ...context.environment.installation?.configuration,
                ...creds.configuration,
            },
        },
    );

    return accessToken;
}

/**
 * Default implementation to extract the credentials from the OAuth response.
 * throws an error if the `access_token` is not present in the response.
 */
export function defaultOAuthExtractCredentials(
    response: OAuthResponse,
): RequestUpdateIntegrationInstallation {
    if (!response.access_token) {
        const message = `Failed to retrieve access_token from response`;
        logger.error(`${message}: ${summarizeOAuthErrorBody(response)}`);
        throw new Error(message);
    }

    return {
        configuration: {
            oauth_credentials: {
                access_token: response.access_token,
                expires_at: Date.now() + response.expires_in * 1000,
                ...(response.refresh_token ? { refresh_token: response.refresh_token } : {}),
            },
        },
    };
}

/**
 * Describe an OAuth provider response body without exposing its values.
 * Only the standard `error` and `error_description` fields are kept; otherwise only field names are listed.
 */
export function summarizeOAuthErrorBody(body: unknown): string {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return 'no error details';
    }

    const { error, error_description } = body as Record<string, unknown>;
    const details = [error, error_description]
        .filter((value): value is string => typeof value === 'string' && value.length > 0)
        .map((value) => value.slice(0, MAX_ERROR_DETAIL_LENGTH));
    if (details.length > 0) {
        return details.join(': ');
    }

    return `no error details (fields: ${Object.keys(body).join(', ') || 'none'})`;
}

/**
 * Describe a failed OAuth token endpoint response, without its raw body.
 */
async function getOAuthErrorSummary(response: Response): Promise<string> {
    const status = `HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ''}`;
    const text = await response.text().catch(() => '');

    let body: unknown = null;
    if (response.headers.get('content-type')?.includes('application/x-www-form-urlencoded')) {
        body = Object.fromEntries(new URLSearchParams(text));
    } else {
        try {
            body = JSON.parse(text);
        } catch {
            // Unknown formats may echo request values, so they are left out.
        }
    }

    return `${status}: ${summarizeOAuthErrorBody(body)}`;
}

function isOAuthTransactionValue(value: string): boolean {
    return OAUTH_TRANSACTION_VALUE_REGEX.test(value);
}

/**
 * Page shown when an OAuth transaction cannot be used. API errors are not shown.
 */
function createRestartResponse(): Response {
    return new Response(
        `
        <p>This connection could not be completed. Close this window and start the connection again from GitBook.</p>
        `,
        {
            status: 400,
            headers: {
                'Content-Type': 'text/html',
                'Cache-Control': 'no-store',
            },
        },
    );
}

/**
 * Strip the credentials, query and fragment of a URL before logging it.
 */
function getURLForLogging(url: string): string {
    try {
        const parsed = new URL(url);
        return `${parsed.origin}${parsed.pathname}`;
    } catch {
        return '<invalid URL>';
    }
}
