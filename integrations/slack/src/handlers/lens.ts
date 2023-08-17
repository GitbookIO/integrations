import type { SearchAIAnswer, GitBookAPI } from '@gitbook/api';

import type { SlashEvent } from '../commands';
import {
    SlackInstallationConfiguration,
    SlackRuntimeContext,
    SlackRuntimeEnvironment,
} from '../configuration';
import { slackAPI } from '../slack';
import { PagesBlock } from '../ui/blocks';

async function getRelatedPages(params: {
    answer?: SearchAIAnswer;
    client: GitBookAPI;
    environment: SlackRuntimeEnvironment;
}) {
    const { answer, client, environment } = params;

    // TODO: Need to find why there is no spaceInstalation in the environment
    const spaceId =
        environment.spaceInstallation?.space ||
        (answer?.pages?.length > 0 && answer.pages[0].space);

    // get current revision for the space
    const { data: currentRevision } = await client.spaces.getCurrentRevision(spaceId);

    const pageIds = answer?.pages?.map((page) => page.page);

    // possible undefined here

    const publicUrl = currentRevision.urls.public || currentRevision.urls.app;

    // filter related pages from current revision
    return {
        publicUrl,
        relatedPages: currentRevision.pages.filter((revisionPage) =>
            pageIds.includes(revisionPage.id)
        ),
    };
}

/**
 * Query GitBook Lens and post a message back to Slack.
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

    const result = await installationApiClient.search.askQuery({ query: text });
    const answer = result.data?.answer;

    const { publicUrl, relatedPages } = await getRelatedPages({
        answer,
        client: installationApiClient,
        environment,
    });

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
                ...PagesBlock({ title: 'More information', items: relatedPages, publicUrl }),
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

// function buildSearchSectionBlock(section: SearchSectionResult) {
// const title = section.title ? `* ${section.title.replace(/"/g, '')}* ` : ``;
// const body = ` - _${section.body.replace(/"/g, '').split('\n').join('').slice(0, 128)} _`;
// const text = `: hash: ${title}${body} `;
// return [
// {
// type: 'section',
// text: {
// type: 'mrkdwn',
// text,
// },
// accessory: {
// type: 'button',
// text: {
// type: 'plain_text',
// text: 'View',
// emoji: true,
// },
// url: section.urls.app,
// action_id: section.id,
// },
// },
// ];
// }
