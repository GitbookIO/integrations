import { Router } from 'itty-router';

import { api, createOAuthHandler } from '@gitbook/runtime';

import { executeSlackAPIRequest } from './api';
import { createSlackCommandsHandler } from './commands';
import { createSlackEventsHandler } from './events';
import { unfurlLink } from './links';
import { searchInGitBook } from './search';

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
        // TODO: use the yaml as SoT for scopes
        authorizeURL:
            'https://slack.com/oauth/v2/authorize?scope=chat:write%20channels:read%20%20groups:read%20links:read%20links:write%20commands',
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

/*
 * List the channels the user can select in the configuration flow.
 */
router.get('/channels', async () => {
    // TODO: list from all pages
    const result = await executeSlackAPIRequest('GET', 'conversations.list', {
        limit: 1000,
        exclude_archived: true,
        types: 'public_channel,private_channel',
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
    '/events',
    createSlackEventsHandler({
        url_verification: async (event) => {
            return { challenge: event.challenge };
        },
        link_shared: async (event) => {
            return unfurlLink(event);
        },
    })
);

/**
 * Handle incoming slash commands from Slack.
 */
router.post(
    '/commands',
    createSlackCommandsHandler({
        '/gitbook': async (slashEvent) => {
            return searchInGitBook(slashEvent);
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
addEventListener('space_content_updated', async (event) => {
    const channel =
        environment.spaceInstallation.configuration.channel ||
        environment.installation.configuration.default_channel;

    if (!channel) {
        // Integration not yet configured.
        return;
    }

    if (environment.spaceInstallation.configuration.notify_content_update === false) {
        // Content updates are turned off
        return;
    }

    const { data: space } = await api.spaces.getSpaceById(event.spaceId);

    await executeSlackAPIRequest('POST', 'chat.postMessage', {
        channel,
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `Content of *<${space.urls.app}|${
                        space.title || 'Space'
                    }>* has been updated`,
                },
            },
        ],
    });
});

/*
 * Handle content visibility being updated: send a notification on Slack.
 */
addEventListener('space_visibility_updated', async (event) => {
    const channel =
        environment.spaceInstallation.configuration.channel ||
        environment.installation.configuration.default_channel;

    if (!channel) {
        // Integration not yet configured on a channel
        return;
    }

    if (environment.spaceInstallation.configuration.notify_visibility_update === false) {
        // Visibility updates are turned off
        return;
    }

    const { spaceId, previousVisibility, visibility } = event;

    const { data: space } = await api.spaces.getSpaceById(spaceId);

    await executeSlackAPIRequest('POST', 'chat.postMessage', {
        channel,
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `The visibility of *<${space.urls.app}|${
                        space.title || 'Space'
                    }>* has been changed from *${previousVisibility}* to *${visibility}*`,
                },
            },
        ],
    });
});
