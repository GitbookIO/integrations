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

    console.log('-----------------------------');
    console.log('GUILD_ID');
    console.log('-----------------------------');
    const guildId = environment.installation?.configuration.oauth_credentials?.webhook?.guild_id;
    console.log(guildId);

    // <secret> - gitbook-test-discord-server [General - Voice Chanel]
    // <secret> - gitbook-test-discord-server [updates - Text Chanel]
    // <secret> - gitbook-test-discord-server [server_id]

    const url = `https://discord.com/api/v10/channels/${channelId}/messages`;
    console.log('-----------------------------');
    console.log('URL');
    console.log('-----------------------------');
    console.log(url);
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
    };
    // const body = JSON.stringify({
    //     content: 'Hello from the otter slide!! （ ^_^）o自自o（^_^ ',
    // });

    const body = {
        content: 'Hello, World!',
        tts: false,
    };

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
    // BOT + APPLICATIONS.COMMANDS + WEBHOOK>INCOMING URL - happy
    // https://discord.com/api/oauth2/authorize?
    // client_id=1118102608226304020&
    // permissions=2147485696&
    // redirect_uri=https%3A%2F%2Fintegrations.gitbook.com%2Fv1%2Fintegrations%2Fdiscord%2Fintegration%2Foauth&
    // response_type=code&
    // scope=bot%20webhook.incoming%20applications.commands

    // BOT_PERMISSIONS
    // 8 - admin
    // 534723950656 - all text permissions
    // 2048 - ?
    // 2147485696 -  send messages and use slash commands
    //
    // WEBHOOK TOKEN RESPONSE EXAMPLE
    // {
    //   "token_type": "Bearer",
    //   "access_token": "GNaVzEtATqdh173tNHEXY9ZYAuhiYxvy",
    //   "scope": "webhook.incoming",
    //   "expires_in": 604800,
    //   "refresh_token": "PvPL7ELyMDc1836457XCDh1Y8jPbRm",
    //   "webhook": {
    //     "application_id": "310954232226357250",
    //     "name": "testwebhook",
    //     "url": "https://discord.com/api/webhooks/347114750880120863/kKDdjXa1g9tKNs0-_yOwLyALC9gydEWP6gr9sHabuK1vuofjhQDDnlOclJeRIvYK-pj_",
    //     "channel_id": "345626669224982402",
    //     "token": "kKDdjXa1g9tKNs0-_yOwLyALC9gydEWP6gr9sHabuK1vuofjhQDDnlOclJeRIvYK-pj_",
    //     "type": 1,
    //     "avatar": null,
    //     "guild_id": "290926792226357250",
    //     "id": "347114750880120863"
    //   }
    // }

    const response = await router.handle(request, context);
    console.log('-----------------------------');
    console.log('request');
    console.log('-----------------------------');
    console.log(request);
    console.log('-----------------------------');
    console.log('context');
    console.log('-----------------------------');
    console.log(context);
    if (!response) {
        return new Response(`No route matching ${request.method} ${request.url}`, {
            status: 404,
        });
    }
    console.log('-----------------------------');
    console.log('RESPONSE - createOAuthHandler');
    console.log('-----------------------------');
    console.log(response);
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
