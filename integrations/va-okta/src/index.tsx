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

const logger = Logger('okta.authenticated-access');

type OktaRuntimeEnvironment = RuntimeEnvironment<{}, OktaSiteInstallationConfiguration>;

type OktaRuntimeContext = RuntimeContext<OktaRuntimeEnvironment>;

type OktaSiteInstallationBaseConfiguration = {
    client_id?: string;
    okta_domain?: string;
    client_secret?: string;
};

type OktaSiteInstallationConfiguration = OktaSiteInstallationBaseConfiguration & {
    okta_custom_auth_server?: OktaCustomAuthServerConfiguration;
};

type OktaCustomAuthServerConfiguration = { id: string } & Pick<
    OktaCustomAuthServerDiscoveryData,
    'authorization_endpoint' | 'token_endpoint'
>;

type OktaState = OktaSiteInstallationBaseConfiguration & {
    include_claims: boolean;
    okta_custom_auth_server_id?: string;
};

type OktaProps = {
    installation: {
        configuration?: IntegrationInstallationConfiguration;
    };
    siteInstallation?: {
        configuration?: OktaSiteInstallationConfiguration;
    };
};

type OktaTokenResponseData = {
    access_token?: string;
    refresh_token?: string;
    token_type: 'Bearer';
    expires_in: number;
};

type OktaTokenResponseError = {
    error: string;
    error_description: string;
};

type OktaCustomAuthServerDiscoveryData = {
    issuer: string;
    authorization_endpoint: string;
    token_endpoint: string;
    userinfo_endpoint: string;
    registration_endpoint: string;
    jwks_uri: string;
};

export type OktaAction =
    | { action: 'save.config' }
    | {
          action: 'toggle.include_claims';
          includeClaimsInVAToken: boolean;
      };

