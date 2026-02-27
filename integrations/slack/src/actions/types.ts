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
