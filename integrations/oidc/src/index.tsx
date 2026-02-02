import * as jwt from '@tsndr/cloudflare-worker-jwt';
import { Router } from 'itty-router';

import { IntegrationInstallationConfiguration } from '@gitbook/api';
import {
    createIntegration,
    FetchEventCallback,
    Logger,
    RuntimeContext,
    RuntimeEnvironment,
    createComponent,
    ExposableError,
} from '@gitbook/runtime';

const logger = Logger('oidc.visitor-auth');

type OIDCRuntimeEnvironment = RuntimeEnvironment<{}, OIDCSiteInstallationConfiguration>;

type OIDCRuntimeContext = RuntimeContext<OIDCRuntimeEnvironment>;

type OIDCSiteInstallationConfiguration = {
    client_id?: string;
    authorization_endpoint?: string;
    access_token_endpoint?: string;
    client_secret?: string;
    scope?: string;
};

type OIDCState = OIDCSiteInstallationConfiguration;

type OIDCProps = {
    installation: {
        configuration?: IntegrationInstallationConfiguration;
    };
    siteInstallation: {
        configuration?: OIDCSiteInstallationConfiguration;
    };
};

export type OIDCAction = { action: 'save.config' };

type OIDCTokenResponseData = {
    access_token?: string;
    id_token?: string;
    refresh_token?: string;
    token_type: 'Bearer';
    expires_in: number;
};

const getDomainWithHttps = (url: string): string => {
    const sanitizedURL = url.trim();
    if (sanitizedURL.startsWith('https://')) {
        return sanitizedURL;
    } else if (sanitizedURL.startsWith('http://')) {
        return sanitizedURL.replace('http://', 'https://');
    } else {
        return `https://${sanitizedURL}`;
    }
};

const GITBOOK_OIDC_USER_AGENT = 'GitBook-OIDC-Integration';

const configBlock = createComponent<OIDCProps, OIDCState, OIDCAction, OIDCRuntimeContext>({
    componentId: 'config',
    initialState: (props) => {
        const siteInstallation = props.siteInstallation;
        return {
            client_id: siteInstallation.configuration?.client_id || '',
            authorization_endpoint: siteInstallation.configuration?.authorization_endpoint || '',
            access_token_endpoint: siteInstallation.configuration?.access_token_endpoint || '',
            client_secret: siteInstallation.configuration?.client_secret || '',
            scope: siteInstallation.configuration?.scope || '',
        };
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'save.config':
                const { api, environment } = context;

                const siteInstallation = assertSiteInstallation(environment);

                const configurationBody = {
                    ...siteInstallation.configuration,
                    client_id: element.state.client_id,
                    client_secret: element.state.client_secret,
                    authorization_endpoint: getDomainWithHttps(
                        element.state.authorization_endpoint ?? '',
                    ),
                    access_token_endpoint: getDomainWithHttps(
                        element.state.access_token_endpoint ?? '',
                    ),
                    scope: element.state.scope ? normalizeScopes(element.state.scope) : undefined,
                };
                await api.integrations.updateIntegrationSiteInstallation(
                    siteInstallation.integration,
                    siteInstallation.installation,
                    siteInstallation.site,
                    {
                        configuration: {
                            ...configurationBody,
                        },
                    },
                );

                return { type: 'complete' };
        }
    },
    render: async (element, context) => {
        const siteInstallation = context.environment.siteInstallation;
        const VACallbackURL = `${siteInstallation?.urls?.publicEndpoint}/visitor-auth/response`;
        return (
            <block>
                <input
                    label="Client ID"
                    hint={
                        <text>
                            The unique identifier of your OIDC app client.
                            <link
                                target={{
                                    url: 'https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest',
                                }}
                            >
                                {' '}
                                More Details
                            </link>
                        </text>
                    }
                    element={<textinput state="client_id" placeholder="Client ID" />}
                />

                <input
                    label="Authorization Endpoint"
                    hint={
                        <text>
                            The Authorization Endpoint of your Authentication provider.
                            <link
                                target={{
                                    url: 'https://openid.net/specs/openid-connect-core-1_0.html#AuthorizationEndpoint',
                                }}
                            >
                                {' '}
                                More Details
                            </link>
                        </text>
                    }
                    element={
                        <textinput
                            state="authorization_endpoint"
                            placeholder="Authorization endpoint"
                        />
                    }
                />

                <input
                    label="Access Token Endpoint"
                    hint={
                        <text>
                            The Access Token endpoint of your authentication provider.
                            <link
                                target={{
                                    url: 'https://openid.net/specs/openid-connect-core-1_0.html#TokenEndpoint',
                                }}
                            >
                                {' '}
                                More Details
                            </link>
                        </text>
                    }
                    element={
                        <textinput
                            state="access_token_endpoint"
                            placeholder="Access Token endpoint"
                        />
                    }
                />

                <input
                    label="Client Secret"
                    hint={
                        <text>
                            The secret used for signing and validating tokens.
                            <link
                                target={{
                                    url: 'https://cloudentity.com/developers/basics/oauth-client-authentication/client-secret-authentication/',
                                }}
                            >
                                {' '}
                                More Details
                            </link>
                        </text>
                    }
                    element={<textinput state="client_secret" placeholder="Client Secret" />}
                />

                <input
                    label="OAuth Scopes"
                    hint={
                        <text>
                            The list of scopes to be granted to the ID token. Enter openid if not
                            sure
                            <link
                                target={{
                                    url: 'https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest',
                                }}
                            >
                                {' '}
                                More Details
                            </link>
                        </text>
                    }
                    element={<textinput state="scope" placeholder="Scopes" />}
                />
                <divider size="medium" />
                <hint>
                    <text style="bold">
                        The following URL needs to be saved as an allowed callback URL in your
                        authentication provider:
                    </text>
                </hint>
                <codeblock content={VACallbackURL} />
                <input
                    label=""
                    hint=""
                    element={
                        <button
                            style="primary"
                            disabled={false}
                            label="Save"
                            tooltip="Save configuration"
                            onPress={{
                                action: 'save.config',
                            }}
                        />
                    }
                />
            </block>
        );
    },
});

