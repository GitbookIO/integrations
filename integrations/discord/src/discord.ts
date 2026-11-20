import { EventByType, IntegrationError } from '@gitbook/runtime';
import { DiscordRuntimeContext } from './types';

export const sendDiscordMessage = async (
    event: EventByType<'space_content_updated'>,
    context: DiscordRuntimeContext,
) => {
    const { environment, api } = context;
    const { data: space } = await api.spaces.getSpaceById(event.spaceId);

    const channelId =
        environment.installation?.configuration.oauth_credentials?.webhook?.channel_id;

    const url = `https://discord.com/api/v10/channels/${channelId}/messages`;

    const botToken = environment.secrets.BOT_TOKEN;

    const accessToken = environment.installation?.configuration.oauth_credentials?.access_token;

    if (!accessToken) {
        throw new IntegrationError('authentication_required');
    }
    if (!botToken || !channelId) {
        throw new IntegrationError('configuration_required');
    }

    const embedObject = {
        title: 'View changes here:',
        description: `${space.urls.app}`,
        thumbnail: {
            url: 'https://avatars.githubusercontent.com/u/7111340?s=280&v=4',
        },
    };

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bot ${botToken}`,
    };
    const body = JSON.stringify({
        content: `Changes have been made in ${space.title}.`,
        embeds: [embedObject],
    });

    const response = await fetch(url, { method: 'POST', headers, body }).catch((err) => {
        throw new Error(`Error fetching content from ${url}. ${err}`);
    });
    if (!response.ok) {
        if ([401, 403, 404].includes(response.status)) {
            throw new IntegrationError('configuration_required');
        }
        throw new Error(`Discord API error: HTTP ${response.status}`);
    }
};
