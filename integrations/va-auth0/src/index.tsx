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

const logger = Logger('auth0.visitor-auth');

type Auth0RuntimeEnvironment = RuntimeEnvironment<{}, Auth0SiteInstallationConfiguration>;

type Auth0RuntimeContext = RuntimeContext<Auth0RuntimeEnvironment>;

type Auth0SiteInstallationConfiguration = {
    client_id?: string;
    issuer_base_url?: string;
    client_secret?: string;
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
            client_id: siteInstallation?.configuration?.client_id?.toString() || '',
            issuer_base_url: siteInstallation?.configuration?.issuer_base_url?.toString() || '',
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
                    issuer_base_url: getDomainWithHttps(element.state.issuer_base_url ?? ''),
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
                    element={<textinput state="client_secret" placeholder="Client Secret" />}
                />
                <divider size="medium" />
                <hint>
                    <text style="bold">
                        The following URL needs to be saved as an allowed callback URL in Auth0:
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
async function getPublishedContentUrls(context: Auth0RuntimeContext) {
    const organizationId = context.environment.installation?.target?.organization!;
    const siteInstallation = assertSiteInstallation(context.environment);
    const publishedContentData = await context.api.orgs.getSiteById(
        organizationId,
        siteInstallation.site,
    );

    return publishedContentData.data.urls;
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

                const issuerBaseUrl = siteInstallation?.configuration.issuer_base_url;
                const clientId = siteInstallation?.configuration.client_id;
                const clientSecret = siteInstallation?.configuration.client_secret;
                if (clientId && clientSecret) {
                    const searchParams = new URLSearchParams({
                        grant_type: 'authorization_code',
                        client_id: clientId,
                        client_secret: clientSecret,
                        code: `${request.query.code}`,
                        redirect_uri: `${installationURL}/visitor-auth/response`,
                    });
                    const accessTokenURL = `${issuerBaseUrl}/oauth/token/`;
                    const resp: any = await fetch(accessTokenURL, {
                        method: 'POST',
                        headers: { 'content-type': 'application/x-www-form-urlencoded' },
                        body: searchParams,
                    })
                        .then((response) => response.json())
                        .catch((err) => {
                            return new Response('Error: Could not fetch access token from Auth0', {
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
                        return new Response('Error: No Access Token found in response from Auth0', {
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

        const issuerBaseUrl = configuration.issuer_base_url;
        const clientId = configuration.client_id;
        const location = event.location ? event.location : '';
        if (!clientId || !issuerBaseUrl) {
            throw new ExposableError('OIDC configuration is missing');
        }

        const url = new URL(`${issuerBaseUrl}/authorize`);
        url.searchParams.append('client_id', clientId);
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('redirect_uri', `${installationURL}/visitor-auth/response`);
        url.searchParams.append('state', location);

        return Response.redirect(url.toString());
    },
});
