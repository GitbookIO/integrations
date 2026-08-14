import * as jwt from '@tsndr/cloudflare-worker-jwt';
import { Router } from 'itty-router';

import {
    FetchVisitorAuthenticationEvent,
    IntegrationInstallationConfiguration,
} from '@gitbook/api';
import {
    createIntegration,
    FetchEventCallback,
    Logger,
    RuntimeContext,
    RuntimeEnvironment,
    createComponent,
    ExposableError,
} from '@gitbook/runtime';

const logger = Logger('cognito.visitor-auth');

type CognitoRuntimeEnvironment = RuntimeEnvironment<{}, CognitoSiteInstallationConfiguration>;

type CognitoRuntimeContext = RuntimeContext<CognitoRuntimeEnvironment>;

type CognitoSiteInstallationConfiguration = {
    client_id?: string;
    cognito_domain?: string;
    client_secret?: string;
    logout_url?: string;
    redirect_to_site_on_logout?: boolean;
};

type CognitoState = CognitoSiteInstallationConfiguration;

type CognitoProps = {
    installation: {
        configuration?: IntegrationInstallationConfiguration;
    };
    siteInstallation: {
        configuration?: CognitoSiteInstallationConfiguration;
    };
};

type CognitoTokenErrorResponseData = {
    error: string;
    error_description: string;
};

type CognitoTokenResponseData = {
    access_token?: string;
    id_token?: string;
    refresh_token?: string;
    token_type: 'Bearer';
    expires_in: number;
};

export type CognitoAction = { action: 'save.config' };

const getDomainWithHttps = (url: string): string => {
    if (url.startsWith('https://')) {
        return url;
    } else if (url.startsWith('http://')) {
        return url.replace('http', 'https');
    } else {
        return `https://${url}`;
    }
};

const configBlock = createComponent<
    CognitoProps,
    CognitoState,
    CognitoAction,
    CognitoRuntimeContext
