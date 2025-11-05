import { generateText, tool, ToolSet } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

import { queryAskAI } from './queryAskAI';
import { ingestSlackConversation } from './ingestConversation';
import type { SlackInstallationConfiguration, SlackRuntimeContext } from '../configuration';
import { slackAPI } from '../slack';
import { getIntegrationInstallationForTeam } from '../utils';
import { Logger } from '@gitbook/runtime';

const logger = Logger('slack:actions:inferUserIntent');

interface InferUserIntentParams {
    userMessage: string;
    channelId: string;
    threadTs: string;
    userId: string;
    teamId: string;
    authorization?: any;
}

/**
 * Infer the user's intent from a Slack app mention message using an OpenAI lightweight model
 * and automatically triggers the corresponding action.
 *
 * If the model cannot confidently determine the intent, the function returns a
 * clarification prompt that can be sent back to Slack.
 */
export async function inferUserIntentAndTriggerAction(
    params: InferUserIntentParams,
    context: SlackRuntimeContext,
) {
    const { userMessage, channelId, threadTs, teamId } = params;

    if (!context.environment.secrets.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not found');
    }

    const openai = createOpenAI({
        apiKey: context.environment.secrets.OPENAI_API_KEY,
    });

    const tools = getActionsTools(params, context);

    logger.debug('Infering user intent from message', userMessage);

    const result = await generateText({
        model: openai('gpt-5-nano'),
        messages: [
            {
                role: 'system',
                content: `
You are a Slack assistant designed to help users with their product documentation.

# Instructions:
1. Determine the user's intent from the message.
2. Select the appropriate tool from the available tools listed below based on the user's intent to handle the request.
3. If the intent is unclear, politely ask the user for clarification.
4. Only return freeform text asking for clarification to the user when no tool clearly applies.

# Tools:
- **askAIQuery**: Use when the user is clearly asking a question about their product, features, documentation, or content.
- **ingestConversation**: Use to ingest the current Slack thread so that any feedback or information from the conversation can be used to improve the user's documentation. Only call this tool when the user explicitly asks to ingest, learn from the thread to improve their docs.

# Rules:
- Always pick the tool that best matches the user's intent.
- Do not make assumptions; base your decision solely on the current message.
- Ask for clarification in a polite, friendly tone if unsure.
`,
            },
            {
                role: 'user',
                content: userMessage,
            },
        ],
        tools,
    });

    // If no tool was called, the AI couldn't get the user intent with confidence so ask for clarifications.
    if (!result.toolCalls || result.toolCalls.length === 0) {
        const installation = await getIntegrationInstallationForTeam(context, teamId);
        if (!installation) {
            throw new Error('Installation not found');
        }
        const accessToken = (installation.configuration as SlackInstallationConfiguration)
            .oauth_credentials?.access_token;

        logger.debug(
            'Could not infer intent based on the message, asking for clarification. AI result: ',
            JSON.stringify(result),
        );

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

        logger.debug('Actions called based on the user message:', JSON.stringify(result.toolCalls));

        return;
    }
}

function getActionsTools(
    params: InferUserIntentParams,
    slackRuntimeContext: SlackRuntimeContext,
): ToolSet {
    const { channelId, threadTs, userId, teamId, authorization } = params;

    const askAIQueryTool = tool({
        description: 'Answer questions about documentation or product usage.',
        inputSchema: z.object({
            queryText: z.string().describe('The user’s query to the AI'),
        }),
        execute: async ({ queryText }) => {
            return queryAskAI({
                channelId,
                threadId: threadTs,
                userId,
                teamId,
                messageType: 'permanent',
                queryText,
                context: slackRuntimeContext,
                authorization,
            });
        },
    });

    const ingestConversationTool = tool({
        description: 'Ingest this Slack conversation thread for improving documentation.',
        inputSchema: z.object({}),
        execute: async () => {
            return ingestSlackConversation({
                channelId,
                teamId,
                threadId: threadTs,
                userId,
                context: slackRuntimeContext,
                conversationToIngest: {
                    channelId,
                    messageTs: threadTs,
                },
            });
        },
    });

    return {
        askAIQuery: askAIQueryTool,
        ingestConversation: ingestConversationTool,
    };
}
