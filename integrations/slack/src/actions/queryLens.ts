import type {
    SearchAIAnswer,
    GitBookAPI,
    Revision,
    RevisionPage,
    RevisionPageGroup,
} from '@gitbook/api';

import {
    SlackInstallationConfiguration,
    SlackRuntimeEnvironment,
    SlackRuntimeContext,
} from '../configuration';
import { acknowledgeQuery } from '../middlewares';
import { slackAPI } from '../slack';
import { PagesBlock, QueryDisplayBlock, ShareTools, decodeSlackEscapeChars, Spacer } from '../ui';
import { getInstallationApiClient, stripBotName, stripMarkdown } from '../utils';

// Recursively extracts all pages from a collection of RevisionPages
function extractAllPages(rootPages: Array<RevisionPage>) {
    const result: Array<RevisionPage> = [];

    function recurse(pages: Array<RevisionPage>) {
        for (const page of pages) {
            result.push(page);
            if ((page as RevisionPageGroup).pages?.length > 0) {
                recurse((page as RevisionPageGroup).pages);
            }
        }
    }

    recurse(rootPages);

    return result;
}

/*
 * Pulls out the top related pages from page IDs returned from Lens and resolves them using a provided GitBook API client.
 */
async function getRelatedPages(params: {
    pages?: SearchAIAnswer['pages'];
    client: GitBookAPI;
    environment: SlackRuntimeEnvironment;
}) {
    const { pages, client } = params;

    if (!pages || pages.length === 0) {
        return [];
    }

    // return top 3 pages (pages are ordered by score by default)
    const sourcePages = pages.slice(0, 3);

    // collect all spaces from page results (and de-dupe)
    const allSpaces = sourcePages.reduce((accum, page) => {
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
    const relatedPages: Array<{ sourceUrl: string; page: RevisionPage }> = sourcePages.reduce(
        (accum, page) => {
            // TODO: we can probably combine finding the currentRevision with extracting the appropriate page
            const currentRevision = allRevisions.find((revision: Revision) =>
                extractAllPages(revision.pages).find(
                    (revisionPage) => revisionPage.id === page.page
                )
            );

            if (currentRevision) {
                const sourceUrl = currentRevision.urls.public || currentRevision.urls.app;

                const allRevisionPages = extractAllPages(currentRevision.pages);
                const revisionPage = allRevisionPages.find((revPage) => revPage.id === page.page);

                accum.push({
                    sourceUrl,
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

export interface IQueryLens {
    channelId: string;
    channelName?: string;
    responseUrl?: string;
    teamId: string;
    text: string;
    context: SlackRuntimeContext;

    /* postEphemeral vs postMessage */
    messageType: 'ephemeral' | 'permanent';

    /* needed for postEphemeral */
    userId?: string;

    /* Get lens reply in thread */
    threadId?: string;

    authorization?: string;
}

/*
 * Queries GitBook Lens via the GitBook API and posts the answer in the form of Slack UI Blocks back to the original channel/conversation/thread.
 */
export async function queryLens({
    channelId,
    teamId,
    threadId,
    userId,
    text,
    messageType,
    context,
    authorization,

    responseUrl,
    channelName,
}: IQueryLens) {
    const { environment, api } = context;
    const { client, installation } = await getInstallationApiClient(api, teamId);
    if (!installation) {
        throw new Error('Installation not found');
    }
    // Authenticate as the installation
    const accessToken = (installation.configuration as SlackInstallationConfiguration)
        .oauth_credentials?.access_token;

    // strip a bot name if the user_id from the request is present in the query itself (specifically for a bot mention)
    // @ts-ignore
    const parsedQuery = stripMarkdown(stripBotName(text, authorization?.user_id));

    // async acknowledge the request to the end user early
    acknowledgeQuery({
        context,
        text: parsedQuery,
        userId,
        threadId,
        channelId,
        responseUrl,
        accessToken,
        messageType,
    });

    const result = await client.search.askQuery({ query: parsedQuery });
    const answer: SearchAIAnswer = result.data?.answer;

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
                    text: capitalizeFirstLetter(decodeSlackEscapeChars(header)),
                },
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: answerText,
                },
            },
            {
                type: 'divider',
            },
            ...PagesBlock({
                title: 'Sources',
                items: relatedPages,
            }),
            {
                type: 'divider',
            },
            ...QueryDisplayBlock({ queries: answer?.followupQuestions ?? [] }),
            Spacer,
        ];

        let slackData;
        if (messageType === 'ephemeral') {
            slackData = {
                method: 'POST',
                path: 'chat.postEphemeral',
                responseUrl,
                payload: {
                    channel: channelId,
                    blocks: [
                        ...blocks,
                        ...(channelName !== 'directmessage' ? ShareTools(text) : []),
                    ],
                    user: userId,

                    ...(threadId ? { thread_ts: threadId } : {}),

                    replace_original: 'false',
                },
            };
        } else {
            slackData = {
                method: 'POST',
                path: 'chat.postMessage',
                responseUrl,
                payload: {
                    channel: channelId,
                    ...(threadId ? { thread_ts: threadId } : {}),
                    blocks,
                    user: userId,
                    unfurl_links: false,

                    response_type: 'in_channel',
                    replace_original: 'false',
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
            responseUrl,
            payload: {
                channel: channelId,
                thread_ts: threadId,
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text,
                        },
                    },
                    Spacer,
                ],

                user: userId,
                response_type: 'in_channel',
                replace_original: 'false',
            },
        };

        await slackAPI(context, slackData, {
            accessToken,
        });
    }
}