const configBlock = createComponent<OktaProps, OktaState, OktaAction, OktaRuntimeContext>({
    componentId: 'config',
    initialState: (props) => {
        const siteInstallation = props.siteInstallation;
        return {
            client_id: siteInstallation?.configuration?.client_id || '',
            okta_domain: siteInstallation?.configuration?.okta_domain || '',
            client_secret: siteInstallation?.configuration?.client_secret || '',
            include_claims: !!siteInstallation?.configuration?.okta_custom_auth_server?.id || false,
            okta_custom_auth_server_id:
                siteInstallation?.configuration?.okta_custom_auth_server?.id || '',
        };
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'toggle.include_claims':
                return {
                    ...element,
                    state: {
                        ...element.state,
                        include_claims: action.includeClaimsInVAToken,
                    },
                };
            case 'save.config':
                const { api, environment } = context;
                const siteInstallation = assertSiteInstallation(environment);

                let oktaCustomServerInfo: OktaCustomAuthServerConfiguration | undefined;

                // When using a custom auth server fetch the OAuth endpoints from the discovery URL.
                if (element.state.include_claims && element.state.okta_custom_auth_server_id) {
                    const customAuthServerDiscoveryURL = new URL(
                        `oauth2/${element.state.okta_custom_auth_server_id}/.well-known/openid-configuration`,
                        `https://${element.state.okta_domain}/`,
                    );
                    const discoveryResp = await fetch(customAuthServerDiscoveryURL, {
                        method: 'GET',
                    });

                    if (!discoveryResp.ok) {
                        throw new ExposableError(
                            'Error: The Okta custom auth server ID provided is invalid',
                        );
                    }
                    const { authorization_endpoint, token_endpoint } =
                        await discoveryResp.json<OktaCustomAuthServerDiscoveryData>();

                    oktaCustomServerInfo = {
                        id: element.state.okta_custom_auth_server_id,
                        authorization_endpoint,
                        token_endpoint,
                    };
                }

                const configurationBody: OktaSiteInstallationConfiguration = {
                    ...siteInstallation.configuration,
                    client_id: element.state.client_id,
                    client_secret: element.state.client_secret,
                    okta_domain: element.state.okta_domain,
                    okta_custom_auth_server: element.state.include_claims
                        ? oktaCustomServerInfo
                        : undefined,
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
        const VACallbackURL = `${siteInstallation?.urls?.publicEndpoint}/authenticated-access/response`;
        return (
            <configuration>
                <box>
                    <markdown content="### Okta application" />
                    <vstack>
                        <input
                            label="Okta Domain"
                            hint={
                                <text>
                                    The Domain of your Okta instance.
                                    <link
                                        target={{
                                            url: 'https://developer.okta.com/docs/guides/find-your-domain/main/',
                                        }}
                                    >
                                        {' '}
                                        More Details
                                    </link>
                                </text>
                            }
                            element={<textinput state="okta_domain" placeholder="Okta Domain" />}
                        />

                        <input
                            label="Client ID"
                            hint={
                                <text>
                                    The Client ID of your Okta application.
                                    <link
                                        target={{
                                            url: 'https://developer.okta.com/docs/guides/find-your-app-credentials/main/#find-your-app-integration-credentials',
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
                                    The Client Secret of your Okta application.
                                    <link
                                        target={{
                                            url: 'https://developer.okta.com/docs/guides/find-your-app-credentials/main/#find-your-app-integration-credentials',
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
                            label="Add Sign-In Redirect URI"
                            hint={
                                <text>
                                    Add this URL to the{' '}
                                    <text style="bold">Sign-In Redirect URIs</text> section in your
                                    application's settings in Okta.
                                </text>
                            }
                            element={<codeblock content={VACallbackURL} />}
                        />
                    </vstack>

                    <divider size="medium" />

                    <markdown content="### Authenticated access settings" />
                    <input
                        label="Include claims in JWT token"
                        hint="Enhance the user's site navigation experience based on user information and attributes provided by your Okta authorization backend."
                        element={
                            <switch
                                state="include_claims"
                                onValueChange={{
                                    action: 'toggle.include_claims',
                                    includeClaimsInVAToken: element.dynamicState('include_claims'),
                                }}
                            />
                        }
                    />
                    {element.state.include_claims ? (
                        <input
                            label="Okta Authorization server ID"
                            hint="The ID of the custom authorization server in your Okta organization used to include additional claims in the users tokens."
                            element={
                                <textinput
                                    state="okta_custom_auth_server_id"
                                    placeholder="default"
                                />
                            }
                        />
                    ) : null}

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
 * Get the published content (site or space) related urls.
 */
async function getPublishedContentUrls(context: OktaRuntimeContext) {
    const organizationId = assertOrgId(context.environment);
    const siteInstallation = assertSiteInstallation(context.environment);
    const publishedContentData = await context.api.orgs.getSiteById(
        organizationId,
        siteInstallation.site,
    );

    return publishedContentData.data.urls;
}

function assertSiteInstallation(environment: OktaRuntimeEnvironment) {
    const siteInstallation = environment.siteInstallation;
    if (!siteInstallation) {
        throw new Error('No site installation found');
    }

    return siteInstallation;
}

function assertOrgId(environment: OktaRuntimeEnvironment) {
    const orgId = environment.installation?.target?.organization!;
    if (!orgId) {
        throw new Error('No org ID found');
    }

    return orgId;
}

const handleFetchEvent: FetchEventCallback<OktaRuntimeContext> = async (request, context) => {
    const { environment } = context;
    const siteInstallation = assertSiteInstallation(environment);
    const installationURL = siteInstallation.urls?.publicEndpoint;
    if (installationURL) {
        const router = Router({
            base: new URL(installationURL).pathname,
        });

        router.get('/authenticated-access/response', async (request) => {
            if ('site' in siteInstallation && siteInstallation.site) {
                const publishedContentUrls = await getPublishedContentUrls(context);

                const oktaDomain = siteInstallation.configuration.okta_domain;
                const clientId = siteInstallation.configuration.client_id;
                const clientSecret = siteInstallation.configuration.client_secret;
                const oktaCustomAuthServerConfig =
                    siteInstallation.configuration.okta_custom_auth_server;
                const includeClaimsInVAToken = oktaCustomAuthServerConfig?.id;

                if (!clientId || !clientSecret || !oktaDomain) {
                    return new Response(
                        'Error: Either client id, client secret or okta domain is missing',
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
                    redirect_uri: `${installationURL}/authenticated-access/response`,
                });
                const accessTokenURL =
                    includeClaimsInVAToken && oktaCustomAuthServerConfig
                        ? oktaCustomAuthServerConfig.token_endpoint
                        : `https://${oktaDomain}/oauth2/v1/token/`;
                const oktaTokenResp = await fetch(accessTokenURL, {
                    method: 'POST',
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    body: searchParams,
                });

                if (!oktaTokenResp.ok) {
                    const errorResponse = await oktaTokenResp.json<OktaTokenResponseError>();
                    logger.debug(JSON.stringify(errorResponse, null, 2));
                    logger.debug(
                        `Did not receive access token. Error: ${
                            (errorResponse && errorResponse.error) || ''
                        } ${(errorResponse && errorResponse.error_description) || ''}`,
                    );
                    return new Response('Error: Could not fetch token from Okta', {
                        status: 401,
                    });
                }

                const oktaTokenData = await oktaTokenResp.json<OktaTokenResponseData>();
                if (!oktaTokenData.access_token) {
                    return new Response('Error: No Access Token found in response from Okta', {
                        status: 401,
                    });
                }

                // Okta already include user/custom claims in the access token so we can just decode it
                // TODO: verify token using JWKS and check audience (aud) claims
                const decodedOktaToken = await jwt.decode(oktaTokenData.access_token);
                try {
                    const privateKey = context.environment.signingSecrets.siteInstallation;
                    if (!privateKey) {
                        return new Response('Error: Missing private key from site installation', {
                            status: 400,
                        });
                    }
                    const jwtToken = await jwt.sign(
                        {
                            ...(decodedOktaToken.payload ?? {}),
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

                    const state = request.query.state?.toString();
                    const location = state ? state.substring(state.indexOf('-') + 1) : '';
                    const url = new URL(`${publishedContentUrl}${location || ''}`);
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

        const oktaDomain = configuration.okta_domain;
        const clientId = configuration.client_id;
        const location = event.location ? event.location : '';

        if (!clientId || !oktaDomain) {
            throw new ExposableError('OIDC configuration is missing');
        }

        const oktaCustomAuthServerConfig = siteInstallation.configuration.okta_custom_auth_server;
        const includeClaimsInVAToken = !!oktaCustomAuthServerConfig?.id;

        const url = new URL(
            includeClaimsInVAToken && oktaCustomAuthServerConfig
                ? oktaCustomAuthServerConfig.authorization_endpoint
                : `https://${oktaDomain}/oauth2/v1/authorize`,
        );
        url.searchParams.append('client_id', clientId);
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('redirect_uri', `${installationURL}/authenticated-access/response`);
        url.searchParams.append('response_mode', 'query');
        url.searchParams.append('scope', 'openid');
        url.searchParams.append('state', `state-${location}`);

        return Response.redirect(url.toString());
    },
});
