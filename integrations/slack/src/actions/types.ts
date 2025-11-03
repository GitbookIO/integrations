import { SlackRuntimeContext } from '../configuration';

interface ActionBaseParams {
    channelId: string;
    channelName?: string;
    responseUrl?: string;
    teamId: string;

    context: SlackRuntimeContext;

    /* needed for postEphemeral */
    userId?: string;

    /* Get reply in thread */
    threadId?: string;
}

interface IngestSlackConversationWithConversation extends ActionBaseParams {
    conversationToIngest: {
        channelId: string;
        messageTs: string;
    };
    text?: never;
}

interface IngestSlackConversationWithText extends ActionBaseParams {
    text: string;
    conversationToIngest?: never;
}

export type IngestSlackConversationActionParams =
    | IngestSlackConversationWithConversation
    | IngestSlackConversationWithText;

export interface AskAIActionParams extends ActionBaseParams {
    queryText: string;

    /* postEphemeral vs postMessage */
    messageType: 'ephemeral' | 'permanent';

    authorization?: string;
}

export type IntegrationTaskType = 'ask:ai';

export type BaseIntegrationTask<Type extends IntegrationTaskType, Payload extends object> = {
    type: Type;
    payload: Payload;
};

export type IntegrationTaskAskAI = BaseIntegrationTask<
    'ask:ai',
    {
        query: string;
        organizationId: string;
        installationId: string;
        accessToken: string | undefined;
    } & Omit<AskAIActionParams, 'context'>
>;

export type IntegrationTask = IntegrationTaskAskAI;
