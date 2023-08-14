import type { SearchPageResult, SearchSectionResult, SearchSpaceResult } from '@gitbook/api';

import type { SlashEvent } from '../commands';
import { SlackInstallationConfiguration, SlackRuntimeContext } from '../configuration';
import { slackAPI } from '../slack';

interface IQueryResult {
    data: {
        answer: {
            text?: string;
            pages: Array<Array<any>>;
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
                text: `_Searching for query: ${text}_ in GitBook installation ${installation.id}_`,
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

    const answer = result.data.answer;
    console.log('>>>', result.data);

    await slackAPI(
        context,
        {
            method: 'POST',
            path: 'chat.postMessage',
            payload: {
                channel: channel_id,
                response_type: 'in_channel',
                // blocks: buildSearchContentBlocks(text, items),
                blocks: [
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
                                answer.text ||
                                "I couldn't find anything related to your question. Perhaps try rephrasing it."
                            }`,
                        },
                    },
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: 'Some followup questions to try:',
                        },
                    },
                    ...answer.followupQuestions.map((question) => ({
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: `\`\\gitbook_scazan ${question}\``,
                        },
                    })),
                ],
                unfurl_links: false,
                unfurl_media: false,
            },
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
