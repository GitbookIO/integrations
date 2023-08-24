import type { SearchAIAnswer, GitBookAPI, Revision, RevisionPage } from '@gitbook/api';

import {
    SlackInstallationConfiguration,
    SlackRuntimeEnvironment,
    SlackRuntimeContext,
} from '../configuration';
import { slackAPI } from '../slack';
import { PagesBlock, QueryDisplayBlock, ShareTools } from '../ui/blocks';
import { getInstallationApiClient } from './gitbook';

async function getRelatedPages(params: {
    pages?: SearchAIAnswer['pages'];
    client: GitBookAPI;
    environment: SlackRuntimeEnvironment;
}) {
    const { pages, client } = params;

    // collect all spaces from page results (and de-dupe)
    const allSpaces = pages.reduce((accum, page) => {
        accum.add(page.space);

        return accum;
    }, new Set<string>());

    // query for all Revisions (accounting for spaces that might not exist or any errors)
    const allRevisions: Array<Revision> = (
        await Promise.allSettled(
            Array.from(allSpaces).map((space) => client.spaces.getCurrentRevision(space))
        )
    ).reduce((accum, result) => {
        if (result.status === 'fulfilled') {
            accum.push(result.value.data);
        }
        return accum;
    }, []);

    // extract all related pages from the Revisions along with the related public URL
    const relatedPages: Array<{ publicUrl: string; page: RevisionPage }> = pages.reduce(
        (accum, page) => {
            const currentRevision = allRevisions.find((revision: Revision) =>
                revision.pages.find((revisionPage) => revisionPage.id === page.page)
            );

            if (currentRevision) {
                const publicUrl = currentRevision.urls.public || currentRevision.urls.app;
                const revisionPage = currentRevision.pages.find((page) => page.id === page.id);

                accum.push({
                    publicUrl,
                    page: revisionPage,
                });
            }

            return accum;
        },
        []
    );

    // filter related pages from current revision
    return relatedPages;
}

const capitalizeFirstLetter = (text: string) =>
    text?.trim().charAt(0).toUpperCase() + text?.trim().slice(1);

interface IQueryLens {
    channelId: string;
    teamId: string;
    text: string;
    context: SlackRuntimeContext;

    /* postEphemeral vs postMessage */
    messageType: 'ephemeral' | 'permanent';

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
    messageType,
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

    if (answer && answer.text) {
        const relatedPages = await getRelatedPages({
            pages: answer.pages,
            client,
            environment,
        });

        const answerText = capitalizeFirstLetter(answer.text);

        const header = text.length > 150 ? `${text.slice(0, 140)}...` : text;
        const blocks = [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: capitalizeFirstLetter(header),
                },
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: answerText,
                },
            },
            ...QueryDisplayBlock({ queries: answer?.followupQuestions ?? [] }),
            {
                type: 'divider',
            },
            ...PagesBlock({
                title: 'Sources',
                items: relatedPages,
            }),
        ];

        let slackData;
        if (messageType === 'ephemeral') {
            slackData = {
                method: 'POST',
                path: 'chat.postEphemeral',
                payload: {
                    channel: channelId,
                    blocks: [...blocks, ...ShareTools(text)],
                    // attachments: [{ color: '#346ddb', blocks: [...blocks, ...ShareTools(text)] }],
                    user: userId,

                    ...(threadId ? { thread_ts: threadId } : {}),
                },
            };
        } else {
            slackData = {
                method: 'POST',
                path: 'chat.postMessage',
                payload: {
                    channel: channelId,
                    ...(threadId ? { thread_ts: threadId } : {}),
                    blocks,
                    user: userId,
                    unfurl_links: false,
                },
            };
        }

        await slackAPI(context, slackData, {
            accessToken,
        });
    } else {
        const text =
            "I couldn't find anything related to your question. Perhaps try rephrasing it.";

        const slackData = {
            method: 'POST',
            path: 'chat.postEphemeral',
            payload: {
                channel: channelId,
                thread_ts: threadId,
                attachments: [
                    {
                        blocks: [
                            {
                                type: 'section',
                                text: {
                                    type: 'mrkdwn',
                                    text,
                                },
                            },
                        ],
                    },
                ],

                user: userId,
            },
        };

        await slackAPI(context, slackData, {
            accessToken,
        });
    }
}
