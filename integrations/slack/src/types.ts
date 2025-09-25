import type { IQueryAskAI } from './actions';

// Slack Block Kit Types
export type SlackTextType = 'plain_text' | 'mrkdwn';

export type SlackTextField = {
    type: SlackTextType;
    text: string;
    emoji?: boolean;
};

export type SlackButtonElement = {
    type: 'button';
    text: SlackTextField;
    url?: string;
    action_id: string;
    style?: 'primary' | 'danger';
};

export type SlackBlock =
    | { type: 'section'; text?: SlackTextField; fields?: SlackTextField[]; accessory?: unknown }
    | { type: 'header'; text: SlackTextField }
    | { type: 'context'; elements: SlackTextField[] }
    | { type: 'divider' }
    | { type: 'actions'; elements: SlackButtonElement[] };

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
    } & Omit<IQueryAskAI, 'context'>
>;

export type IntegrationTask = IntegrationTaskAskAI;
