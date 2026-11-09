import { queryAskAI } from './queryAskAI';
import type { SlackInstallationConfiguration, SlackRuntimeContext } from '../configuration';
import { slackAPI } from '../slack';
import { getIntegrationInstallationForTeam } from '../utils';
import { Logger } from '@gitbook/runtime';

const logger = Logger('slack:actions:inferUserIntent');

const ROUTING_CONTEXT =
    'You are a Slack assistant designed to help users with their product documentation.';
const IS_DOCS_QUESTION =
    'Is the user clearly asking a question about their product, features, documentation, or content?';
const DOCS_QUESTION_THRESHOLD = 0.5;

interface InferUserIntentParams {
    userMessage: string;
    channelId: string;
    threadTs: string;
    userId: string;
    teamId: string;
    authorization?: any;
}

// Answers documentation questions with Ask AI and asks for clarification otherwise.
export async function inferUserIntentAndTriggerAction(
    params: InferUserIntentParams,
    context: SlackRuntimeContext,
) {
    const { userMessage, channelId, threadTs, userId, teamId, authorization } = params;

    const apiKey = context.environment.secrets.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('OpenAI API key not found');
    }

    logger.debug('Infering user intent from message', userMessage);

    const [accessToken, isDocsQuestion] = await Promise.all([
        (async () => {
            const installation = await getIntegrationInstallationForTeam(context, teamId);
            if (!installation) {
                throw new Error('Installation not found');
            }
            const installationConfiguration =
                installation.configuration as SlackInstallationConfiguration;
            const accessToken = installationConfiguration.oauth_credentials?.access_token;
            const accessTokenScopes =
                installationConfiguration.oauth_credentials?.requested_scopes || [];

            // Installations created before the GitBook Agent feature was released may not have a token with the
            // required scope to call this API. Since this is non-blocking, we skip the API call if the token lacks
            // the necessary permission.
            if (accessTokenScopes.includes('assistant:write')) {
                await slackAPI(
                    context,
                    {
                        method: 'POST',
                        path: 'assistant.threads.setStatus',
                        payload: {
                            channel_id: channelId,
                            thread_ts: threadTs,
                            status: 'is working on your request...',
                            loading_messages: [
                                'Reading your message…',
                                'Understanding your request…',
                                'Determining the best action…',
                            ],
                        },
                    },
                    { accessToken },
                );
            }
            return accessToken;
        })(),
        isDocsQuestionMessage({ apiKey, userMessage }),
    ]);

    if (isDocsQuestion) {
        await queryAskAI({
            channelId,
            threadId: threadTs,
            userId,
            teamId,
            messageType: 'permanent',
            queryText: userMessage,
            context,
            authorization,
        });
        return;
    }

    await slackAPI(
        context,
        {
            method: 'POST',
            path: 'chat.postMessage',
            payload: {
                channel: channelId,
                thread_ts: threadTs,
                text: `⚠️ Oops, I didn’t quite catch what you want me to do. Could you clarify?`,
            },
        },
        { accessToken },
    );
}

async function isDocsQuestionMessage({
    apiKey,
    userMessage,
}: {
    apiKey: string;
    userMessage: string;
}) {
    const response = await fetch('https://api.openai.com/v1/decisions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-6-luna',
            input: [
                { role: 'system', content: ROUTING_CONTEXT },
                { role: 'user', content: userMessage },
            ],
            questions: [
                { type: 'predicate', name: 'docs_question', instructions: IS_DOCS_QUESTION },
            ],
        }),
    });
    if (!response.ok) {
        throw new Error(
            `OpenAI Decisions API failed with ${response.status}: ${await response.text()}`,
        );
    }

    const { answers } = (await response.json()) as {
        answers: Array<{ type: 'predicate' | 'refusal'; probability?: number }>;
    };
    logger.debug('Documentation question decision:', JSON.stringify(answers[0]));
    return (
        answers[0]?.type === 'predicate' && (answers[0].probability ?? 0) >= DOCS_QUESTION_THRESHOLD
    );
}
