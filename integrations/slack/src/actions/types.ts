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
    /**
     * Used when the ingestion originates from a Slack conversation shortcut.
     * The target conversation in this case is both the conversation to ingest
     * and the one where notifications are sent.
     * Identified by the `channelId` and `messageTs` values.
     */
    conversationToIngest: {
        channelId: string;
        messageTs: string;
    };
    /**
     * Not present when the ingestion is triggered directly from the conversation shortcut context.
     */
    text?: never;
}

interface IngestSlackConversationWithText extends ActionBaseParams {
    /**
     * Used when the ingestion originates from outside the conversation to ingest,
     * for example from a slash command that includes a permalink in the command text.
     * The `text` field contains the permalink identifying the target conversation.
     */
    text: string;
    /**
     * Not present when the ingestion is triggered using a text or link reference.
     */
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
