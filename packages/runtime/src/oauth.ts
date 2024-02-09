import { GitBookAPI, RequestUpdateIntegrationInstallation } from '@gitbook/api';

import { RuntimeCallback } from './context';
import { Logger } from './logger';

/**
 * Utility interface for typing the response from a Slack OAuth call.
 * TODO: Use the official Slack type
 */
export interface OAuthResponse {
    ok?: boolean;
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    team: {
        id: string;
    };
}

export interface OAuthConfiguration {
    access_token: string;
    refresh_token?: string;
    expires_at: string;
}

export interface OAuthConfig {
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
    authorizeURL: string;

    /**
     * URL to exchange the OAuth code for an access token.
     */
    accessTokenURL: string;

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
        response: OAuthResponse
    ) => RequestUpdateIntegrationInstallation | Promise<RequestUpdateIntegrationInstallation>;
}

const logger = Logger('oauth');

/**
 * Create a fetch request handler to handle an OAuth authentication flow.
 * The credentials are stored in the installation configuration as `installationCredentialsKey`.
 *
 * When using this handler, you must configure `https://integrations.gitbook.com/integrations/{name}/` as a redirect URI.
 */
export function createOAuthHandler(
    config: OAuthConfig,
    options: {
        /**
         * Whether to replace the existing installation configuration or merge it
         * with the new oauth credentials.
         * @default true
         */
        replace?: boolean;
    } = {}
): RuntimeCallback<[Request], Promise<Response>> {
    const { extractCredentials = defaultExtractCredentials } = config;
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
                logger.error(`Cannot initiate OAuth flow without an installation`);
                return new Response(
                    JSON.stringify({
                        error: 'Cannot initiate OAuth flow without an installation',
                    }),
                    {
                        status: 400,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }

            logger.debug(`handle redirect to authorization at: ${config.authorizeURL}`);

            const redirectTo = new URL(config.authorizeURL);
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
                })
            );

            if (config.scopes?.length) {
                redirectTo.searchParams.set('scope', 'SCOPE_PLACEHOLDER');
            }

            if (config.prompt) {
                redirectTo.searchParams.set('prompt', config.prompt);
            }

            const url = redirectTo
                .toString()
                .replace('SCOPE_PLACEHOLDER', config.scopes?.join('%20'));

            logger.debug(`oauth redirecting to ${url}`);

            return Response.redirect(url);
        }

        //
        // Exchange the code for an access token
        //
        else {
            logger.debug(`handle oauth access token exchange: ${config.accessTokenURL}`);

            const params = new URLSearchParams();
            params.set('client_id', config.clientId);
            params.set('client_secret', config.clientSecret);
            params.set('code', code);
            params.set('redirect_uri', redirectUri);
            params.set('grant_type', 'authorization_code');

            const response = await fetch(config.accessTokenURL, {
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
                    `Failed to exchange code for access token ${await response.text()}`
                );
            }

            const json = await response.json<OAuthResponse>();

            // Store the credentials in the installation configuration
            let credentials: RequestUpdateIntegrationInstallation;
            try {
                credentials = await extractCredentials(json);
            } catch (error) {
                logger.error(`extractCredentials error`, error.stack);
                return new Response(
                    JSON.stringify({
                        error: `Failed to retrieve access_token from OAuth response. Please try again.`,
                    }),
                    {
                        status: 400,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }

            logger.debug(`exchange code for credentials`, credentials);

            try {
                /**
                 * Parse the JSON encoded state parameter.
                 * If the state contains a spaceId, then the Oauth flow was initiated from a space installation
                 * public url and thus we need to update the space installation config otherwise fallback to
                 * updating the installation config.
                 */
                const state = JSON.parse(url.searchParams.get('state')) as {
                    installationId: string;
                    spaceId?: string;
                };

                const existing = {
                    configuration: {},
                };

                if (state.spaceId) {
                    if (!replace) {
                        const { data: spaceInstallation } =
                            await api.integrations.getIntegrationSpaceInstallation(
                                environment.integration.name,
                                state.installationId,
                                state.spaceId
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
                        }
                    );
                } else {
                    if (!replace) {
                        const { data: installation } =
                            await api.integrations.getIntegrationInstallationById(
                                environment.integration.name,
                                state.installationId
                            );
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
                        }
                    );
                }
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
    };
}

export async function getToken(
    credentials: OAuthConfiguration,
    config: Pick<
        OAuthConfig,
        'accessTokenURL' | 'clientId' | 'clientSecret' | 'extractCredentials'
    > & {
        api: GitBookAPI;
        installationId: string;
        installationName: string;
    }
): Promise<string> {
    const { api, extractCredentials = defaultExtractCredentials } = config;

    if (new Date(credentials.expires_at).getTime() - Date.now() > 10000) {
        return credentials.access_token;
    }

    // Refresh using the refresh_token
    const params = new URLSearchParams();
    params.set('client_id', config.clientId);
    params.set('client_secret', config.clientSecret);
    params.set('grant_type', 'refresh_token');
    params.set('refresh_token', credentials.refresh_token);

    const response = await fetch(config.accessTokenURL, {
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

    const json = await response.json<OAuthResponse>();
    const creds = await extractCredentials(json);

    await api.integrations.updateIntegrationInstallation(
        config.installationName,
        config.installationId,
        creds
    );

    return creds.configuration.oauth_credentials.access_token;
}

/**
 * Default implementation to extract the credentials from the OAuth response.
 * throws an error if the `access_token` is not present in the response.
 */
function defaultExtractCredentials(response: OAuthResponse): RequestUpdateIntegrationInstallation {
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
