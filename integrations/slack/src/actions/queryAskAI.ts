import type {
    SearchAIAnswer,
    GitBookAPI,
    Revision,
    RevisionPage,
    RevisionPageGroup,
    SearchAIAnswerSource,
} from '@gitbook/api';

import {
    SlackInstallationConfiguration,
    SlackRuntimeEnvironment,
    SlackRuntimeContext,
} from '../configuration';
import { slackAPI } from '../slack';
import { QueryDisplayBlock, ShareTools, decodeSlackEscapeChars, Spacer, SourcesBlock } from '../ui';
import { getInstallationApiClient, stripBotName, stripMarkdown } from '../utils';
import { Logger } from '@gitbook/runtime';

const logger = Logger('slack:queryAskAI');

export type RelatedSource = {
    id: string;
    sourceUrl: string;
    page: { path?: string; title: string };
};

export interface IQueryAskAI {
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

    /* Get AskAI reply in thread */
    threadId?: string;

    authorization?: string;
}

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

const capitalizeFirstLetter = (text: string) =>
    text?.trim().charAt(0).toUpperCase() + text?.trim().slice(1);

/*
 * Pulls out the top related pages from page IDs returned from AskAI and resolves them using a provided GitBook API client.
 */
async function getRelatedSources(params: {
    sources?: SearchAIAnswer['sources'];
    client: GitBookAPI;
    environment: SlackRuntimeEnvironment;
    organization: string;
}): Promise<RelatedSource[]> {
    const { sources, client, organization } = params;

    if (!sources || sources.length === 0) {
        return [];
    }

    // return top 3 sources (sources are ordered by score by default)
    const topSources = sources.slice(0, 3);
    // collect all spaces from page results (and de-dupe)
    const allSpaces = topSources.reduce((accum, source) => {
        if (source.type === 'page') {
            accum.add(source.space);
        }

        return accum;
    }, new Set<string>());

    // query for all Revisions (accounting for spaces that might not exist or any errors)
    const allRevisions = (
        await Promise.allSettled(
            Array.from(allSpaces).map((space) => client.spaces.getCurrentRevision(space)),
        )
    ).reduce((accum, result) => {
        if (result.status === 'fulfilled') {
            accum.push(result.value.data);
        }
        return accum;
    }, [] as Array<Revision>);

    const getResolvedPage = (page: SearchAIAnswerSource & { type: 'page' }) => {
        // TODO: we can probably combine finding the currentRevision with extracting the appropriate page
        const currentRevision = allRevisions.find((revision: Revision) =>
            extractAllPages(revision.pages).find((revisionPage) => revisionPage.id === page.page),
        );

        if (currentRevision) {
            const sourceUrl = currentRevision.urls.public || currentRevision.urls.app;

            const allRevisionPages = extractAllPages(currentRevision.pages);
            const revisionPage = allRevisionPages.find((revPage) => revPage.id === page.page);

            if (!revisionPage || revisionPage.type !== 'document') {
                return null;
            }

            return {
                id: page.page,
                sourceUrl,
                page: { path: revisionPage.path, title: revisionPage.title },
            } as RelatedSource;
        }
    };

    // extract all related sources from the Revisions along with the related public URL
    const relatedSources = topSources.reduce((accum, source) => {
        switch (source.type) {
            case 'page':
                const resolvedPage = getResolvedPage(source);
                if (resolvedPage) {
                    accum.push(resolvedPage);
                }
                break;
        }

        return accum;
    }, [] as Array<RelatedSource>);

    // filter related sources from current revision
    return relatedSources;
}

/*
 * Queries GitBook AskAI via the GitBook API and posts the answer in the form of Slack UI Blocks back to the original channel/conversation/thread.
 */
export async function queryAskAI({
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
}: IQueryAskAI) {
    const { environment, api } = context;

    const askText = `_Asking: ${stripMarkdown(text)}_`;
    logger.info(`${askText} (channelId: ${channelId}, teamId: ${teamId}, userId: ${userId})`);

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
    slackAPI(
        context,
        {
            method: 'POST',
            path: messageType === 'ephemeral' ? 'chat.postEphemeral' : 'chat.postMessage',
            responseUrl,
            payload: {
                channel: channelId,
                text: askText,
                ...(userId ? { user: userId } : {}), // actually shouldn't be optional
                ...(threadId ? { thread_ts: threadId } : {}),
            },
        },
        {
            accessToken,
        },
    );

    const result = await client.orgs.askInOrganization(
        installation.target.organization,
        {
            query: parsedQuery,
        },
        {
            format: 'markdown',
        },
    );
    const answer = result.data?.answer;

    const messageTypePath = messageType === 'ephemeral' ? 'chat.postEphemeral' : 'chat.postMessage';

    if (answer && answer.answer) {
        if (!('markdown' in answer.answer)) {
            throw new Error('Answer is not in markdown format');
        }

        logger.debug(`Answer has ${answer.answer.markdown.length} characters`);

        const answerText = capitalizeFirstLetter(answer.answer.markdown);

        const relatedSources = await getRelatedSources({
            sources: answer.sources,
            client,
            environment,
            organization: installation.target.organization,
        });

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
            ...SourcesBlock({
                title: 'Sources',
                items: relatedSources,
            }),
            Spacer,
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
                    unfurl_links: false,
                    unfurl_media: false,
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
                    unfurl_media: false,

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
            path: messageTypePath,
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
                ...(messageType === 'permanent' ? { response_type: 'in_channel' } : {}),
                replace_original: 'false',
                unfurl_links: false,
                unfurl_media: false,
            },
        };

        await slackAPI(context, slackData, {
            accessToken,
        });
    }
}
