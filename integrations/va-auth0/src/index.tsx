import * as jwt from '@tsndr/cloudflare-worker-jwt';
import { Router, StatusError } from 'itty-router';

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

const logger = Logger('auth0.visitor-auth');

type Auth0RuntimeEnvironment = RuntimeEnvironment<{}, Auth0SiteInstallationConfiguration>;

type Auth0RuntimeContext = RuntimeContext<Auth0RuntimeEnvironment>;

type Auth0SiteInstallationConfiguration = {
    client_id?: string;
    issuer_base_url?: string;
    client_secret?: string;
    include_claims_in_va_token?: boolean;
};

type Auth0State = Auth0SiteInstallationConfiguration;

type Auth0Props = {
    installation: {
        configuration?: IntegrationInstallationConfiguration;
    };
    siteInstallation?: {
        configuration?: Auth0SiteInstallationConfiguration;
    };
};

type Auth0TokenResponseData = {
    access_token?: string;
    refresh_token?: string;
    token_type: 'Bearer';
    expires_in: number;
};

type Auth0TokenResponseError = {
    error: string;
    error_description: string;
};

const EXCLUDED_CLAIMS = ['iat', 'exp', 'iss', 'aud', 'jti'];

export type Auth0Action = { action: 'save.config' };

const getDomainWithHttps = (url: string): string => {
    if (url.startsWith('https://')) {
        return url;
    } else if (url.startsWith('http://')) {
        return url.replace('http', 'https');
    } else {
        return `https://${url}`;
    }
};

