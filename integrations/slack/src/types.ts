// Slack Block Kit Types
export type TTextType = 'plain_text' | 'mrkdwn';

export type TTextField = {
    type: TTextType;
    text: string;
    emoji?: boolean;
};

export type TButtonElement = {
    type: 'button';
    text: TTextField;
    url?: string;
    action_id: string;
    style?: 'primary' | 'danger';
};

export type TBlock =
    | { type: 'section'; text?: TTextField; fields?: TTextField[]; accessory?: unknown }
    | { type: 'header'; text: TTextField }
    | { type: 'context'; elements: TTextField[] }
    | { type: 'divider' }
    | { type: 'actions'; elements: TButtonElement[] };