/**
 * Normalize a user-provided scopes string into a space seperated list as
 * expected by OIDC/OAuth when making the auth request.
 *
 * Spec: https://datatracker.ietf.org/doc/html/rfc6749#section-3.3
 */
function normalizeScopes(input: string): string {
    return input.replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Get the published content related urls.
 */
async function getPublishedContentUrls(context: OIDCRuntimeContext) {
    const organizationId = assertOrgId(context.environment);
    const siteInstallation = assertSiteInstallation(context.environment);
    const publishedContentData = await context.api.orgs.getSiteById(
        organizationId,
        siteInstallation.site,
    );

    return publishedContentData.data.urls;
}

function assertSiteInstallation(environment: OIDCRuntimeEnvironment) {
    const siteInstallation = environment.siteInstallation;
    if (!siteInstallation) {
        throw new Error('No site installation found');
    }

    return siteInstallation;
}

function assertOrgId(environment: OIDCRuntimeEnvironment) {
    const orgId = environment.installation?.target?.organization!;
    if (!orgId) {
        throw new Error('No org ID found');
    }

    return orgId;
}

/**
 * Validates that the configured access token endpoint is not pointing back to this integration.
 * Prevents misconfiguration where the token endpoint is set to the integration handler URL.
 */
function validateAccessTokenEndpoint(tokenEndpoint: string, installationURL: string) {
    let tokenUrl: URL;
    let installUrl: URL;

    try {
        tokenUrl = new URL(tokenEndpoint);
    } catch {
        throw new Error(`Invalid access token endpoint URL: "${tokenEndpoint}"`);
    }

    try {
        installUrl = new URL(installationURL);
    } catch {
        throw new Error(`Invalid installation URL: "${installationURL}"`);
    }

    if (tokenUrl.protocol !== 'https:') {
        throw new Error('Access token endpoint must use https');
    }

    if (tokenUrl.host === installUrl.host) {
        throw new Error('Invalid access token endpoint URL.');
    }
}

const handleFetchEvent: FetchEventCallback<OIDCRuntimeContext> = async (request, context) => {
    const { environment } = context;
    const siteInstallation = assertSiteInstallation(environment);
    const installationURL = siteInstallation.urls?.publicEndpoint;
    if (installationURL) {
        const router = Router({
            base: new URL(installationURL).pathname,
        });

        router.get('/visitor-auth/response', async (request) => {
            if ('site' in siteInstallation && siteInstallation.site) {
                const publishedContentUrls = await getPublishedContentUrls(context);

                const accessTokenEndpoint = siteInstallation.configuration.access_token_endpoint;
                const clientId = siteInstallation.configuration.client_id;
                const clientSecret = siteInstallation.configuration.client_secret;

                if (!clientId || !clientSecret || !accessTokenEndpoint) {
                    return new Response(
                        'Error: Either client id, client secret or access token endpoint is missing in configuration',
                        {
                            status: 400,
                        },
                    );
                }

                try {
                    validateAccessTokenEndpoint(accessTokenEndpoint, installationURL);
                } catch (e) {
                    const message =
                        e instanceof Error ? e.message : 'Invalid access token endpoint';
                    logger.error(`Access token endpoint validation failed: ${message}`);
                    return new Response(`Error: ${message}`, { status: 400 });
                }

                if (!request.query.code) {
                    `Error: authorization response from upstream provider doesn't include the auth code.` +
                        (request.query.error
                            ? ` (error: ${request.query.error.toString()} - ${request.query.error_description?.toString()})`
                            : '');
                    return new Response(`Error: received request without authorization code`, {
                        status: 401,
                    });
                }

                const searchParams = new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: clientId,
                    client_secret: clientSecret,
                    code: `${request.query.code}`,
                    redirect_uri: `${installationURL}/visitor-auth/response`,
                });

                const tokenResp = await fetch(accessTokenEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'User-Agent': GITBOOK_OIDC_USER_AGENT,
                    },
                    body: searchParams,
                    // Safeguards against upstream OAuth servers not following OAuth spec and potentially returning a redirect
                    // response on error instead of returning a 4xx responses.
                    redirect: 'manual',
                });

                if (!tokenResp.ok) {
                    const errorText = await tokenResp.text();
                    logger.error(
                        `Error while fetching token from auth provider (status: ${tokenResp.status}): `,
                        errorText,
                    );

                    return new Response(
                        'Error: Could not fetch ID token from your authentication provider',
                        {
                            status: 401,
                        },
                    );
                }

                const tokenRespData = await tokenResp.json<OIDCTokenResponseData>();
                if (!tokenRespData.id_token) {
                    logger.error(JSON.stringify(tokenResp));
                    logger.error(
                        `Did not receive access token. Error: ${tokenResp && 'error' in tokenResp ? tokenResp.error : ''} ${
                            tokenResp && 'error_description' in tokenResp
                                ? tokenResp.error_description
                                : ''
                        }`,
                    );
                    return new Response(
                        'Error: No access token found in response from your authentication provider',
                        {
                            status: 401,
                        },
                    );
                }

                // TODO: verify token using JWKS and check audience (aud) claims
                const decodedIdToken = await jwt.decode(tokenRespData.id_token);
                const privateKey = context.environment.signingSecrets.siteInstallation;
                if (!privateKey) {
                    return new Response('Error: Missing private key from site installation', {
                        status: 400,
                    });
                }

                let jwtToken: string | undefined;
                try {
                    jwtToken = await jwt.sign(
                        {
                            ...(decodedIdToken.payload ?? {}),
                            exp: Math.floor(Date.now() / 1000) + 1 * (60 * 60),
                        },
                        privateKey,
                    );
                } catch (e) {
                    return new Response('Error: Could not sign JWT token', {
                        status: 500,
                    });
                }

                const publishedContentUrl = publishedContentUrls?.published;
                if (!publishedContentUrl || !jwtToken) {
                    return new Response(
                        "Error: Either JWT token or site's published URL is missing",
                        {
                            status: 500,
                        },
                    );
                }

                const state = request.query.state?.toString();
                let location = state ? state.substring(state.indexOf('-') + 1) : '';
                location = location.startsWith('/') ? location.slice(1) : location;
                const url = new URL(
                    `${
                        publishedContentUrl.endsWith('/')
                            ? publishedContentUrl
                            : `${publishedContentUrl}/`
                    }${location || ''}`,
                );
                url.searchParams.append('jwt_token', jwtToken);

                return Response.redirect(url.toString());
            }
        });

        let response;
        try {
            response = await router.handle(request, context);
        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error(
                    'error handling request:',
                    `${error}${error.stack ? `\n${error.stack}` : ''}`,
                );
                return new Response(error.message, {
                    status: 500,
                });
            }

            return new Response('Unexpected error when handling request', {
                status: 500,
            });
        }

        if (!response) {
            return new Response(`No route matching ${request.method} ${request.url}`, {
                status: 404,
            });
        }

        return response;
    }
};

export default createIntegration({
    fetch: handleFetchEvent,
    components: [configBlock],
    fetch_visitor_authentication: async (event, context) => {
        const { environment } = context;
        const siteInstallation = assertSiteInstallation(environment);

        const installationURL = siteInstallation.urls.publicEndpoint;
        const configuration = siteInstallation.configuration;

        const authorizationEndpoint = configuration.authorization_endpoint;
        const clientId = configuration.client_id;
        const scope = configuration.scope;
        if (!clientId || !authorizationEndpoint || !scope) {
            throw new ExposableError('OIDC configuration is missing');
        }

        const location = event.location ? event.location : '';

        const url = new URL(authorizationEndpoint);
        url.searchParams.append('client_id', clientId);
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('redirect_uri', `${installationURL}/visitor-auth/response`);
        url.searchParams.append('scope', scope.toLowerCase());
        url.searchParams.append('state', `oidcstate-${location}`);

        return Response.redirect(url.toString());
    },
});