const configBlock = createComponent<Auth0Props, Auth0State, Auth0Action, Auth0RuntimeContext>({
    componentId: 'config',
    initialState: (props) => {
        const siteInstallation = props.siteInstallation;
        return {
            client_id: siteInstallation?.configuration?.client_id || '',
            issuer_base_url: siteInstallation?.configuration?.issuer_base_url || '',
            client_secret: siteInstallation?.configuration?.client_secret || '',
            include_claims_in_va_token:
                siteInstallation?.configuration?.include_claims_in_va_token || false,
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
                    issuer_base_url: getDomainWithHttps(element.state.issuer_base_url ?? ''),
                    include_claims_in_va_token: element.state.include_claims_in_va_token,
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
            <configuration>
                <box>
                    <markdown content="### Auth0 application" />
                    <vstack>
                        <input
                            label="Auth0 Domain"
                            hint={
                                <text>
                                    The Auth0 domain (also known as tenant).
                                    <link
                                        target={{
                                            url: 'https://auth0.com/docs/get-started/applications/application-settings',
                                        }}
                                    >
                                        {' '}
                                        More Details
                                    </link>
                                </text>
                            }
                            element={<textinput state="issuer_base_url" placeholder="Domain" />}
                        />

                        <input
                            label="Client ID"
                            hint={
                                <text>
                                    The unique identifier of your Auth0 application.
                                    <link
                                        target={{
                                            url: 'https://auth0.com/docs/get-started/applications/application-settings',
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
                            label="Client Secret"
                            hint={
                                <text>
                                    The secret used for signing and validating tokens.
                                    <link
                                        target={{
                                            url: 'https://auth0.com/docs/get-started/applications/application-settings',
                                        }}
                                    >
                                        {' '}
                                        More Details
                                    </link>
                                </text>
                            }
                            element={
                                <textinput state="client_secret" placeholder="Client Secret" />
                            }
                        />

                        <input
                            label="Add Callback URL"
                            hint={
                                <text>
                                    Add this URL to the{' '}
                                    <text style="bold">Allowed Callback URLs</text> section in your
                                    application's settings in Auth0.
                                </text>
                            }
                            element={<codeblock content={VACallbackURL} />}
                        />
                    </vstack>
                    <divider size="medium" />

                    <markdown content="### Visitor authentication settings" />
                    <input
                        label="Include claims in JWT token"
                        hint="Add user & custom claims from Auth0 backend to the JWT token to enrich the user's experience while navigating the site"
                        element={<switch state="include_claims_in_va_token" />}
                    />

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
                </box>
            </configuration>
        );
    },
});

/**
 * Get the published content related urls.
 */
async function getPublishedContentUrls(context: Auth0RuntimeContext) {
    const organizationId = assertOrgId(context.environment);
    const siteInstallation = assertSiteInstallation(context.environment);
    const publishedContentData = await context.api.orgs.getSiteById(
        organizationId,
        siteInstallation.site,
    );

    return publishedContentData.data.urls;
}

function assertOrgId(environment: Auth0RuntimeEnvironment) {
    const orgId = environment.installation?.target?.organization!;
    if (!orgId) {
        throw new Error('No org ID found');
    }

    return orgId;
}
function assertSiteInstallation(environment: Auth0RuntimeEnvironment) {
    const siteInstallation = environment.siteInstallation;
    if (!siteInstallation) {
        throw new Error('No site installation found');
    }

    return siteInstallation;
}

const handleFetchEvent: FetchEventCallback<Auth0RuntimeContext> = async (request, context) => {
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

                const includeClaimsInToken =
                    siteInstallation?.configuration.include_claims_in_va_token;
                const issuerBaseUrl = siteInstallation?.configuration.issuer_base_url;
                const clientId = siteInstallation?.configuration.client_id;
                const clientSecret = siteInstallation?.configuration.client_secret;

                if (!clientId || !clientSecret || !issuerBaseUrl) {
                    return new Response(
                        'Error: Either client id, client secret or issuer base url is missing',
                        {
                            status: 400,
                        },
                    );
                }

                const searchParams = new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: clientId,
                    client_secret: clientSecret,
                    code: `${request.query.code}`,
                    redirect_uri: `${installationURL}/visitor-auth/response`,
                });
                const accessTokenURL = `${issuerBaseUrl}/oauth/token/`;
                const auth0TokenResp = await fetch(accessTokenURL, {
                    method: 'POST',
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    body: searchParams,
                });

                if (!auth0TokenResp.ok) {
                    const errorResponse = await auth0TokenResp.json<Auth0TokenResponseError>();
                    logger.debug(JSON.stringify(errorResponse, null, 2));
                    logger.debug(
                        `Did not receive access token. Error: ${(errorResponse && errorResponse.error) || ''} ${
                            (errorResponse && errorResponse.error_description) || ''
                        }`,
                    );
                    return new Response('Error: Could not fetch token from Auth0', {
                        status: 401,
                    });
                }

                let userInfo;
                if (includeClaimsInToken) {
                    // Auth0 returns an opaque access token (i.e., one that doesn't include user or custom claims) when
                    // exchanging an authorization code for a token—unless an audience (aud parameter) is set to a valid
                    // Auth0 API application during the authorization request.
                    // In this case, since we only request a token to verify authentication and generate the VA,
                    // there is no valid API target to specify as audience.
                    // As a result, we must call the /userinfo endpoint (an OIDC-compliant endpoint) to retrieve user claims.
                    //
                    // An alternative approach would be to request an ID Token using the Implicit Grant flow (with form post).
                    // However, many authentication providers discourage this method in favor of the Authorization Code flow.
                    // Additionally, some customers may disable the Implicit Grant flow in their Auth0 application.
                    // Therefore, retrieving user data via the /userinfo endpoint is a more robust solution.
                    const auth0TokenData = await auth0TokenResp.json<Auth0TokenResponseData>();
                    if (!auth0TokenData.access_token) {
                        return new Response('Error: No Access Token found in response from Auth0', {
                            status: 401,
                        });
                    }

                    const userInfoURL = `${issuerBaseUrl}/userinfo/`;
                    const userInfoResp = await fetch(userInfoURL, {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${auth0TokenData.access_token}` },
                    });

                    if (!userInfoResp.ok) {
                        return new Response('Error: Unable to fetch user info from Auth0', {
                            status: 401,
                        });
                    }

                    userInfo = await userInfoResp.json<Record<string, any>>();
                }

                try {
                    const privateKey = context.environment.signingSecrets.siteInstallation;
                    if (!privateKey) {
                        return new Response('Error: Missing private key from site installation', {
                            status: 400,
                        });
                    }
                    const jwtToken = await jwt.sign(
                        {
                            ...sanitizeJWTTokenClaims(userInfo || {}),
                            exp: Math.floor(Date.now() / 1000) + 1 * (60 * 60),
                        },
                        privateKey,
                    );

                    const publishedContentUrl = publishedContentUrls?.published;
                    if (!publishedContentUrl || !jwtToken) {
                        return new Response(
                            "Error: Either JWT token or site's published URL is missing",
                            {
                                status: 500,
                            },
                        );
                    }

                    const url = new URL(`${publishedContentUrl}${request.query.state || ''}`);
                    url.searchParams.append('jwt_token', jwtToken);

                    return Response.redirect(url.toString());
                } catch (e) {
                    return new Response('Error: Could not sign JWT token', {
                        status: 500,
                    });
                }
            }
        });

        let response;
        try {
            response = await router.handle(request, context);
        } catch (error: any) {
            logger.error('error handling request', error);
            return new Response(error.message, {
                status: error.status || 500,
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

        const issuerBaseUrl = configuration.issuer_base_url;
        const clientId = configuration.client_id;
        const location = event.location ? event.location : '';
        if (!clientId || !issuerBaseUrl) {
            throw new ExposableError('OIDC configuration is missing');
        }

        const url = new URL(`${issuerBaseUrl}/authorize`);
        url.searchParams.append('client_id', clientId);
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('scope', 'openid');
        url.searchParams.append('redirect_uri', `${installationURL}/visitor-auth/response`);
        url.searchParams.append('state', location);

        return Response.redirect(url.toString());
    },
});

function sanitizeJWTTokenClaims(claims: jwt.JwtPayload) {
    const result: Record<string, any> = {};

    Object.entries(claims).forEach(([key, value]) => {
        if (EXCLUDED_CLAIMS.includes(key)) {
            return;
        }
        result[key] = value;
    });
    return result;
}
