import { Router } from 'itty-router';

import { createOAuthHandler, FetchEventCallback } from '@gitbook/runtime';

import { createSlackActionsHandler } from './actions';
import { queryLens } from './actions/queryLens';
import { createSlackCommandsHandler } from './commands';
import { createSlackEventsHandler } from './events';
import { queryLensSlashHandler } from './handlers';
import { unfurlLink } from './links';
import { verifySlackRequest, acknowledgeSlackRequest } from './middlewares';
import { getChannelsPaginated } from './slack';

/**
 * Handle incoming HTTP requests:
 * - OAuth requests
 * - Slack webhook requests
 */
export const handleFetchEvent: FetchEventCallback = async (request, context) => {
    const { environment, api } = context;

    const router = Router({
        base: new URL(
            environment.spaceInstallation?.urls?.publicEndpoint ||
                environment.installation?.urls.publicEndpoint ||
                environment.integration.urls.publicEndpoint
        ).pathname,
    });

    const encodedScopes = encodeURIComponent(
        [
            'chat:write',
            'channels:join',
            'channels:read',
            'groups:read',
            'links:read',
            'links:write',
            'commands',
        ].join(' ')
    );

    /*
     * Authenticate the user using OAuth.
     */
    router.get(
        '/oauth',
        createOAuthHandler({
            clientId: environment.secrets.CLIENT_ID,
            clientSecret: environment.secrets.CLIENT_SECRET,
            // TODO: use the yaml as SoT for scopes
            authorizeURL: `https://slack.com/oauth/v2/authorize?scope=${encodedScopes}`,
            accessTokenURL: 'https://slack.com/api/oauth.v2.access',
            extractCredentials: (response) => {
                if (!response.ok) {
                    throw new Error(
                        `Failed to exchange code for access token ${JSON.stringify(response)}`
                    );
                }

                return {
                    externalIds: [response.team.id],
                    configuration: {
                        oauth_credentials: { access_token: response.access_token },
                    },
                };
            },
        })
    );

    // event triggers, e.g app_mention
    router.post('/events', verifySlackRequest, acknowledgeSlackRequest);

    // shortcuts & interactivity
    router.post('/actions', verifySlackRequest, acknowledgeSlackRequest);

    // /gitbook
    router.post('/commands', acknowledgeSlackRequest);

    router.post(
        '/commands_task',
        verifySlackRequest,
        createSlackCommandsHandler({
            '/gitbook': queryLensSlashHandler,
        })
    );

    /*
     * List the channels the user can select in the configuration flow.
     */
    router.get('/channels', async () => {
        const channels = await getChannelsPaginated(context);

        const completions = channels.map((channel) => ({
            label: channel.name,
            value: channel.id,
        }));

        return new Response(JSON.stringify(completions), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });

    /*
     * Handle incoming webhooks from Slack.
     */
    router.post(
        '/events_task',
        verifySlackRequest,
        createSlackEventsHandler({
            link_shared: unfurlLink,
        })
    );

    router.post(
        '/actions_task',
        verifySlackRequest,
        createSlackActionsHandler({
            queryLens,
        })
    );

    const response = await router.handle(request, context);
    if (!response) {
        return new Response(`No route matching ${request.method} ${request.url}`, {
            status: 404,
        });
    }

    return response;
};
