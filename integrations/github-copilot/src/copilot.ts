import type { CopilotReference } from '@copilot-extensions/preview-sdk';

import type { SearchAIAnswer } from '@gitbook/api';

import { fetchGitHubInstallations } from './github';
import type { GitHubCopilotRuntimeContext } from './types';

/**
 * Copy to display when GitBook For Copilot is not installed as an integration on the GitBook side.
 * The user should install the integration (after creating a GitBook account if needed).
 */
const copyNoGitBookInstallation = `GitBook For Copilot is not yet installed on your GitBook organization.

To get started, install the integration at https://app.gitbook.com/integrations/github-copilot and authenticate with your GitHub account.

Then come back and ask me anything!`;

/**
 * Copy when the integration is installed, but not enabled for spaces.
 * It means no content can be fetched from GitBook.
 */
const copyNoSpaces = (
    orgId: string,
) => `GitBook For Copilot is installed on your GitBook organization, but it is not enabled for any spaces.

To get started, grant access to all spaces or specific ones at https://app.gitbook.com/o/${orgId}/integrations/github-copilot

Then come back and ask me anything!`;

/**
 * Copy to display when no query is provided.
 */
const copyNoQuery = `Get started by asking anything!`;

/**
 * Handle a query from Copilot and stream the answer.
 */
export async function* streamCopilotResponse(
    ctx: GitHubCopilotRuntimeContext,
    githubToken: string,
    query: string | undefined,
): AsyncIterable<string> {
    const gitbookInstallation = await findGitBookInstallation(ctx, githubToken);

    if (!gitbookInstallation) {
        yield createTextEvent(copyNoGitBookInstallation);
        yield createDoneEvent();
        return;
    }

    if (!gitbookInstallation.spaces) {
        yield createTextEvent(copyNoSpaces(gitbookInstallation.target.organization));
        yield createDoneEvent();
        return;
    }

    if (!query) {
        yield createTextEvent(copyNoQuery);
        yield createDoneEvent();
        return;
    }

    const api = await ctx.api.createInstallationClient(
        ctx.environment.integration.name,
        gitbookInstallation.id,
    );

    const stream = api.orgs.streamAskInOrganization(gitbookInstallation.target.organization, {
        query,
        format: 'markdown',
    });

    let previouslySent = '';
    let lastAnswer: SearchAIAnswer | null = null;
    for await (const event of stream) {
        if (
            event.type === 'answer' &&
            event.answer &&
            event.answer.answer &&
            'markdown' in event.answer.answer
        ) {
            lastAnswer = event.answer;
            const { markdown } = event.answer.answer;
            const toSend = markdown.slice(previouslySent.length);

            previouslySent = markdown;

            if (toSend) {
                yield createTextEvent(toSend);
            }
        }
    }

    const pageSources = lastAnswer?.sources.filter((source) => source.type === 'page') ?? [];
    if (pageSources.length > 0) {
        try {
            yield createReferencesEvent(
                await Promise.all(
                    pageSources.map(async (source) => {
                        const { data: page } = await api.spaces.getPageInRevisionById(
                            source.space,
                            source.revision,
                            source.page,
                        );

                        return {
                            type: source.type,
                            id: source.page,
                            data: source as any,
                            is_implicit: false,
                            metadata: {
                                display_name: page.title,
                                display_url: page.type === 'document' ? page.urls.app : undefined,
                            },
                        };
                    }),
                ),
            );
        } catch (e) {
            console.error(e);
        }
    }

    yield createDoneEvent();
}

/**
 * Find the GitBook installations related to a current user.
 */
async function findGitBookInstallation(ctx: GitHubCopilotRuntimeContext, githubToken: string) {
    const githubInstallations = await fetchGitHubInstallations(githubToken);

    const found = await Promise.all(
        githubInstallations.map(async (githubInstallation) => {
            const { data: found } = await ctx.api.integrations.listIntegrationInstallations(
                ctx.environment.integration.name,
                {
                    externalId: githubInstallation.id.toString(),
                },
            );

            if (found.items[0]) {
                return found.items[0];
            }
        }),
    );

    return found.find((installation) => !!installation);
}

function createTextEvent(message: string): string {
    return createData({
        choices: [
            {
                index: 0,
                delta: { content: message, role: 'assistant' },
            },
        ],
    });
}

function createDoneEvent(): string {
    const data = {
        choices: [
            {
                index: 0,
                finish_reason: 'stop',
                delta: { content: null },
            },
        ],
    };
    return `${createData(data)}data: [DONE]\n\n`;
}

function createReferencesEvent(references: CopilotReference[]): string {
    const event = 'copilot_references';
    const data = references;
    return `event: ${event}\n${createData(data)}`;
}

function createData(data: any) {
    return `data: ${JSON.stringify(data)}\n\n`;
}
