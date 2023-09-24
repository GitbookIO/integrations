import * as gitbook from '@gitbook/api';

import { SlackInstallationConfiguration, SlackRuntimeContext } from './configuration';
import { slackAPI } from './slack';

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
export async function unfurlLink(event: LinkSharedSlackEvent, context: SlackRuntimeContext) {
    const { api } = context;

    // if the link was posted by a bot, ignore this request
    if (event.event?.is_bot_user_member) {
        return {};
    }

    // Lookup the concerned installations
    const {
        data: { items: installations },
    } = await api.integrations.listIntegrationInstallations('slack', {
        externalId: event.team_id,
    });

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
            const { data: content } = await installationApiClient.urls.getContentByUrl({
                url: link.url,
            });

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
    const accessToken = (installation.configuration as SlackInstallationConfiguration)
        .oauth_credentials?.access_token;
    if (accessToken) {
        await slackAPI(
            context,
            {
                method: 'POST',
                path: 'chat.unfurl',
                payload: {
                    source: event.event.source,
                    unfurl_id: event.event.unfurl_id,
                    unfurls,
                },
            },

            {
                accessToken,
            }
        );
    }

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
                        text: `*Last updated:*\n<!date^${getUnixTimestamp(
                            space.updatedAt
                        )}^{date} at {time}|${space.updatedAt}>`,
                    },
                ],
                accessory: {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'View Space',
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
                        text: 'View Collection',
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

function getUnixTimestamp(ISODateString: string) {
    return Math.floor(new Date(ISODateString).getTime() / 1000);
}
