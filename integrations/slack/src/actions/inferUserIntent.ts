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

    const installation = await getIntegrationInstallationForTeam(context, teamId);
    if (!installation) {
        throw new Error('Installation not found');
    }
    const installationConfiguration = installation.configuration as SlackInstallationConfiguration;
    const accessToken = installationConfiguration.oauth_credentials?.access_token;
    const accessTokenScopes = installationConfiguration.oauth_credentials?.requested_scopes || [];

    // Installations created before the Docs Agents feature was released may not have a token with the
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

    const result = await generateText({
        model: openai('gpt-5-nano'),
        messages: [
            {
                role: 'system',
                content: `
You are a Slack assistant designed to help users with their product documentation.

# Instructions
1. Determine the user's intent from the message.
2. Select the appropriate tool from the available tools listed below based on the user's intent to handle the request.
3. If the intent is unclear, politely ask the user for clarification.
4. Only return freeform text asking for clarification to the user when no tool clearly applies.

# Tools
- **askAIQuery**: Use when the user is clearly asking a question about their product, features, documentation, or content.
- **ingestConversation**: Use to ingest the current Slack thread so that any feedback or discussion can be used to improve the user's documentation.  
  - When a user refers to “this feedback,” “this conversation,” or similar phrases without specifying details, infer that they mean the feedback in the current Slack thread.  
  - Do **not** ask for clarification unless it’s genuinely ambiguous (for example, if the user mentions feedback from another source).

# Rules
- Always pick the tool that best matches the user's intent.
- Be concise and polite when asking for clarification.
- Make reasonable inferences from context — for example, “this feedback” refers to the current thread.
- Base decisions solely on the current message and its immediate context.
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
        logger.debug(
            'Could not infer intent based on the message, asking for clarification. AI result: ',
            JSON.stringify(result.response),
        );

        const assistantMessages = result.response.messages
            .filter((msg) => msg.role === 'assistant')
            .flatMap((msg) => {
                const { content } = msg;
                if (Array.isArray(content)) {
                    return content;
                }
                return [
                    {
                        type: 'text',
                        text: content,
                    },
                ] as const;
            })
            .filter((content) => content && content.type === 'text');
        const lastAssistantMessage = assistantMessages.pop();

        await slackAPI(
            context,
            {
                method: 'POST',
                path: 'chat.postMessage',
                payload: {
                    channel: channelId,
                    thread_ts: threadTs,
                    text: lastAssistantMessage
                        ? lastAssistantMessage.text
                        : `⚠️ Oops, I didn’t quite catch what you want me to do. Could you clarify?`,
                },
            },
            { accessToken },
        );

        return;
    }

    logger.debug('Actions called based on the user message:', JSON.stringify(result.toolCalls));
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
