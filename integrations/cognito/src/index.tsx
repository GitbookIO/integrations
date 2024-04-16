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
} from '@gitbook/runtime';

const logger = Logger('cognito.visitor-auth');

type CognitoRuntimeEnvironment = RuntimeEnvironment<
    {},
    CognitoSiteOrSpaceInstallationConfiguration
>;

type CognitoRuntimeContext = RuntimeContext<CognitoRuntimeEnvironment>;

type CognitoSiteOrSpaceInstallationConfiguration = {
    client_id?: string;
    cognito_domain?: string;
    client_secret?: string;
};

type CognitoState = CognitoSiteOrSpaceInstallationConfiguration;

type CognitoProps = {
    installation: {
        configuration?: IntegrationInstallationConfiguration;
    };
    spaceInstallation: {
        configuration?: CognitoSiteOrSpaceInstallationConfiguration;
    };
    siteInstallation: {
        configuration?: CognitoSiteOrSpaceInstallationConfiguration;
    };
};

export type CognitoAction = { action: 'save.config' };

const getDomainWithHttps = (url: string): string => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
        return url;
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
        const siteOrSpaceInstallation = props.siteInstallation ?? props.spaceInstallation;
        return {
            client_id: siteOrSpaceInstallation.configuration?.client_id?.toString() || '',
            cognito_domain: siteOrSpaceInstallation.configuration?.cognito_domain?.toString() || '',
            client_secret: siteOrSpaceInstallation.configuration?.client_secret?.toString() || '',
        };
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'save.config':
                const { api, environment } = context;
                const siteOrSpaceInstallation =
                    environment.siteInstallation ?? environment.spaceInstallation;

                const configurationBody = {
                    ...siteOrSpaceInstallation.configuration,
                    client_id: element.state.client_id,
                    client_secret: element.state.client_secret,
                    cognito_domain: getDomainWithHttps(element.state.cognito_domain),
                };
                if ('site' in siteOrSpaceInstallation) {
                    await api.integrations.updateIntegrationSiteInstallation(
                        siteOrSpaceInstallation.integration,
                        siteOrSpaceInstallation.installation,
                        siteOrSpaceInstallation.site,
                        {
                            configuration: {
                                ...configurationBody,
                            },
                        }
                    );
                } else {
                    await api.integrations.updateIntegrationSpaceInstallation(
                        siteOrSpaceInstallation.integration,
                        siteOrSpaceInstallation.installation,
                        siteOrSpaceInstallation.space,
                        {
                            configuration: {
                                ...configurationBody,
                            },
                        }
                    );
                }
                return element;
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
    const organizationId = context.environment.installation?.target?.organization;
    const siteOrSpaceInstallation =
        context.environment.siteInstallation ?? context.environment.spaceInstallation;
    const publishedContentData =
        'site' in siteOrSpaceInstallation
            ? await context.api.orgs.getSiteById(organizationId, siteOrSpaceInstallation.site)
            : await context.api.spaces.getSpaceById(siteOrSpaceInstallation.space);

    return publishedContentData.data.urls;
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
                const privateKey =
                    context.environment.signingSecrets.siteInstallation ??
                    context.environment.signingSecrets.spaceInstallation;
                let token;
                try {
                    token = await sign(
                        { exp: Math.floor(Date.now() / 1000) + 1 * (60 * 60) },
                        privateKey
                    );
                } catch (e) {
                    return new Response('Error: Could not sign JWT token', {
                        status: 500,
                    });
                }

                const cognitoDomain = siteOrSpaceInstallation.configuration.cognito_domain;
                const clientId = siteOrSpaceInstallation.configuration.client_id;
                const clientSecret = siteOrSpaceInstallation.configuration.client_secret;
                if (clientId && clientSecret) {
                    const searchParams = new URLSearchParams({
                        grant_type: 'authorization_code',
                        client_id: clientId,
                        client_secret: clientSecret,
                        code: `${request.query.code}`,
                        redirect_uri: `${installationURL}/visitor-auth/response`,
                    });
                    const accessTokenURL = `${cognitoDomain}/oauth2/token/`;
                    const resp: any = await fetch(accessTokenURL, {
                        method: 'POST',
                        headers: { 'content-type': 'application/x-www-form-urlencoded' },
                        body: searchParams,
                    })
                        .then((response) => response.json())
                        .catch((err) => {
                            return new Response(
                                'Error: Could not fetch access token from Cognito',
                                {
                                    status: 401,
                                }
                            );
                        });

                    if ('access_token' in resp) {
                        let url;
                        if (request.query.state) {
                            url = new URL(
                                `${publishedContentUrls?.published}${request.query.state}`
                            );
                            url.searchParams.append('jwt_token', token);
                        } else {
                            url = new URL(publishedContentUrls?.published);
                            url.searchParams.append('jwt_token', token);
                        }
                        if (publishedContentUrls?.published && token) {
                            return Response.redirect(url.toString());
                        } else {
                            return new Response(
                                "Error: Either JWT token or space's published URL is missing",
                                {
                                    status: 500,
                                }
                            );
                        }
                    } else {
                        logger.debug(JSON.stringify(resp, null, 2));
                        logger.debug(
                            `Did not receive access token. Error: ${(resp && resp.error) || ''} ${
                                (resp && resp.error_description) || ''
                            }`
                        );
                        return new Response(
                            'Error: No Access Token found in response from Cognito',
                            {
                                status: 401,
                            }
                        );
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
        const siteOrSpaceInstallation =
            environment.siteInstallation ?? environment.spaceInstallation;

        const installationURL = siteOrSpaceInstallation?.urls?.publicEndpoint;

        const cognitoDomain = siteOrSpaceInstallation?.configuration.cognito_domain;
        const clientId = siteOrSpaceInstallation?.configuration.client_id;

        const location = event.location ? event.location : '';

        const url = new URL(`${cognitoDomain}/oauth2/authorize`);
        url.searchParams.append('client_id', clientId);
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('redirect_uri', `${installationURL}/visitor-auth/response`);
        url.searchParams.append('state', location);

        try {
            return Response.redirect(url.toString());
        } catch (e) {
            return new Response(e.message, {
                status: e.status || 500,
            });
        }
    },
});
