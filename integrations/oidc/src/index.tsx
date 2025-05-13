import { sign } from '@tsndr/cloudflare-worker-jwt';
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
                    scope: element.state.scope,
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
                    label="OAuth Scope"
                    hint={
                        <text>
                            The scope to be granted to the access token. Enter oidc if not sure
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
                    element={<textinput state="scope" placeholder="Scope" />}
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
                const privateKey = context.environment.signingSecrets.siteInstallation!;
                let token;
                try {
                    token = await sign(
                        { exp: Math.floor(Date.now() / 1000) + 1 * (60 * 60) },
                        privateKey,
                    );
                } catch (e) {
                    return new Response('Error: Could not sign JWT token', {
                        status: 500,
                    });
                }

                const accessTokenEndpoint = siteInstallation.configuration.access_token_endpoint;
                const clientId = siteInstallation.configuration.client_id;
                const clientSecret = siteInstallation.configuration.client_secret;
                if (clientId && clientSecret && accessTokenEndpoint) {
                    const searchParams = new URLSearchParams({
                        grant_type: 'authorization_code',
                        client_id: clientId,
                        client_secret: clientSecret,
                        code: `${request.query.code}`,
                        redirect_uri: `${installationURL}/visitor-auth/response`,
                    });

                    const resp: any = await fetch(accessTokenEndpoint, {
                        method: 'POST',
                        headers: { 'content-type': 'application/x-www-form-urlencoded' },
                        body: searchParams,
                    })
                        .then((response) => response.json())
                        .catch((err) => {
                            return new Response(
                                'Error: Could not fetch access token from your authentication provider',
                                {
                                    status: 401,
                                },
                            );
                        });

                    if ('access_token' in resp) {
                        let url;
                        const state = request.query.state!.toString();
                        const location = state.substring(state.indexOf('-') + 1);
                        if (location) {
                            url = new URL(`${publishedContentUrls?.published}${location}`);
                            url.searchParams.append('jwt_token', token);
                        } else {
                            url = new URL(publishedContentUrls?.published!);
                            url.searchParams.append('jwt_token', token);
                        }
                        if (publishedContentUrls?.published && token) {
                            return Response.redirect(url.toString());
                        } else {
                            return new Response(
                                "Error: Either JWT token or space's published URL is missing",
                                {
                                    status: 500,
                                },
                            );
                        }
                    } else {
                        logger.debug(JSON.stringify(resp, null, 2));
                        logger.debug(
                            `Did not receive access token. Error: ${(resp && resp.error) || ''} ${
                                (resp && resp.error_description) || ''
                            }`,
                        );
                        return new Response(
                            'Error: No Access Token found in response from your OIDC provider',
                            {
                                status: 401,
                            },
                        );
                    }
                } else {
                    return new Response(
                        'Error: Either ClientId or Client Secret or Access Token Endpoint is missing',
                        {
                            status: 400,
                        },
                    );
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
