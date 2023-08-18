import type { SearchAIAnswer, GitBookAPI } from '@gitbook/api';

import {
    SlackInstallationConfiguration,
    SlackRuntimeEnvironment,
    SlackRuntimeContext,
} from '../configuration';
import { slackAPI } from '../slack';
import { PagesBlock, QueryDisplayBlock } from '../ui/blocks';
import { getInstallationApiClient } from './gitbook';

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

interface IQueryLens {
    channelId: string;
    teamId: string;
    text: string;
    context: SlackRuntimeContext;
}

export async function queryLens({ channelId, teamId, text, context }: IQueryLens) {
    const { environment, api } = context;

    console.log('queryLens called', channelId, teamId, text);
    const { client, installation } = await getInstallationApiClient(api, teamId);
    if (!installation) {
        throw new Error('Installation not found');
    }

    // Authenticate as the installation
    const accessToken = (installation.configuration as SlackInstallationConfiguration)
        .oauth_credentials?.access_token;

    await slackAPI(
        context,
        {
            method: 'POST',
            path: 'chat.postMessage',
            payload: {
                channel: channelId,
                text: `_Asking GitBook Lens: ${text}_`,
            },
        },
        {
            accessToken,
        }
    );

    const result = await client.search.askQuery({ query: text });
    const answer = result.data?.answer;

    const { publicUrl, relatedPages } = await getRelatedPages({
        answer,
        client,
        environment,
    });

    const blocks = {
        method: 'POST',
        path: 'chat.postMessage',
        payload: {
            channel: channelId,
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
                ...PagesBlock({ title: 'More information', items: relatedPages, publicUrl }),
                ...QueryDisplayBlock({ queries: answer?.followupQuestions }),
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
