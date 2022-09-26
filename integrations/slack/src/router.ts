import { Router } from 'itty-router';

import { createOAuthHandler, FetchEventCallback } from '@gitbook/runtime';

import { createSlackEventsHandler } from './events';
import { unfurlLink } from './links';
import { acknowledgeSlackRequest, verifySlackRequest } from './middlewares';
import { slackAPI } from './slack';

/**
 * Handle incoming HTTP requests:
 * - OAuth requests
 * - Slack webhook requests
 */
export const handleFetchEvent: FetchEventCallback = async ({ request }, context) => {
    const { environment } = context;
    const router = Router({
        base: new URL(
            environment.spaceInstallation?.urls?.publicEndpoint ||
                environment.installation?.urls.publicEndpoint ||
                environment.integration.urls.publicEndpoint
        ).pathname,
    });

    /*
     * Authenticate the user using OAuth.
     */
    router.get(
        '/oauth',
        createOAuthHandler({
            clientId: environment.secrets.CLIENT_ID,
            clientSecret: environment.secrets.CLIENT_SECRET,
            // TODO: use the yaml as SoT for scopes
            authorizeURL:
                'https://slack.com/oauth/v2/authorize?scope=chat:write%20channels:join%20channels:read%20%20groups:read%20links:read%20links:write%20commands',
            accessTokenURL: 'https://slack.com/api/oauth.v2.access',
            extractCredentials: (response) => {
                return {
                    externalIds: [response.team.id],
                    configuration: {
                        oauth_credentials: { access_token: response.access_token },
                    },
                };
            },
        })
    );

    router.post('/events', acknowledgeSlackRequest);

    /*
     * List the channels the user can select in the configuration flow.
     */
    router.get('/channels', async () => {
        // TODO: list from all pages
        const result = await slackAPI(context, {
            method: 'GET',
            path: 'conversations.list',
            payload: {
                limit: 1000,
                exclude_archived: true,
                types: 'public_channel,private_channel',
            },
        });

        const completions = result?.channels.map((channel) => ({
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
            url_verification: async (event) => {
                return { challenge: event.challenge };
            },
            link_shared: unfurlLink,
        })
    );

    const response = await router.handle(request, context);
    if (!response) {
        return new Response(`No route matching`, { status: 404 });
    }

    return response;
};
