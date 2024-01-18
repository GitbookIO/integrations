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

const logger = Logger('okta.visitor-auth');

type OktaRuntimeEnvironment = RuntimeEnvironment<{}, OktaSpaceInstallationConfiguration>;

type OktaRuntimeContext = RuntimeContext<OktaRuntimeEnvironment>;

type OktaSpaceInstallationConfiguration = {
    client_id?: string;
    okta_domain?: string;
    client_secret?: string;
};

type OktaState = OktaSpaceInstallationConfiguration;

type OktaProps = {
    installation: {
        configuration?: IntegrationInstallationConfiguration;
    };
    spaceInstallation: {
        configuration?: OktaSpaceInstallationConfiguration;
    };
};

export type OktaAction = { action: 'save.config' };

const configBlock = createComponent<OktaProps, OktaState, OktaAction, OktaRuntimeContext>({
    componentId: 'config',
    initialState: (props) => {
        return {
            client_id: props.spaceInstallation.configuration?.client_id?.toString() || '',
            okta_domain: props.spaceInstallation.configuration?.okta_domain?.toString() || '',
            client_secret: props.spaceInstallation.configuration?.client_secret?.toString() || '',
        };
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'save.config':
                const { api, environment } = context;
                const spaceInstallation = environment.spaceInstallation;

                const configurationBody = {
                    ...spaceInstallation.configuration,
                    client_id: element.state.client_id,
                    client_secret: element.state.client_secret,
                    okta_domain: element.state.okta_domain,
                };
                await api.integrations.updateIntegrationSpaceInstallation(
                    spaceInstallation.integration,
                    spaceInstallation.installation,
                    spaceInstallation.space,
                    {
                        configuration: {
                            ...configurationBody,
                        },
                    }
                );
                return element;
        }
    },
    render: async (element, context) => {
        const VACallbackURL = `${context.environment.spaceInstallation?.urls?.publicEndpoint}/visitor-auth/response`;
        return (
            <block>
                <input
                    label="Enter Client ID"
                    hint="Enter Client ID of your Okta application"
                    element={<textinput state="client_id" placeholder="Client ID" />}
                />

                <input
                    label="Enter Okta Domain"
                    hint="Enter your Okta Domain"
                    element={<textinput state="okta_domain" placeholder="Okta Domain" />}
                />

                <input
                    label="Enter Client Secret"
                    hint="Enter Client Secret of your Okta application"
                    element={<textinput state="client_secret" placeholder="Client Secret" />}
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
                {!element.state.client_id ||
                !element.state.client_secret ||
                !element.state.okta_domain ? (
                    <hint>
                        <text style="bold">Enter values for the fields above and hit Save</text>
                    </hint>
                ) : null}
                <divider size="medium" />
                <text>Enter the following URL a Sign-In Redirect URI in Okta:</text>
                <text>{VACallbackURL}</text>
            </block>
        );
    },
});

const handleFetchEvent: FetchEventCallback<OktaRuntimeContext> = async (request, context) => {
    const { environment } = context;
    const installationURL = environment.spaceInstallation?.urls?.publicEndpoint;
    if (installationURL) {
        const router = Router({
            base: new URL(installationURL).pathname,
        });

        router.get('/visitor-auth/response', async (request) => {
            if (context.environment.spaceInstallation?.space) {
                const space = await context.api.spaces.getSpaceById(
                    context.environment.spaceInstallation?.space
                );
                const spaceData = space.data;
                const privateKey = context.environment.signingSecret;
                let token;
                try {
                    token = await sign(
                        { exp: Math.floor(Date.now() / 1000) + 2 * (60 * 60) },
                        privateKey
                    );
                } catch (e) {
                    return new Response('Error: Could not sign JWT token', {
                        status: 500,
                    });
                }

                const oktaDomain = environment.spaceInstallation?.configuration.okta_domain;
                const clientId = environment.spaceInstallation?.configuration.client_id;
                const clientSecret = environment.spaceInstallation?.configuration.client_secret;

                if (clientId && clientSecret) {
                    const searchParams = new URLSearchParams({
                        grant_type: 'authorization_code',
                        client_id: clientId,
                        client_secret: clientSecret,
                        code: `${request.query.code}`,
                        scope: 'openid',
                        redirect_uri: `${installationURL}/visitor-auth/response`,
                    });
                    const url = `https://${oktaDomain}/oauth2/default/v1/token/`;
                    const resp: any = await fetch(url, {
                        method: 'POST',
                        headers: { 'content-type': 'application/x-www-form-urlencoded' },
                        body: searchParams,
                    })
                        .then((response) => response.json())
                        .catch((err) => {
                            return new Response('Error: Could not fetch access token from Okta', {
                                status: 401,
                            });
                        });
                    if ('access_token' in resp) {
                        let url;
                        const state = request.query.state.toString();
                        const location = state.substring(state.indexOf('-') + 1);
                        if (location) {
                            url = `${spaceData.urls?.published}${location}/?jwt_token=${token}`;
                        } else {
                            url = `${spaceData.urls?.published}/?jwt_token=${token}`;
                        }
                        if (token && spaceData.urls?.published) {
                            return Response.redirect(url);
                        } else {
                            return new Response(
                                "Error: Either JWT token or space's published URL is missing",
                                {
                                    status: 500,
                                }
                            );
                        }
                    } else {
                        return new Response('Error: No Access Token found in response from Okta', {
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
        const installationURL = environment.spaceInstallation?.urls?.publicEndpoint;
        const oktaDomain = environment.spaceInstallation?.configuration.okta_domain;
        const clientId = environment.spaceInstallation?.configuration.client_id;
        const location = event.location ? event.location : '';

        const url = new URL(`https://${oktaDomain}/oauth2/default/v1/authorize`);
        url.searchParams.append('client_id', clientId);
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('redirect_uri', `${installationURL}/visitor-auth/response`);
        url.searchParams.append('response_mode', 'query');
        url.searchParams.append('scope', 'openid');
        url.searchParams.append('state', `state-${location}`);

        try {
            return Response.redirect(url.toString());
        } catch (e) {
            return new Response(e.message, {
                status: e.status || 500,
            });
        }
    },
});
