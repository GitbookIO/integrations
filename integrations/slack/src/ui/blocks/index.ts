import { RevisionPage } from '@gitbook/api';

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

export function PageBlock(page: RevisionPage, sourceUrl: string) {
    // TODO: note for review. is this the best way to do this?
    const nonRevisionPublicUrl = sourceUrl.split('~/')[0];
    const url = `${nonRevisionPublicUrl}${page.path}`;
    return {
        type: 'mrkdwn',
        text: `*<${url}|:spiral_note_pad: ${page.title}>*`,
    };
}

export function PagesBlock(params: {
    title?: string;
    items: Array<{ sourceUrl: string; page: RevisionPage }>;
}) {
    const { title, items } = params;

    const blocks = items.reduce<Array<any>>((acc, pageData) => {
        const pageResultBlock = PageBlock(pageData.page, pageData.sourceUrl);
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

export function GeneratedDocLinkBlock(props: { url: string }) {
    const { url } = props;

    return [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `:white_check_mark: Conversation saved in <${url}|GitBook>`,
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
                type: 'divider',
            },

            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: heading ?? '*Some followup questions you might want to try:*',
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
            action_id: 'queryLens:ephemeral',
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
                        text: 'Send',
                        emoji: true,
                    },
                    value: text,
                    action_id: 'queryLens:permanent', // sharing requeries for the same question verbatim which will then be pulled from cache
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
