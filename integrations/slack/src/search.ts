import { SearchPageResult, SearchSectionResult, SearchSpaceResult } from '@gitbook/api';
import { api } from '@gitbook/runtime';

import { executeSlackAPIRequest } from './api';

import type { SlashEvent } from './commands';

export async function searchInGitBook(slashEvent: SlashEvent) {
    const { team_id, channel_id, command, text } = slashEvent;

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

    // Authentify as the installation
    const installationApiClient = await api.createInstallationClient(
        environment.integration.name,
        installation.id
    );

    const {
        data: { items },
    } = await installationApiClient.search.searchContent({ query: text, limit: 5 });

    const blocks = buildSearchContentSlackBlocks(items);

    await executeSlackAPIRequest(
        'POST',
        'chat.postMessage',
        { channel: channel_id, blocks, unfurl_links: false, unfurl_media: false },
        {
            accessToken: installation.configuration.oauth_credentials?.access_token,
        }
    );
}

function buildSearchContentSlackBlocks(items: SearchSpaceResultt[]) {
    const allPages = items.flatMap((space) => space.pages);
    const blocks = allPages.reduce((acc, page) => {
        const pageResultBlock = buildSearchPageBlock(page);
        if (page.sections) {
            const sectionBlocks = page.sections.map(buildSearchSectionBlock);
            acc.push(...pageResultBlock, ...sectionBlocks);
        }
        return acc;
    }, []);

    return blocks.flat();
}

function buildSearchPageBlock(page: SearchPageResult) {
    return [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `*<https://app.gitbook.com/${page.path}|${page.title}>*`,
            },
        },
        {
            type: 'divider',
        },
    ];
}

function buildSearchSectionBlock(section: SearchSectionResult) {
    const title = `*${section.title.replace(/"/g, '')}*`;
    const body = `_${section.body.replace(/"/g, '').split('\n').join('').slice(0, 512)}_`;
    const text = `${title} - ${body}`;
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
                ...(section.path ? { url: `https://app.gitbook.com/${section.path}` } : {}),
                action_id: section.id,
            },
        },
    ];
}
