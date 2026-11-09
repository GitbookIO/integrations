import { createOpenAI } from '@ai-sdk/openai';
import { experimental_decide, Experimental_DecisionRefusalError } from 'ai';

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
// Ask AI only answers questions; it cannot act on the user's behalf.
const DOCS_QUESTION_CRITERIA = {
    true: 'The user wants an answer or an explanation, including how to do something themselves.',
    false: 'The user asks the assistant itself to perform an action, such as creating, changing or sending something, or the message is not a question.',
};
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
    const openai = createOpenAI({ apiKey });
    try {
        const { answers } = await experimental_decide({
            model: openai.decisionModel('gpt-6-luna'),
            // The context must be in the state: in the instructions, real questions score near 0.
            state: { context: ROUTING_CONTEXT, message: userMessage },
            questions: {
                docsQuestion: {
                    type: 'boolean',
                    instructions: IS_DOCS_QUESTION,
                    criteria: DOCS_QUESTION_CRITERIA,
                },
            },
        });
        logger.debug('Documentation question probability:', answers.docsQuestion.probability);
        return answers.docsQuestion.probability >= DOCS_QUESTION_THRESHOLD;
    } catch (error) {
        if (Experimental_DecisionRefusalError.isInstance(error)) {
            return false;
        }
        throw error;
    }
}
