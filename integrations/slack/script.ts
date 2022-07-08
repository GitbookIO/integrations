import { Router } from 'itty-router';

import { api, createOAuthHandler } from '@gitbook/runtime';

const router = Router({
    base: `/v1/integrations/${environment.integration.name}/installations/${environment.installation.id}`,
});

/*
 * Authenticate the user using OAuth.
 */
router.get(
    '/oauth',
    createOAuthHandler({
        clientId: environment.secrets.CLIENT_ID,
        clientSecret: environment.secrets.CLIENT_SECRET,
        authorizeURL: 'https://slack.com/oauth/v2/authorize?scope=chat:write%20channels:read',
        accessTokenURL: 'https://slack.com/api/oauth.v2.access',
    })
);

/*
 * List the conversations the user can select in the configuration flow.
 */
router.get('/conversations', async () => {
    // TODO: list from all pages
    const result = await executeSlackAPIRequest('POST', 'conversations.list');

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
 * Bind these routes.
 */
addEventListener('fetch', (event, eventContext) => {
    event.respondWith(router.handle(event.request, eventContext));
});

/*
 * Handle content being updated: send a notification on Slack.
 */
addEventListener('space:content:updated', async (event) => {
    const conversation =
        environment.spaceInstallation.configuration.conversation ||
        environment.installation.configuration.default_conversation;
    if (!conversation) {
        // Integration not yet configured.
        return;
    }

    const { data: space } = await api.spaces.getSpaceById(event.spaceId);

    await executeSlackAPIRequest('POST', 'chat.postMessage', {
        channel: conversation,
        text: `Content in "${space.title}" has been updated`,
    });
});

/**
 * Execute a Slack API request.
 */
async function executeSlackAPIRequest(
    httpMethod: string,
    apiMethod: string,
    payload: { [key: string]: any } = {}
) {
    const accessToken = environment.installation.configuration.oauth_credentials?.access_token;
    if (!accessToken) {
        throw new Error('Connection not ready');
    }

    const url = new URL(`https://slack.com/api/${apiMethod}`);

    let body;

    if (httpMethod === 'GET') {
        url.searchParams.set('token', accessToken);
    } else {
        const params = new URLSearchParams();
        params.set('token', accessToken);

        Object.entries(payload).forEach(([key, value]) => {
            params.set(key, value);
        });

        body = params.toString();
    }

    const response = await fetch(url.toString(), {
        method: httpMethod,
        body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.ok) {
        throw new Error(`${httpMethod} ${url.toString()}: ${result.error}`);
    }

    return result;
}
