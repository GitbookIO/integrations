// Slack Block Kit Types
export type TTextType = 'plain_text' | 'mrkdwn';

export type TTextField = {
    type: TTextType;
    text: string;
    emoji?: boolean;
};

export type TSectionBlock = {
    type: 'section';
    text?: TTextField;
    fields?: TTextField[];
    accessory?: unknown;
};

export type THeaderBlock = {
    type: 'header';
    text: TTextField;
};

export type TContextBlock = {
    type: 'context';
    elements: TTextField[];
};

export type TDividerBlock = {
    type: 'divider';
};

export type TButtonElement = {
    type: 'button';
    text: TTextField;
    url?: string;
    action_id: string;
    style?: 'primary' | 'danger';
};

export type TActionsBlock = {
    type: 'actions';
    elements: TButtonElement[];
};

export type TBlock = TSectionBlock | THeaderBlock | TContextBlock | TDividerBlock | TActionsBlock;
