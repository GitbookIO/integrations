import type { IntegrationInstallation, RequestUpdateIntegrationInstallation } from '@gitbook/api';

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
}

const logger = Logger('oauth');

/**
 * Create a fetch request handler to handle an OAuth authentication flow.
 * The credentials are stored in the installation configuration as `installationCredentialsKey`.
 *
 * When using this handler, you must configure `https://integrations.gitbook.com/integrations/{name}/` as a redirect URI.
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

            const authorizeURL =
                typeof config.authorizeURL === 'function'
                    ? config.authorizeURL(environment.installation)
                    : config.authorizeURL;

            logger.debug(`handle redirect to authorization at: ${authorizeURL}`);

            const redirectTo = new URL(authorizeURL);
            redirectTo.searchParams.set('client_id', config.clientId);
            redirectTo.searchParams.set('redirect_uri', redirectUri);
            redirectTo.searchParams.set('response_type', 'code');
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

            if (config.scopes?.length) {
                redirectTo.searchParams.set('scope', 'SCOPE_PLACEHOLDER');
            }

            if (config.prompt) {
                redirectTo.searchParams.set('prompt', config.prompt);
            }

            const url = redirectTo
                .toString()
                .replace('SCOPE_PLACEHOLDER', config.scopes?.join('%20') ?? '');

            logger.debug(`oauth redirecting to ${url}`);

            return Response.redirect(url);
        }

        //
        // Exchange the code for an access token
        //
        else {
            const rawState = url.searchParams.get('state');
            if (!rawState) {
                throw new Error('Missing state parameter in OAuth callback');
            }

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
            const state: {
                installationId: string;
                spaceId?: string;
                siteId?: string;
            } = JSON.parse(rawState);

            let installation: IntegrationInstallation | null = null;

            let accessTokenURL = '';
            if (typeof config.accessTokenURL === 'function') {
                const result = await api.integrations.getIntegrationInstallationById(
                    environment.integration.name,
                    state.installationId,
                );
                installation = result.data;
                accessTokenURL = config.accessTokenURL(installation);
            } else {
                accessTokenURL = config.accessTokenURL;
            }

            logger.debug(`handle oauth access token exchange: ${accessTokenURL}`);

            const params = new URLSearchParams();
            params.set('client_id', config.clientId);
            params.set('client_secret', config.clientSecret);
            params.set('code', code);
            params.set('redirect_uri', redirectUri);
            params.set('grant_type', 'authorization_code');

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
                    `Failed to exchange code for access token ${await response.text()}`,
                );
            }

            const json = (await response.json()) as TOAuthResponse;

            // Store the credentials in the installation configuration
            // @ts-ignore
            const credentials = await extractCredentials(json);
            logger.debug(`exchange code for credentials`, credentials);

            const existing = {
                configuration: {},
            };

            if (state.spaceId) {
                if (!replace) {
                    const { data: spaceInstallation } =
                        await api.integrations.getIntegrationSpaceInstallation(
                            environment.integration.name,
                            state.installationId,
                            state.spaceId,
                        );
                    existing.configuration = spaceInstallation.configuration;
                }

                // We need to make sure that properties outside of the credentials configuration are also passed when updating the installation (such as externalIds)
                const {
                    configuration: credentialsConfiguration,
                    ...credentialsMinusConfiguration
                } = credentials;
                await api.integrations.updateIntegrationSpaceInstallation(
                    environment.integration.name,
                    state.installationId,
                    state.spaceId,
                    {
                        configuration: {
                            ...existing.configuration,
                            ...credentialsConfiguration,
                        },
                        ...credentialsMinusConfiguration,
                    },
                );
            } else if (state.siteId) {
                if (!replace) {
                    const { data: siteInstallation } =
                        await api.integrations.getIntegrationSiteInstallation(
                            environment.integration.name,
                            state.installationId,
                            state.siteId,
                        );
                    existing.configuration = siteInstallation.configuration;
                }

                // We need to make sure that properties outside of the credentials configuration are also passed when updating the installation (such as externalIds)
                const {
                    configuration: credentialsConfiguration,
                    ...credentialsMinusConfiguration
                } = credentials;
                await api.integrations.updateIntegrationSiteInstallation(
                    environment.integration.name,
                    state.installationId,
                    state.siteId,
                    {
                        configuration: {
                            ...existing.configuration,
                            ...credentialsConfiguration,
                        },
                        ...credentialsMinusConfiguration,
                    },
                );
            } else {
                if (!replace) {
                    if (!installation) {
                        const result = await api.integrations.getIntegrationInstallationById(
                            environment.integration.name,
                            state.installationId,
                        );
                        installation = result.data;
                    }
                    existing.configuration = installation.configuration;
                }

                // We need to make sure that properties outside of the credentials configuration are also passed when updating the installation (such as externalIds)
                const {
                    configuration: credentialsConfiguration,
                    ...credentialsMinusConfiguration
                } = credentials;

                await api.integrations.updateIntegrationInstallation(
                    environment.integration.name,
                    state.installationId,
                    {
                        configuration: {
                            ...existing.configuration,
                            ...credentialsConfiguration,
                        },
                        ...credentialsMinusConfiguration,
                    },
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
export async function getOAuthToken(
    credentials: OAuthConfiguration,
    config: Pick<
        OAuthConfig,
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
        throw new Error(`Failed to exchange code for access token ${await response.text()}`);
    }

    const json = (await response.json()) as OAuthResponse;
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
        logger.error(`${message} ${JSON.stringify(response, null, 2)} `);
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
