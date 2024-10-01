import type { CopilotReference } from '@copilot-extensions/preview-sdk';

import type { IntegrationInstallation, SearchAIAnswer } from '@gitbook/api';

import { fetchGitHubInstallations } from './github';
import type { GitHubCopilotRuntimeContext } from './types';

/**
 * Handle a query from Copilot and stream the answer.
 */
export async function* streamCopilotResponse(
    ctx: GitHubCopilotRuntimeContext,
    githubToken: string,
    query: string | undefined
): AsyncIterable<string> {
    const githubInstallations = await fetchGitHubInstallations(githubToken);

    let gitbookInstallation: IntegrationInstallation | null = null;
    for (const githubInstallation of githubInstallations) {
        const { data: found } = await ctx.api.integrations.listIntegrationInstallations(
            ctx.environment.integration.name,
            {
                externalId: githubInstallation.id.toString(),
            }
        );

        if (found.items[0]) {
            gitbookInstallation = found.items[0];
            break;
        }
    }

    if (!gitbookInstallation) {
        yield createTextEvent(
            'GitBook For Copilot is not yet installed on your GitBook organization.\n\nTo get started, install the integration at https://app.gitbook.com/integrations/github-copilot\n\nThen come back and ask me anything!'
        );
        yield createDoneEvent();
        return;
    }

    if (!query) {
        yield createTextEvent('Get started by asking anything!');
        yield createDoneEvent();
        return;
    }

    const api = await ctx.api.createInstallationClient(
        ctx.environment.integration.name,
        gitbookInstallation.id
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
                            source.page
                        );

                        return {
                            type: source.type,
                            id: source.page,
                            data: source,
                            is_implicit: false,
                            metadata: {
                                display_name: page.title,
                                display_url: page.type === 'document' ? page.urls.app : undefined,
                            },
                        };
                    })
                )
            );
        } catch (e) {
            console.error(e);
        }
    }

    yield createDoneEvent();
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
