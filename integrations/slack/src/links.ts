import * as gitbook from '@gitbook/api';
import { api } from '@gitbook/runtime';

import { executeSlackAPIRequest } from './api';

interface LinkSharedSlackEvent {
    team_id: string;
    event: {
        type: 'link_shared';
        channel: string;
        is_bot_user_member: boolean;
        user: string;
        message_ts: string;
        unfurl_id: string;
        thread_ts: string;
        source: string;
        links: Array<{
            domain: string;
            url: string;
        }>;
    };
}

/**
 * Unfurl a link on Slack with metadata from GitBook.
 */
export async function unfurlLink(event: LinkSharedSlackEvent) {
    // Lookup the concerned installations
    const {
        data: { items: installations },
    } = await api.integrations.listIntegrationInstallations('slack', {
        externalId: event.team_id,
    });

    console.log('found', installations.length, 'installations');

    const installation = installations[0];
    if (!installation) {
        return {};
    }

    // Authentify as the installation
    const installationApiClient = await api.createInstallationClient('slack', installation.id);

    // Resolve links to their content
    const unfurls = {};
    await Promise.all(
        event.event.links.map(async (link) => {
            console.log('unfurl link', link.url, encodeURIComponent(link.url));

            const { data: content, url } = await installationApiClient.urls.getContentByUrl({
                url: link.url,
            });

            console.log('got', url, content);

            if (!content) {
                return;
            }

            if ('space' in content && content.space) {
                unfurls[link.url] = createBlocksForSpace(content.space);
            }
            if ('collection' in content && content.collection) {
                unfurls[link.url] = createBlocksForCollection(content.collection);
            }
        })
    );

    // Send the unfurls to Slack
    await executeSlackAPIRequest(
        'POST',
        'chat.unfurl',
        {
            source: event.event.source,
            unfurl_id: event.event.unfurl_id,
            unfurls,
        },
        {
            accessToken: installation.configuration.oauth_credentials?.access_token,
        }
    );

    return {};
}

function createBlocksForSpace(space: gitbook.Space) {
    return {
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*<${space.urls.app}|${space.title || 'Space'}>*`,
                },
            },
            {
                type: 'section',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: `*Visibility:*\n${space.visibility}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Last updated:*\n${space.updatedAt}`,
                    },
                ],
                accessory: {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Open in GitBook',
                        emoji: true,
                    },
                    value: 'open',
                    url: space.urls.app,
                    action_id: 'button-action',
                },
            },
        ],
    };
}

function createBlocksForCollection(collection: gitbook.Collection) {
    return {
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*<${collection.urls.app}|${collection.title || 'Collection'}>*`,
                },
                accessory: {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Open in GitBook',
                        emoji: true,
                    },
                    value: 'open',
                    url: collection.urls.app,
                    action_id: 'button-action',
                },
            },
        ],
    };
}
