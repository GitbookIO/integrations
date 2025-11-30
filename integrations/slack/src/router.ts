import { Router } from 'itty-router';

import {
    createOAuthHandler,
    FetchEventCallback,
    Logger,
    OAuthResponse,
} from '@gitbook/runtime';

import {
    createSlackEventsHandler,
    createSlackCommandsHandler,
    slackActionsHandler,
    messageEventHandler,
    appMentionEventHandler,
    askAICommandHandler,
} from './handlers';
import { unfurlLink } from './links';
import { verifySlackRequest, acknowledgeSlackRequest } from './middlewares';
import { getChannelsPaginated } from './slack';
import { handleAskAITask, IntegrationTask } from './actions';

const logger = Logger('slack');

/**
 * Handle incoming HTTP requests:
 * - OAuth requests
 * - Slack webhook requests
 */
export const handleFetchEvent: FetchEventCallback = async (request, context) => {
    const { environment } = context;

    const router = Router({
        base: new URL(
            environment.spaceInstallation?.urls?.publicEndpoint ||
                environment.installation?.urls.publicEndpoint ||
                environment.integration.urls.publicEndpoint,
        ).pathname,
    });

    const requestedScopes = [
        'app_mentions:read',
        'chat:write',
        'channels:join',
        'channels:read',
        'groups:read',
        'links:read',
        'links:write',
        'commands',
        'channels:history',
        'im:history',
        'assistant:write',
    ];
    const encodedScopes = encodeURIComponent(requestedScopes.join(' '));

    /*
     * Authenticate the user using OAuth.
     */
    router.get(
        '/oauth',
        createOAuthHandler<
            OAuthResponse & {
                team: {
                    id: string;
                };
            }
        >({
            clientId: environment.secrets.CLIENT_ID,
            clientSecret: environment.secrets.CLIENT_SECRET,
            // TODO: use the yaml as SoT for scopes
            authorizeURL: `https://slack.com/oauth/v2/authorize?scope=${encodedScopes}`,
            accessTokenURL: 'https://slack.com/api/oauth.v2.access',
            extractCredentials: (response) => {
                if (!response.ok) {
                    throw new Error(
                        `Failed to exchange code for access token ${JSON.stringify(response)}`,
                    );
                }

                return {
                    externalIds: [response.team.id],
                    configuration: {
                        oauth_credentials: {
                            access_token: response.access_token,
                            requested_scopes: requestedScopes,
                        },
                    },
                };
            },
        }),
    );

    /*
     * Handle incoming webhooks from Slack.
     * event triggers, e.g app_mention
     */
    router.post(
        '/events',
        verifySlackRequest,
        createSlackEventsHandler({
            url_verification: async (event: { challenge: string }) => {
                return { challenge: event.challenge };
            },
            message: messageEventHandler,
            app_mention: appMentionEventHandler,
            link_shared: unfurlLink,
        }),
        acknowledgeSlackRequest,
    );

    /* Handle shortcuts and interactivity via Slack UI blocks
     * shortcuts & interactivity
     */
    router.post('/actions', verifySlackRequest, slackActionsHandler, acknowledgeSlackRequest);

    /* Handle slash commands
     * eg. /gitbook [command]
     */
    router.post(
        '/commands',
        verifySlackRequest,
        createSlackCommandsHandler({
            '/gitbook': askAICommandHandler,
            '/gitbookstaging': askAICommandHandler, // needed to allow our staging app to co-exist with the prod app
        }),
        acknowledgeSlackRequest,
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
                'Cache-Control': 'no-cache, no-store',
            },
        });
    });

    const response = await router.handle(request, context);
    if (!response) {
        return new Response(`No route matching ${request.method} ${request.url}`, {
            status: 404,
        });
    }

    return response;
};
