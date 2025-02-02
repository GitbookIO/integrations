import { RelatedSource } from '../../actions/';

// Slack only encodes these specific characters so we need to remove them in the output (specifically used for inputs to slack)
export function decodeSlackEscapeChars(text: string) {
    return [
        ['&amp;', '&'],
        ['&lt;', '<'],
        ['&gt;', '>'],
    ].reduce((accum, entityMap) => {
        return accum.split(entityMap[0]).join(entityMap[1]);
    }, text);
}

export function SourceBlock(source: RelatedSource) {
    const nonRevisionPublicUrl = source.sourceUrl.split('~/')[0];
    const url = `${nonRevisionPublicUrl}${source.page.path || ''}`;
    return {
        type: 'mrkdwn',
        text: `*<${url}|:spiral_note_pad: ${source.page.title}>*`,
    };
}

export function SourcesBlock(params: { title?: string; items: Array<RelatedSource> }) {
    const { title, items } = params;

    const blocks = items.reduce<Array<any>>((acc, pageData) => {
        const pageResultBlock = SourceBlock(pageData);
        acc.push(pageResultBlock);

        return acc;
    }, []);

    if (blocks.length === 0) {
        return [];
    }

    return [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `*${title}:*`,
            },
        },
        {
            type: 'context',
            elements: blocks.slice(0, 9), // block kit limit of 10
        },
    ];
}

export function ConversationSavedBlock(snippetsUrl: string) {
    return [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `:white_check_mark: Conversation saved in <${snippetsUrl}|GitBook>`,
            },
        },
    ];
}

export function QueryDisplayBlock(params: { queries: Array<string>; heading?: string }) {
    const { queries, heading } = params;

    if (queries.length === 0) {
        return [];
    }

    return [
        ...[
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: heading ?? '*Want to know more? Try these questions:*',
                },
            },
        ],

        ...FollowUpQueryList({ queries }),
    ];
}

export function FollowUpQueryList(props: { queries: Array<string> }) {
    const { queries } = props;

    return queries.map((query) => ({
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: `_${query}_`,
        },
        accessory: {
            type: 'button',
            text: {
                type: 'plain_text',
                text: 'Ask GitBook',
                emoji: true,
            },
            value: query,
            action_id: 'queryAskAI:ephemeral',
        },
    }));
}

export function ShareTools(text: string) {
    return [
        {
            type: 'actions',
            elements: [
                {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Share',
                        emoji: true,
                    },
                    value: text,
                    action_id: 'queryAskAI:permanent', // sharing requeries for the same question verbatim which will then be pulled from cache
                    style: 'primary',
                },
            ],
        },
    ];
}

export const Spacer = {
    type: 'section',
    text: {
        type: 'plain_text',
        text: '\n\n\n ',
    },
};
