import type { SearchPageResult, SearchSectionResult, SearchSpaceResult } from '@gitbook/api';
import { api } from '@gitbook/runtime';

import { executeSlackAPIRequest } from './api';
import type { SlashEvent } from './commands';

export async function searchInGitBook(slashEvent: SlashEvent) {
    const { team_id, channel_id, text } = slashEvent;

    // Lookup the concerned installations
    const {
        data: { items: installations },
    } = await api.integrations.listIntegrationInstallations(environment.integration.name, {
        externalId: team_id,
    });

    /**
     * TODO: Prompt user to select a GitBook installation if there is more than one.
     * by showing org names in a dropdown and asking user to pick one
     */
    const installation = installations[0];
    if (!installation) {
        return {};
    }

    const accessToken = installation.configuration.oauth_credentials?.access_token;

    await executeSlackAPIRequest(
        'POST',
        'chat.postMessage',
        {
            channel: channel_id,
            text: `_Searching for query: ${text}_`,
        },
        {
            accessToken,
        }
    );

    // Authentify as the installation
    const installationApiClient = await api.createInstallationClient(
        environment.integration.name,
        installation.id
    );

    const {
        data: { items },
    } = await installationApiClient.search.searchContent({ query: text, limit: 5 });

    await executeSlackAPIRequest(
        'POST',
        'chat.postMessage',
        {
            channel: channel_id,
            blocks: buildSearchContentBlocks(text, items),
            unfurl_links: false,
            unfurl_media: false,
        },
        {
            accessToken,
        }
    );
}

function buildSearchContentBlocks(query: string, items: SearchSpaceResult[]) {
    const queryBlock = {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: `Showing results for query: *${query}*`,
        },
    };

    const blocks = items
        .flatMap((space) => space.pages)
        .reduce<Array<any>>(
            (acc, page) => {
                const pageResultBlock = buildSearchPageBlock(page);
                if (page.sections) {
                    const sectionBlocks = page.sections.map(buildSearchSectionBlock);
                    acc.push(...pageResultBlock, ...sectionBlocks);
                }
                return acc;
            },
            [queryBlock]
        );

    return blocks.flat();
}

function buildSearchPageBlock(page: SearchPageResult) {
    return [
        {
            type: 'divider',
        },
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `*<${page.urls.app}|:page_facing_up: ${page.title}>*`,
            },
        },
    ];
}

function buildSearchSectionBlock(section: SearchSectionResult) {
    const title = section.title ? `*${section.title.replace(/"/g, '')}*` : ``;
    const body = ` - _${section.body.replace(/"/g, '').split('\n').join('').slice(0, 128)}_`;
    const text = `:hash: ${title}${body}`;
    return [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text,
            },
            accessory: {
                type: 'button',
                text: {
                    type: 'plain_text',
                    text: 'View',
                    emoji: true,
                },
                url: section.urls.app,
                action_id: section.id,
            },
        },
    ];
}
