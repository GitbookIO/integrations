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
    config: OAuthConfig
): RuntimeCallback<[Request], Promise<Response>> {
    const { extractCredentials = defaultExtractCredentials } = config;

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
            const redirectTo = new URL(config.authorizeURL);
            redirectTo.searchParams.set('client_id', config.clientId);
            redirectTo.searchParams.set('redirect_uri', redirectUri);
            redirectTo.searchParams.set('response_type', 'code');
            redirectTo.searchParams.set('state', environment.installation.id);

            if (config.scopes?.length) {
                redirectTo.searchParams.set('scope', 'SCOPE_PLACEHOLDER');
            }

            if (config.prompt) {
                redirectTo.searchParams.set('prompt', config.prompt);
            }

            const url = redirectTo
                .toString()
                .replace('SCOPE_PLACEHOLDER', config.scopes?.join('%20'));
            logger.debug(`handle oauth redirect to ${url}`);
            return Response.redirect(url);
        }

        //
        // Exchange the code for an access token
        //
        else {
            const installationId = url.searchParams.get('state');

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
            const credentials = await extractCredentials(json);

            logger.debug(`exchange code for credentials`, credentials);

            try {
                await api.integrations.updateIntegrationInstallation(
                    environment.integration.name,
                    installationId,
                    credentials
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

function defaultExtractCredentials(response: OAuthResponse): RequestUpdateIntegrationInstallation {
    if (!response.access_token) {
        throw new Error(
            `Could not extract access_token from response ${JSON.stringify(response, null, 4)}`
        );
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
