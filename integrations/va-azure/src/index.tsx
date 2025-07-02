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

const logger = Logger('azure.visitor-auth');

type AzureRuntimeEnvironment = RuntimeEnvironment<{}, AzureSiteInstallationConfiguration>;

type AzureRuntimeContext = RuntimeContext<AzureRuntimeEnvironment>;

type AzureSiteInstallationConfiguration = {
    client_id?: string;
    tenant_id?: string;
    client_secret?: string;
};

type AzureState = AzureSiteInstallationConfiguration;

type AzureProps = {
    installation: {
        configuration?: IntegrationInstallationConfiguration;
    };
    siteInstallation?: {
        configuration?: AzureSiteInstallationConfiguration;
    };
};

type AzureTokenErrorResponseData = {
    error: string;
    error_description: string;
    error_codes: Array<number>;
    timestamp: string;
    trace_id: string;
    correlation_id: string;
};

type AzureTokenResponseData = {
    access_token?: string;
    id_token?: string;
    refresh_token?: string;
    token_type: 'Bearer';
    expires_in: number;
};

export type AzureAction = { action: 'save.config' };

const configBlock = createComponent<AzureProps, AzureState, AzureAction, AzureRuntimeContext>({
    componentId: 'config',
    initialState: (props) => {
        const siteInstallation = props.siteInstallation;
        return {
            client_id: siteInstallation?.configuration?.client_id || '',
            tenant_id: siteInstallation?.configuration?.tenant_id || '',
            client_secret: siteInstallation?.configuration?.client_secret || '',
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
                    tenant_id: element.state.tenant_id,
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
                            The unique identifier of your app registration.
                            <link
                                target={{
                                    url: 'https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app#register-an-application',
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
                    label="Tenant ID"
                    hint={
                        <text>
                            The Tenant ID of your subscription.
                            <link
                                target={{
                                    url: 'https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app#register-an-application',
                                }}
                            >
                                {' '}
                                More Details
                            </link>
                        </text>
                    }
                    element={<textinput state="tenant_id" placeholder="Tenant ID" />}
                />

                <input
                    label="Client Secret"
                    hint={
                        <text>
                            The secret that the application uses to prove its identity when
                            requesting a token.
                            <link
                                target={{
                                    url: 'https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app#add-a-client-secret',
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
                        The following URL needs to be saved as an allowed Redirect URI in Azure:
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
async function getPublishedContentUrls(context: AzureRuntimeContext) {
    const organizationId = assertOrgId(context.environment);
    const siteInstallation = assertSiteInstallation(context.environment);
    const publishedContentData = await context.api.orgs.getSiteById(
        organizationId,
        siteInstallation.site,
    );

    return publishedContentData.data.urls;
}

function assertSiteInstallation(environment: AzureRuntimeEnvironment) {
    const siteInstallation = environment.siteInstallation;
    if (!siteInstallation) {
        throw new Error('No site installation found');
    }

    return siteInstallation;
}

function assertOrgId(environment: AzureRuntimeEnvironment) {
    const orgId = environment.installation?.target?.organization!;
    if (!orgId) {
        throw new Error('No org ID found');
    }

    return orgId;
}

const handleFetchEvent: FetchEventCallback<AzureRuntimeContext> = async (request, context) => {
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

                const tenantId = siteInstallation?.configuration.tenant_id;
                const clientId = siteInstallation?.configuration.client_id;
                const clientSecret = siteInstallation?.configuration.client_secret;

                if (!clientId || !clientSecret || !tenantId) {
                    return new Response(
                        'Error: Either client id, client secret or tenant id is missing',
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
                const tokenURL = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token/`;
                const azureTokenResp = await fetch(tokenURL, {
                    method: 'POST',
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    body: searchParams,
                });

                if (!azureTokenResp.ok) {
                    if (azureTokenResp.headers.get('content-type')?.includes('application/json')) {
                        const errorResponse =
                            await azureTokenResp.json<AzureTokenErrorResponseData>();
                        logger.debug(JSON.stringify(errorResponse, null, 2));
                        logger.debug(
                            `Did not receive access token. Error: ${
                                (errorResponse && errorResponse.error) || ''
                            } ${(errorResponse && errorResponse.error_description) || ''}`,
                        );
                    }
                    return new Response('Error: Could not fetch token from Azure', {
                        status: 401,
                    });
                }

                const azureTokenData = await azureTokenResp.json<AzureTokenResponseData>();
                if (!azureTokenData.id_token) {
                    return new Response('Error: No ID Token found in response from Azure', {
                        status: 401,
                    });
                }

                // Azure already include user/custom claims in the ID token so we can just decode it
                // TODO: verify token using JWKS and check audience (aud) claims
                const decodedAzureToken = await jwt.decode(azureTokenData.id_token);
                try {
                    const privateKey = context.environment.signingSecrets.siteInstallation;
                    if (!privateKey) {
                        return new Response('Error: Missing private key from site installation', {
                            status: 400,
                        });
                    }
                    const jwtToken = await jwt.sign(
                        {
                            ...(decodedAzureToken.payload ?? {}),
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

        const tenantId = configuration.tenant_id;
        const clientId = configuration.client_id;
        const location = event.location ? event.location : '';
        if (!clientId || !tenantId) {
            throw new ExposableError('Azure configuration is missing');
        }

        const url = new URL(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`);
        url.searchParams.append('client_id', clientId);
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('redirect_uri', `${installationURL}/visitor-auth/response`);
        url.searchParams.append('response_mode', 'query');
        url.searchParams.append('scope', 'openid');
        url.searchParams.append('state', location);

        return Response.redirect(url.toString());
    },
});
