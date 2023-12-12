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
            // eslint-disable-next-line no-console
            console.log('redirecting bby');
            try {
                return Response.redirect(
                    `https://dev-qyd2bk185i3mltdi.us.auth0.com/authorize?response_type=token&client_id=xEyiJiDYHQ6JQrOVBvhgXQxhi2KY4cC8&redirect_uri=https://integrations-gitbook-x-dev-vib-5d3ed.firebaseapp.com/v1/integrations/VA-Auth0/installations/e52595ae99fc77b2fd2faa581911d5ca6d532eadc15407a188b881981eb9c8b5/spaces/lsR2y6uosd61YyfqjSCv/space/visitor-auth/response`
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
                // return Response.redirect('https://www.google.no'); WORKS
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
                    return Response.json({ error: privateKey });
                }
                // return Response.redirect('https://www.google.no');
                return Response.redirect(
                    obj.urls?.published && token
                        ? `${obj.urls?.published}/?jwt_token=${token}`
                        : 'https://www.google.dk'
                );
            }
            // eslint-disable-next-line no-console
            console.log('noting here');
            return Response.redirect('https://www.google.com');
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

/*
 * Handle content being updated: Trigger an export to GitHub
 */
// const handleSpaceContentUpdated: EventCallback<
//     'space_content_updated',
//     GithubRuntimeContext
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

//     await triggerExport(context, spaceInstallation);
// };

// /*
//  * Handle git sync started: Update commit status
//  */
// const handleGitSyncStarted: EventCallback<'space_gitsync_started', GithubRuntimeContext> = async (
//     event,
//     context
// ) => {
//     logger.info(
//         `Git Sync started for space ${event.spaceId} revision ${event.revisionId}, updating commit status`
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
//         GitSyncOperationState.Running
//     );
// };

// /**
//  * Handle git sync completed: Update commit status
//  */
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
                            client_id: 'test',
                            issuer_base_url: 'url_test',
                        },
                    }
                );
                // eslint-disable-next-line no-console
                console.log('recevied response', res.data);
            } else {
                // eslint-disable-next-line no-console
                console.log('already has oprivate key');
                const res = await context.api.integrations.getIntegrationSpaceInstallation(
                    context.environment.integration.name,
                    event.installationId,
                    event.spaceId
                );
                // eslint-disable-next-line no-console
                console.log('existing config', res.data);
            }
        },
    },
});
