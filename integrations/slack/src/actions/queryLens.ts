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
import {
    PagesBlock,
    QueryDisplayBlock,
    ShareTools,
    decodeSlackEscapeChars,
    Spacer,
} from '../ui/blocks';
import { stripBotName, stripMarkdown } from '../utils';

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

async function getRelatedPages(params: {
    pages?: SearchAIAnswer['pages'];
    client: GitBookAPI;
    environment: SlackRuntimeEnvironment;
}) {
    const { pages, client } = params;

    if (!pages || pages.length === 0) {
        return [];
    }

    // pull out the highest matches as low matches are fairly useless
    const highScorePages = pages.filter((page) => page.matchScore >= 0.8).slice(0, 10); // only show up to 10 GOOD results
    // if there are no high scores, return top 3 as it still would have pulled data from the related pages
    const sourcePages = highScorePages.length > 0 ? highScorePages : pages.slice(0, 3);

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
    const relatedPages: Array<{ publicUrl: string; page: RevisionPage }> = sourcePages.reduce(
        (accum, page) => {
            // TODO: we can probably combine finding the currentRevision with extracting the appropriate page
            const currentRevision = allRevisions.find((revision: Revision) =>
                extractAllPages(revision.pages).find(
                    (revisionPage) => revisionPage.id === page.page
                )
            );

            if (currentRevision) {
                const publicUrl = currentRevision.urls.public || currentRevision.urls.app;

                const allRevisionPages = extractAllPages(currentRevision.pages);
                const revisionPage = allRevisionPages.find((revPage) => revPage.id === page.page);

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

export interface IQueryLens {
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

    authorization: string;
}

async function getInstallationApiClient(api, externalId: string) {
    const {
        data: { items: installations },
    } = await api.integrations.listIntegrationInstallations('slack', {
        externalId,

        // we need to pass installation.target.organization
    });

    // won't work for multiple installations accross orgs and same slack team
    const installation = installations[0];
    if (!installation) {
        return {};
    }

    // Authentify as the installation
    const installationApiClient = await api.createInstallationClient('slack', installation.id);

    return { client: installationApiClient, installation };
}

export async function queryLens({
    channelId,
    teamId,
    threadId,
    userId,
    text,
    messageType,
    context,
    authorization,
}: IQueryLens) {
    const { environment, api } = context;
    const { client, installation } = await getInstallationApiClient(api, teamId);
    if (!installation) {
        throw new Error('Installation not found');
    }
    // Authenticate as the installation
    const accessToken = (installation.configuration as SlackInstallationConfiguration)
        .oauth_credentials?.access_token;

    const parsedQuery = stripMarkdown(stripBotName(text, authorization?.user_id));

    // async acknowledge the request to the end user early
    acknowledgeQuery({
        context,
        text: parsedQuery,
        userId,
        threadId,
        channelId,
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
            ...QueryDisplayBlock({ queries: answer?.followupQuestions ?? [] }),
            {
                type: 'divider',
            },
            ...PagesBlock({
                title: 'Sources',
                items: relatedPages,
            }),
            Spacer,
        ];

        let slackData;
        if (messageType === 'ephemeral') {
            slackData = {
                method: 'POST',
                path: 'chat.postEphemeral',
                payload: {
                    channel: channelId,
                    blocks: [...blocks, ...ShareTools(text)],
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
            },
        };

        await slackAPI(context, slackData, {
            accessToken,
        });
    }
}
