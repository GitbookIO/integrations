import type { SearchPageResult, SearchSectionResult, SearchSpaceResult } from '@gitbook/api';

import type { SlashEvent } from '../commands';
import { SlackInstallationConfiguration, SlackRuntimeContext } from '../configuration';
import { slackAPI } from '../slack';

interface IQueryResult {
    data: {
        answer: {
            text?: string;
            pages: Array<
                Array<{
                    page: string;
                    revision: string;
                    sections: Array<string>;
                    space: string;
                }>
            >;
            followupQuestions: Array<string>;
        };
    };
}

/**
 * Search for a query in GitBook and post a message to Slack.
 */
export async function queryLensInGitBook(slashEvent: SlashEvent, context: SlackRuntimeContext) {
    const { environment, api } = context;
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

    const accessToken = (installation.configuration as SlackInstallationConfiguration)
        .oauth_credentials?.access_token;

    await slackAPI(
        context,
        {
            method: 'POST',
            path: 'chat.postMessage',
            payload: {
                channel: channel_id,
                text: `_Asking GitBook Lens: ${text}_`,
            },
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

    const result: IQueryResult = await installationApiClient.search.askQuery({ query: text });

    const answer = result.data?.answer;

    const pageRequests = await Promise.all(
        answer?.pages?.map((page) =>
            installationApiClient.spaces.getPageById(page.space, page.page)
        ) ?? []
    );

    const resolvedPages = pageRequests.map((pageRequest, i) => ({
        ...pageRequest.data,
        ...(answer?.pages[i] ?? []),
    }));

    const blocks = {
        method: 'POST',
        path: 'chat.postMessage',
        payload: {
            channel: channel_id,
            response_type: 'in_channel',
            blocks: [
                {
                    type: 'divider',
                },
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text,
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `${
                            answer?.text ||
                            "I couldn't find anything related to your question. Perhaps try rephrasing it."
                        }`,
                    },
                },

                {
                    type: 'divider',
                },
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: 'More information:',
                    },
                },
                ...buildSearchContentBlocks(resolvedPages),
                {
                    type: 'divider',
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: 'Some followup questions you might try:',
                    },
                },
                ...(answer?.followupQuestions?.map((question) => ({
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `\`/gitbooklens ${question}\``,
                    },
                })) ?? []),
                {
                    type: 'divider',
                },
            ],
            unfurl_links: false,
            unfurl_media: false,
        },
    };
    await slackAPI(context, blocks, {
        accessToken,
    });
}

function buildSearchContentBlocks(items: Array<any>) {
    const blocks = items.reduce<Array<any>>((acc, page) => {
        const pageResultBlock = buildSearchPageBlock(page);
        // if (page.sections) {
        // const sectionBlocks = page.sections.map(buildSearchSectionBlock);
        acc.push(pageResultBlock);
        // }
        return acc;
    }, []);

    return blocks.flat();
}

function buildSearchPageBlock(page: SearchPageResult) {
    // TODO: @scazan this is hardcoded, we need to get the org as well (assuming from the context)
    const url = `https://gitbook-x-dev-scazan.firebaseapp.com/o/Uhi13uaBRmvSt6UGc5br/s/${page.space}/${page.slug}`;
    return [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `* <${url}|:page_facing_up: ${page.title}>* `,
            },
        },
    ];
}

function buildSearchSectionBlock(section: SearchSectionResult) {
    const title = section.title ? `* ${section.title.replace(/"/g, '')}* ` : ``;
    const body = ` - _${section.body.replace(/"/g, '').split('\n').join('').slice(0, 128)} _`;
    const text = `: hash: ${title}${body} `;
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
