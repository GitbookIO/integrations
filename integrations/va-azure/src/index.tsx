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

export type AzureAction = { action: 'save.config' };

const configBlock = createComponent<AzureProps, AzureState, AzureAction, AzureRuntimeContext>({
    componentId: 'config',
    initialState: (props) => {
        const siteInstallation = props.siteInstallation;
        return {
            client_id: siteInstallation?.configuration?.client_id?.toString() || '',
            tenant_id: siteInstallation?.configuration?.tenant_id?.toString() || '',
            client_secret: siteInstallation?.configuration?.client_secret?.toString() || '',
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
                return element;
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
    const organizationId = context.environment.installation?.target?.organization!;
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

                const tenantId = siteInstallation?.configuration.tenant_id;
                const clientId = siteInstallation?.configuration.client_id;
                const clientSecret = siteInstallation?.configuration.client_secret;
                if (clientId && clientSecret) {
                    const searchParams = new URLSearchParams({
                        grant_type: 'authorization_code',
                        client_id: clientId,
                        client_secret: clientSecret,
                        code: `${request.query.code}`,
                        scope: 'openid',
                        redirect_uri: `${installationURL}/visitor-auth/response`,
                    });
                    const accessTokenURL = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token/`;
                    const resp: any = await fetch(accessTokenURL, {
                        method: 'POST',
                        headers: { 'content-type': 'application/x-www-form-urlencoded' },
                        body: searchParams,
                    })
                        .then((response) => response.json())
                        .catch((err) => {
                            return new Response('Error: Could not fetch access token from Azure', {
                                status: 401,
                            });
                        });

                    if ('access_token' in resp) {
                        let url;
                        if (request.query.state) {
                            url = new URL(
                                `${publishedContentUrls?.published}${request.query.state}`,
                            );
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
                        return new Response('Error: No Access Token found in response from Azure', {
                            status: 401,
                        });
                    }
                } else {
                    return new Response('Error: Either ClientId or Client Secret is missing', {
                        status: 400,
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
