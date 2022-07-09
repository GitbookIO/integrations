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
    const {
        data: { items: installations },
    } = await api.integrations.listIntegrationInstallations('slack', {
        externalId: event.team_id,
    });

    console.log('found', installations.length, 'installations');

    const unfurls = {};

    await Promise.all(
        event.event.links.map(async (link) => {
            console.log('unfurl link', link.url);

            unfurls[link.url] = {
                blocks: [
                    {
                        type: 'header',
                        text: {
                            type: 'plain_text',
                            text: 'Title of the space',
                            emoji: true,
                        },
                    },
                    {
                        type: 'section',
                        fields: [
                            {
                                type: 'mrkdwn',
                                text: '*Last updated:*\nAug 10',
                            },
                            {
                                type: 'mrkdwn',
                                text: '*Created by:*\n<example.com|Fred Enriquez>',
                            },
                        ],
                        accessory: {
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: 'Click Me',
                                emoji: true,
                            },
                            value: 'click_me_123',
                            action_id: 'button-action',
                        },
                    },
                ],
            };
        })
    );

    const installation = installations[0];

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
