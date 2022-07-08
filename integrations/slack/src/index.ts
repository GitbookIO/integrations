import { Router } from 'itty-router';

import { api, createOAuthHandler } from '@gitbook/runtime';

import { executeSlackAPIRequest } from './api';
import { createSlackEventsHandler } from './events';

const router = Router({
    base: new URL(
        environment.installation?.urls.publicEndpoint || environment.integration.urls.publicEndpoint
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
 * Handle incoming webhooks from Slack.
 */
router.post(
    '/events',
    createSlackEventsHandler({
        url_verification: async (payload) => {
            return { challenge: payload.challenge };
        },
    })
);

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
