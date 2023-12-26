import { sign } from '@tsndr/cloudflare-worker-jwt';
import { Router } from 'itty-router';
// import * as jwt from 'jsonwebtoken';

import {
    createIntegration,
    FetchEventCallback,
    Logger,
    RuntimeContext,
    RuntimeEnvironment,
    EventCallback,
} from '@gitbook/runtime';

// import type { GithubRuntimeContext } from '../../github/src/types';

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

type Auth0RuntimeContext = RuntimeContext<Auth0RuntimeEnvironment>;
const handleFetchEvent: FetchEventCallback<Auth0RuntimeContext> = async (request, context) => {
    const { environment } = context;
    const installationURL = environment.spaceInstallation?.urls?.publicEndpoint;
    if (installationURL) {
        const router = Router({
            base: new URL(installationURL).pathname,
        });
        router.get('/visitor-auth', async (request) => {
            logger.debug('Got a request');
            return Response.json({ req: 'Got in the fetch event' });
            const location = request.query.location;
            const issuerBaseUrl = environment.spaceInstallation?.configuration.issuer_base_url;
            const clientId = environment.spaceInstallation?.configuration.client_id;

            try {
                return Response.redirect(
                    `${issuerBaseUrl}/authorize?response_type=code&client_id=${clientId}&redirect_uri=${installationURL}/visitor-auth/response&state=${location}`
                );
            } catch (e) {
                return Response.json({ error: e.stack });
            }
        });

        router.get('/visitor-auth/response', async (request) => {
            if (context.environment.spaceInstallation?.space) {
                const space = await context.api.spaces.getSpaceById(
                    context.environment.spaceInstallation?.space
                );
                const obj = space.data;
                const privateKey = context.environment.spaceInstallation.configuration.private_key;
                let token;
                try {
                    token = await sign(
                        { exp: Math.floor(Date.now() / 1000) + 2 * (60 * 60) },
                        privateKey ? privateKey : ''
                    );
                } catch (e) {
                    return Response.json({ error: e.stack });
                }

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
                    const url = `${issuerBaseUrl}/oauth/token/`;
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

// const handleFetchVisitorAuth: EventCallback<
//     'fetch_visitor_authentication',
//     Auth0RuntimeContext
// > = async (event, context) => {
//     const { data: revision } = await context.api.spaces.getRevisionById(
//         event.spaceId,
//         event.revisionId
//     );
//     if (revision.git?.oid) {
//         const revisionStatus = revision.git.createdByGitBook ? 'exported' : 'imported';
//         logger.info(
//             `skipping Git Sync for space ${event.spaceId} revision ${revision.id} as it was already ${revisionStatus}`
//         );
//         return;
//     }

//     const spaceInstallation = context.environment.spaceInstallation;
//     if (!spaceInstallation) {
//         logger.debug(`missing space installation, skipping`);
//         return;
//     }

//     // await triggerExport(context, spaceInstallation);
// };
// const handleGitSyncCompleted: EventCallback<
//     'space_gitsync_completed',
//     GithubRuntimeContext
// > = async (event, context) => {
//     logger.info(
//         `Git Sync completed (${event.state}) for space ${event.spaceId} revision ${event.revisionId}, updating commit status`
//     );

//     const spaceInstallation = context.environment.spaceInstallation;
//     if (!spaceInstallation) {
//         logger.debug(`missing space installation, skipping`);
//         return;
//     }

//     await updateCommitWithPreviewLinks(
//         context,
//         spaceInstallation,
//         event.revisionId,
//         event.commitId,
//         event.state as GitSyncOperationState
//     );
// };

export default createIntegration({
    fetch: handleFetchEvent,
    events: {
        space_installation_setup: async (event, context) => {
            if (!context.environment.spaceInstallation?.configuration.private_key) {
                const res = await context.api.integrations.updateIntegrationSpaceInstallation(
                    context.environment.integration.name,
                    event.installationId,
                    event.spaceId,
                    {
                        configuration: {
                            private_key: crypto.randomUUID(),
                        },
                    }
                );
            }
        },
        fetch_visitor_authentication: async (event, context) => {
            const { environment } = context;
            const installationURL = environment.spaceInstallation?.urls?.publicEndpoint;
            const issuerBaseUrl = environment.spaceInstallation?.configuration.issuer_base_url;
            const clientId = environment.spaceInstallation?.configuration.client_id;
            const location = event.location || '';

            try {
                return Response.redirect(
                    `${issuerBaseUrl}/authorize?response_type=code&client_id=${clientId}&redirect_uri=${installationURL}/visitor-auth/response&state=${location}`
                );
            } catch (e) {
                return Response.json({ error: e.stack });
            }

            // await triggerExport(context, spaceInstallation);
        },
    },
});
