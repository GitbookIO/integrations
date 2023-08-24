import { RevisionPage } from '@gitbook/api';

export function PageBlock(page: RevisionPage, publicUrl: string) {
    const url = `${publicUrl}/${page.slug}`;
    return {
        type: 'mrkdwn',
        text: `*<${url}|:page_facing_up: ${page.title}>*`,
    };
}

export function PagesBlock(params: {
    title?: string;
    items: Array<{ publicUrl: string; page: RevisionPage }>;
}) {
    const { title, items } = params;

    const blocks = items.reduce<Array<any>>((acc, pageData) => {
        const pageResultBlock = PageBlock(pageData.page, pageData.publicUrl);
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
                type: 'plain_text',
                text: title,
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

export function ShareTools(text) {
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
                    action_id: 'queryLens:permanent',
                    style: 'primary',
                },
                // {
                //     type: 'button',
                //     text: {
                //         type: 'plain_text',
                //         text: 'Cancel',
                //         emoji: true,
                //     },
                //     value: 'share',
                //     action_id: 'deleteQueryMessage',
                // },
            ],
        },
    ];
}
