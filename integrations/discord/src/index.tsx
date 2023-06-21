import { Router } from 'itty-router';

// eslint-disable-next-line import/no-extraneous-dependencies
import { RequestUpdateIntegrationInstallation } from '@gitbook/api';
import {
    createIntegration,
    createOAuthHandler,
    OAuthResponse,
    FetchEventCallback,
    EventCallback,
} from '@gitbook/runtime';

import { DiscordRuntimeContext, OAuthResponseWebhook } from './types';

/*
 * Handle content being updated: send a notification on Slack.
 */
const handleSpaceContentUpdated: EventCallback<
    'space_content_updated',
    DiscordRuntimeContext
> = async (event, context) => {
    console.log('handleSpaceContentUpdated');
    const { environment, api } = context;
    const { data: space } = await api.spaces.getSpaceById(event.spaceId);

    console.log('space');
    console.log(space);

    const accessToken = environment.installation?.configuration.oauth_credentials?.access_token;

    const botToken = environment.secrets.BOT_TOKEN;
    console.log('-----------------------------');
    console.log('BOT_TOKEN');
    console.log('-----------------------------');
    console.log(botToken);

    if (!accessToken) {
        throw new Error('No authentication token provided');
    } else console.log('-----------------------------');
    console.log('ACCESS TOKEN HAPPY');
    console.log('-----------------------------');

    console.log('-----------------------------');
    console.log('WEBHOOK');
    console.log('-----------------------------');
    const webhook = environment.installation?.configuration.oauth_credentials?.webhook;
    console.log(webhook);
    //
    console.log('-----------------------------');
    console.log('CHANNEL_ID');
    console.log('-----------------------------');
    console.log(environment.installation?.configuration.oauth_credentials);
    // this is a string because the MAX SAFE INTEGER constant is 16 characters and the channel_id is 19 characters
    const channelId =
        environment.installation?.configuration.oauth_credentials?.webhook?.channel_id;
    console.log(channelId);

    const url = `https://discord.com/api/v10/channels/${channelId}/messages`;
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bot ${botToken}`,
    };
    const body = JSON.stringify({
        content: 'Hello from the otter slide!! （ ^_^）o自自o（^_^ ',
    });

    console.log('-----------------------------');
    console.log('BODY');
    console.log('-----------------------------');
    console.log(body);

    const res = await fetch(url, { method: 'POST', headers, body }).catch((err) => {
        throw new Error(`Error fetching content from ${url}. ${err}`);
    });

    // TODO: Remove `res` as it is unnecessary, but useful for debugging to see what status id is returned.
    console.log('-----------------------------');
    console.log('RESPONSE - handleSpaceContentUpdated');
    console.log('-----------------------------');
    console.log(res);
};

const handleFetchEvent: FetchEventCallback<DiscordRuntimeContext> = async (request, context) => {
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
        // @ts-ignore
        createOAuthHandler({
            redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
            clientId: environment.secrets.CLIENT_ID,
            clientSecret: environment.secrets.CLIENT_SECRET,
            authorizeURL:
                'https://discord.com/api/oauth2/authorize?response_type=code&permissions=2147485696',
            accessTokenURL: 'https://discord.com/api/oauth2/token',
            scopes: ['applications.commands', 'bot', 'webhook.incoming'],
            extractCredentials,
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

const extractCredentials = async (
    response: OAuthResponseWebhook
): Promise<RequestUpdateIntegrationInstallation> => {
    const { access_token, webhook } = response;
    return {
        configuration: {
            oauth_credentials: {
                access_token,
                expires_at: Date.now() + response.expires_in * 1000,
                refresh_token: response.refresh_token,
                webhook,
            },
        },
    };
};

export default createIntegration<DiscordRuntimeContext>({
    fetch: handleFetchEvent,
    events: {
        // TODO: Update this event to the correct one for when a change is merged - I only used this one as it is quicker to test the changes
        space_content_updated: handleSpaceContentUpdated,
    },
});