>({
    componentId: 'config',
    initialState: (props) => {
        const siteInstallation = props.siteInstallation;
        return {
            client_id: siteInstallation.configuration?.client_id?.toString() || '',
            cognito_domain: siteInstallation.configuration?.cognito_domain?.toString() || '',
            client_secret: siteInstallation.configuration?.client_secret?.toString() || '',
            logout_url: siteInstallation.configuration?.logout_url?.toString() || '',
            redirect_to_site_on_logout:
                siteInstallation.configuration?.redirect_to_site_on_logout || false,
        };
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'save.config':
                const { api, environment } = context;
                const siteOrSpaceInstallation = assertInstallation(environment);

                const configurationBody = {
                    ...siteOrSpaceInstallation.configuration,
                    client_id: element.state.client_id,
                    client_secret: element.state.client_secret,
                    cognito_domain: getDomainWithHttps(element.state.cognito_domain ?? ''),
                    logout_url: element.state.logout_url
                        ? getDomainWithHttps(element.state.logout_url)
                        : undefined,
                    redirect_to_site_on_logout: element.state.redirect_to_site_on_logout,
                };
                await api.integrations.updateIntegrationSiteInstallation(
                    siteOrSpaceInstallation.integration,
                    siteOrSpaceInstallation.installation,
                    siteOrSpaceInstallation.site,
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
        const siteOrSpaceInstallation =
            context.environment.siteInstallation ?? context.environment.spaceInstallation;
        const VACallbackURL = `${siteOrSpaceInstallation?.urls?.publicEndpoint}/visitor-auth/response`;
        return (
            <block>
                <input
                    label="Client ID"
                    hint={
                        <text>
                            The unique identifier of your Cognito app client.
                            <link
                                target={{
                                    url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-client-apps.html#cognito-user-pools-app-idp-settings-console-create',
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
                    label="Cognito Domain"
                    hint={
                        <text>
                            The Cognito User Pool domain.
                            <link
                                target={{
                                    url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-assign-domain.html',
                                }}
                            >
                                {' '}
                                More Details
                            </link>
                        </text>
                    }
                    element={<textinput state="cognito_domain" placeholder="Domain" />}
                />

                <input
                    label="Client Secret"
                    hint={
                        <text>
                            The secret used for signing and validating tokens.
                            <link
                                target={{
                                    url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-client-apps.html#cognito-user-pools-app-idp-settings-console-create',
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
                    label="Logout URL"
                    hint={
                        <text>
                            The Cognito sign-out endpoint visitors are sent to when they log out of
                            the site. Leave empty to only end their GitBook session. Note that this
                            endpoint does not sign visitors out of an external identity provider
                            federated into your user pool.
                            <link
                                target={{
                                    url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/logout-endpoint.html',
                                }}
                            >
                                {' '}
                                More Details
                            </link>
                        </text>
                    }
                    element={
                        <textinput
                            state="logout_url"
                            placeholder={`${element.state.cognito_domain || 'https://your-domain.auth.region.amazoncognito.com'}/logout`}
                        />
                    }
                />

                <input
                    label="Return to the site after logout"
                    hint={
                        <text>
                            Return visitors to your site once they are logged out. Requires your
                            site's URL in the <text style="bold">Allowed sign-out URLs</text> of
                            your app client. When disabled, visitors land on Cognito's hosted
                            sign-in page.
                        </text>
                    }
                    element={<switch state="redirect_to_site_on_logout" />}
                />
                <divider size="medium" />
                <hint>
                    <text style="bold">
                        The following URL needs to be saved as an allowed callback URL in Cognito:
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
 * Get the published content (site or space) related urls.
 */
async function getPublishedContentUrls(context: CognitoRuntimeContext) {
    const organizationId = context.environment.installation?.target?.organization!;
    const siteInstallation = assertInstallation(context.environment);
    const publishedContentData = await context.api.orgs.getSiteById(
        organizationId,
        siteInstallation.site,
    );

    return publishedContentData.data.urls;
}

function assertInstallation(environment: RuntimeEnvironment) {
    const siteInstallation = environment.siteInstallation;
    if (!siteInstallation) {
        throw new Error('No site installation found');
    }

    return siteInstallation;
}

/**
 * Log the visitor out of Cognito when a logout URL is configured, and otherwise send them
 * straight back to the site.
 */
async function handleLogout(
    context: CognitoRuntimeContext,
    siteInstallation: ReturnType<typeof assertInstallation>,
): Promise<Response> {
    const installationURL = siteInstallation.urls.publicEndpoint;
    const configuration = siteInstallation.configuration as CognitoSiteInstallationConfiguration;
    const publishedContentUrls = await getPublishedContentUrls(context);
    const siteURL = publishedContentUrls?.published;
    const logoutURL = configuration.logout_url;
    const clientId = configuration.client_id;

    if (logoutURL && clientId) {
        try {
            const url = new URL(logoutURL);
            // Cognito only honours the sign-out request when the app client is identified.
            url.searchParams.set('client_id', clientId);

            // `logout_uri` has to be an Allowed sign-out URL of the app client, so it is
            // only sent when the site admin opted in.
            if (configuration.redirect_to_site_on_logout && siteURL) {
                url.searchParams.set('logout_uri', siteURL);
            } else {
                // Cognito rejects a sign-out request that carries neither a `logout_uri`
                // nor a `redirect_uri`, so fall back to sending the visitor to its hosted
                // sign-in page. The visitor authentication callback is already an allowed
                // callback URL of the app client, so this needs no extra configuration.
                url.searchParams.set('response_type', 'code');
                url.searchParams.set('redirect_uri', `${installationURL}/visitor-auth/response`);
            }

            logger.info('redirecting the visitor to the configured Cognito logout endpoint');
            return Response.redirect(url.toString());
        } catch (error) {
            logger.error(`invalid Cognito logout URL configured: ${logoutURL}`, error);
        }
    }

    // Nothing to log out of upstream: send the visitor to the site root.
    logger.info('redirecting the visitor to the site without logging them out of Cognito');
    return Response.redirect(siteURL ?? installationURL);
}

const handleFetchEvent: FetchEventCallback<CognitoRuntimeContext> = async (request, context) => {
    const { environment } = context;
    const siteOrSpaceInstallation = environment.siteInstallation ?? environment.spaceInstallation;
    const installationURL = siteOrSpaceInstallation?.urls?.publicEndpoint;
    if (installationURL) {
        const router = Router({
            base: new URL(installationURL).pathname,
        });

        router.get('/visitor-auth/response', async (request) => {
            if (
                ('site' in siteOrSpaceInstallation && siteOrSpaceInstallation.site) ||
                ('space' in siteOrSpaceInstallation && siteOrSpaceInstallation.space)
            ) {
                const publishedContentUrls = await getPublishedContentUrls(context);

                const cognitoDomain = siteOrSpaceInstallation.configuration.cognito_domain;
                const clientId = siteOrSpaceInstallation.configuration.client_id;
                const clientSecret = siteOrSpaceInstallation.configuration.client_secret;

                if (!clientId || !clientSecret || !clientId) {
                    return new Response(
                        'Error: Either client id, client secret or cognito domain is missing',
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
                const tokenRequestURL = `${cognitoDomain}/oauth2/token/`;
                const cognitoTokenResp = await fetch(tokenRequestURL, {
                    method: 'POST',
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    body: searchParams,
                });

                if (!cognitoTokenResp.ok) {
                    if (
                        cognitoTokenResp.headers.get('content-type')?.includes('application/json')
                    ) {
                        const errorResponse =
                            await cognitoTokenResp.json<CognitoTokenErrorResponseData>();
                        logger.debug(JSON.stringify(errorResponse, null, 2));
                        logger.debug(
                            `Did not receive access token. Error: ${
                                (errorResponse && errorResponse.error) || ''
                            } ${(errorResponse && errorResponse.error_description) || ''}`,
                        );
                    }
                    return new Response('Error: Could not fetch token from Cognito', {
                        status: 401,
                    });
                }

                const cognitoTokenData = await cognitoTokenResp.json<CognitoTokenResponseData>();
                if (!cognitoTokenData.access_token) {
                    return new Response('Error: No access token found in response from Cognito', {
                        status: 401,
                    });
                }

                // Cognito already include user/custom claims in the access token so we can just decode it
                // TODO: verify token using JWKS and check audience (aud) claims
                const decodedCognitoToken = await jwt.decode(cognitoTokenData.access_token);
                try {
                    const privateKey = context.environment.signingSecrets.siteInstallation;
                    if (!privateKey) {
                        return new Response('Error: Missing private key from site installation', {
                            status: 400,
                        });
                    }
                    const minimumExp = Math.floor(Date.now() / 1000) + 60 * 60;
                    const upstreamTokenExp =
                        typeof decodedCognitoToken?.payload?.exp === 'number'
                            ? decodedCognitoToken.payload.exp
                            : undefined;
                    const jwtToken = await jwt.sign(
                        {
                            ...(decodedCognitoToken.payload ?? {}),
                            exp: Math.max(minimumExp, upstreamTokenExp ?? 0),
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
    fetch_visitor_authentication: async (
        event: FetchVisitorAuthenticationEvent,
        context: CognitoRuntimeContext,
    ) => {
        const { environment } = context;
        const siteInstallation = assertInstallation(environment);

        if (event.action === 'logout') {
            return handleLogout(context, siteInstallation);
        }

        const installationURL = siteInstallation.urls.publicEndpoint;

        const configuration =
            siteInstallation.configuration as CognitoSiteInstallationConfiguration;
        const cognitoDomain = configuration.cognito_domain;
        const clientId = configuration.client_id;

        if (!clientId || !cognitoDomain) {
            throw new ExposableError('Cognito configuration is missing');
        }

        const location = event.location ? event.location : '';

        const url = new URL(`${cognitoDomain}/oauth2/authorize`);
        url.searchParams.append('client_id', clientId);
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('redirect_uri', `${installationURL}/visitor-auth/response`);
        url.searchParams.append('state', location);

        return Response.redirect(url.toString());
    },
});
