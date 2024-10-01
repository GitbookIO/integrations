import { Router } from 'itty-router';

import { RequestUpdateIntegrationInstallation } from '@gitbook/api';
import {
    createIntegration,
    createOAuthHandler,
    FetchEventCallback,
    EventCallback,
} from '@gitbook/runtime';

import { sendDiscordMessage } from './discord';
import { DiscordRuntimeContext, OAuthResponseWebhook } from './types';

/*
 * Handle content being updated: send a notification on Slack.
 */
const handleSpaceContentUpdated: EventCallback<
    'space_content_updated',
    DiscordRuntimeContext
> = async (event, context) => {
    await sendDiscordMessage(event, context);
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
        space_content_updated: handleSpaceContentUpdated,
    },
});
