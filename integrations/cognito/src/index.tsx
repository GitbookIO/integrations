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
                    const jwtToken = await jwt.sign(
                        {
                            ...(decodedCognitoToken.payload ?? {}),
                            exp: Math.floor(Date.now() / 1000) + 24 * (60 * 60),
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
