import { sign } from '@tsndr/cloudflare-worker-jwt';
import { Router } from 'itty-router';
// import * as jwt from 'jsonwebtoken';

import {
    createIntegration,
    FetchEventCallback,
    Logger,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

const logger = Logger('auth0.visitor-auth');

type Auth0RuntimeEnvironment = RuntimeEnvironment<
    {},
    {
        client_id?: string;
        issuer_base_url?: string;
        private_key?: string;
        client_secret?: string;
    }
>;

// https://dev-qyd2bk185i3mltdi.us.auth0.com/authorize?response_type=code&client_id=xEyiJiDYHQ6JQrOVBvhgXQxhi2KY4cC8&redirect_uri=${installationURL}/visitor-auth/response&state=${location}`

type Auth0RuntimeContext = RuntimeContext<Auth0RuntimeEnvironment>;
const handleFetchEvent: FetchEventCallback<Auth0RuntimeContext> = async (request, context) => {
    const { environment } = context;
    const installationURL = environment.spaceInstallation?.urls?.publicEndpoint;
    if (installationURL) {
        const router = Router({
            base: new URL(installationURL).pathname,
        });
        router.get('/visitor-auth', async (request) => {
            // eslint-disable-next-line no-console
            console.log('redirecting bby');
            logger.debug('Got a request');
            const location = request.query.location;
            const issuerBaseUrl = environment.spaceInstallation?.configuration.issuer_base_url;
            const clientId = environment.spaceInstallation?.configuration.client_id;

            // return Response.json({ url_received: request.url, query: request.query });
            // return Response.json({ error: installationURL });
            try {
                return Response.redirect(
                    `${issuerBaseUrl}/authorize?response_type=code&client_id=${clientId}&redirect_uri=${installationURL}/visitor-auth/response&state=${location}`
                );
            } catch (e) {
                return Response.json({ error: e.stack });
            }
            // return Response.redirect(`${installationURL}/visitor-auth/response`);
        });

        router.get('/visitor-auth/response', async (request) => {
            // eslint-disable-next-line no-console
            console.log('yaaay');
            // redirect to published content URL
            if (context.environment.spaceInstallation?.space) {
                const space = await context.api.spaces.getSpaceById(
                    context.environment.spaceInstallation?.space
                );
                // eslint-disable-next-line no-console
                console.log('space', space);
                // return Response.json({ url: request.url });
                // WORKS;
                const obj = space.data;
                const privateKey = context.environment.spaceInstallation.configuration.private_key;
                // eslint-disable-next-line no-console
                console.log('space', obj, privateKey);
                // return Response.json({ error: privateKey });
                // return Response.redirect('https://www.google.in');
                let token;
                try {
                    token = await sign(
                        { exp: Math.floor(Date.now() / 1000) + 2 * (60 * 60) },
                        privateKey ? privateKey : ''
                    );
                } catch (e) {
                    return Response.json({ error: e.stack });
                }
                // return Response.json({ query: request.query });
                const issuerBaseUrl = environment.spaceInstallation?.configuration.issuer_base_url;
                const clientId = environment.spaceInstallation?.configuration.client_id;
                const clientSecret = environment.spaceInstallation?.configuration.client_secret;
                if (clientId && clientSecret) {
                    const searchParams = new URLSearchParams({
                        grant_type: 'authorization_code',
                        client_id: clientId,
                        client_secret: clientSecret,
                        code: `${request.query.code}`,
                        redirect_uri: `${installationURL}/visitor-auth/response`,
                    });
                    // return Response.json({ searchParams });
                    const url = `${issuerBaseUrl}/oauth/token/`;
                    // return Response.json({ url });
                    const resp: any = await fetch(url, {
                        method: 'POST',
                        headers: { 'content-type': 'application/x-www-form-urlencoded' },
                        body: searchParams,
                    })
                        .then((response) => response.json())
                        .catch((err) => {
                            return Response.json({ err });
                        });

                    if ('access_token' in resp) {
                        let url;
                        // return Response.json({ state: request.query.state });
                        if (request.query.state) {
                            url = `${obj.urls?.published}${request.query.state}/?jwt_token=${token}`;
                        } else {
                            url = `${obj.urls?.published}/?jwt_token=${token}`;
                        }
                        return Response.redirect(
                            obj.urls?.published && token ? url : 'https://www.google.dk'
                        );
                    } else {
                        return Response.json({
                            Error: 'No Access Token found in the response from Auth0',
                        });
                    }
                } else {
                    return Response.json({
                        Error: 'Either ClientId or ClientSecret is missing',
                    });
                }
                // // return Response.redirect('https://www.google.no');
                // return Response.redirect(
                //     obj.urls?.published && token
                //         ? `${obj.urls?.published}/?jwt_token=${token}`
                //         : 'https://www.google.dk'
                // );
            }
            // eslint-disable-next-line no-console
            console.log('noting here');
            // return Response.redirect('https://www.google.com');
        });
        /**
         * Handle GitHub App webhook events
         */

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
    events: {
        space_installation_setup: async (event, context) => {
            // eslint-disable-next-line no-console
            console.log(
                'received event',
                context.environment.integration.name,
                event.installationId,
                event.spaceId
            );
            // eslint-disable-next-line no-console
            console.log(
                'context.environment.installation?.configuration.private_key',
                context.environment.installation?.configuration
            );
            if (!context.environment.spaceInstallation?.configuration.private_key) {
                const res = await context.api.integrations.updateIntegrationSpaceInstallation(
                    context.environment.integration.name,
                    event.installationId,
                    event.spaceId,
                    {
                        configuration: {
                            private_key: crypto.randomUUID(),
                            // client_id:
                            //     context.environment.spaceInstallation?.configuration.client_id,
                            // issuer_base_url:
                            //     context.environment.spaceInstallation?.configuration
                            //         .issuer_base_url,
                        },
                    }
                );
                // eslint-disable-next-line no-console
                console.log('recevied response', res.data);
            }
        },
    },
});
