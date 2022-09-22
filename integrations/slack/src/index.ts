import { createIntegration, EventCallback } from '@gitbook/runtime';

import { SlackRuntimeContext } from './configuration';
import { handleFetchEvent } from './router';
import { slackAPI } from './slack';

/*
 * Handle content being updated: send a notification on Slack.
 */
const handleSpaceContentUpdated: EventCallback<
    'space_content_updated',
    SlackRuntimeContext
> = async (event, context) => {
    const { environment, api } = context;
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

    await slackAPI(context, {
        method: 'POST',
        path: 'chat.postMessage',
        payload: {
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
        },
    });
};

/*
 * Handle content visibility being updated: send a notification on Slack.
 */
const handleSpaceVisibilityUpdated: EventCallback<
    'space_visibility_updated',
    SlackRuntimeContext
> = async (event, context) => {
    const { environment, api } = context;

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

    await slackAPI(context, {
        method: 'POST',
        path: 'chat.postMessage',
        payload: {
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
        },
    });
};

export default createIntegration({
    fetch: handleFetchEvent,

    events: {
        space_content_updated: handleSpaceContentUpdated,
        space_visibility_updated: handleSpaceVisibilityUpdated,
    },
});
