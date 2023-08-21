import type { SearchAIAnswer, GitBookAPI } from '@gitbook/api';

import {
    SlackInstallationConfiguration,
    SlackRuntimeEnvironment,
    SlackRuntimeContext,
} from '../configuration';
import { slackAPI } from '../slack';
import { PagesBlock, QueryDisplayBlock, ShareTools } from '../ui/blocks';
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

const capitalizeFirstLetter = (text: string) =>
    text?.trim().charAt(0).toUpperCase() + text?.trim().slice(1);

interface IQueryLens {
    channelId: string;
    teamId: string;
    text: string;
    context: SlackRuntimeContext;

    /* needed for postEphemeral */
    userId?: string;

    /* Get lens reply in thread */
    threadId?: string;
}

export async function queryLens({
    channelId,
    teamId,
    threadId,
    userId,
    text,
    context,
}: IQueryLens) {
    const { environment, api } = context;

    const { client, installation } = await getInstallationApiClient(api, teamId);
    if (!installation) {
        throw new Error('Installation not found');
    }

    // Authenticate as the installation
    const accessToken = (installation.configuration as SlackInstallationConfiguration)
        .oauth_credentials?.access_token;

    const result = await client.search.askQuery({ query: text });
    const answer = result.data?.answer;

    // do something if there's no answer from lens
    if (answer) {
        const { publicUrl, relatedPages } = await getRelatedPages({
            answer,
            client,
            environment,
        });

        const answerText = answer?.text
            ? capitalizeFirstLetter(answer.text)
            : "I couldn't find anything related to your question. Perhaps try rephrasing it.";

        const blocks = {
            method: 'POST',
            path: 'chat.postEphemeral',
            payload: {
                channel: channelId,
                thread_ts: threadId,
                attachments: [
                    {
                        color: '#346ddb',
                        blocks: [
                            {
                                type: 'header',
                                text: {
                                    type: 'plain_text',
                                    text: capitalizeFirstLetter(text),
                                },
                            },
                            {
                                type: 'section',
                                text: {
                                    type: 'mrkdwn',
                                    text: answerText,
                                },
                            },
                            ...PagesBlock({
                                title: 'More information',
                                items: relatedPages,
                                publicUrl,
                            }),
                            ...QueryDisplayBlock({ queries: answer?.followupQuestions ?? [] }),
                            {
                                type: 'divider',
                            },
                            ...ShareTools(),
                        ],
                    },
                ],

                user: userId,
            },
        };

        await slackAPI(context, blocks, {
            accessToken,
        });
    }
}
