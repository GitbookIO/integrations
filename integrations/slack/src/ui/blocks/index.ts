import { RevisionPage } from '@gitbook/api';

export function PageBlock(page: RevisionPage, publicUrl: string) {
    const url = `${publicUrl}/${page.slug}`;
    return {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: `*<${url}|:page_facing_up: ${page.title}>*`,
        },
    };
}

export function PagesBlock(params: {
    title?: string;
    items: Array<RevisionPage>;
    publicUrl: string;
}) {
    const { title, items, publicUrl } = params;

    const blocks = items.reduce<Array<any>>((acc, page) => {
        const pageResultBlock = PageBlock(page, publicUrl);
        // if (page.sections) {
        // const sectionBlocks = page.sections.map(buildSearchSectionBlock);
        acc.push(pageResultBlock);
        return acc;
    }, []);

    if (title) {
        return [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: title,
                },
            },
            ...blocks.flat(),
            {
                type: 'section',
                text: {
                    type: 'plain_text',
                    text: ' ',
                },
            },
        ];
    }
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
            text: query,
        },
        accessory: {
            type: 'button',
            text: {
                type: 'plain_text',
                text: 'Ask GitBook',
                emoji: true,
            },
            value: query,
            action_id: 'queryLens',
        },
    }));
}

export function ShareTools(blocks) {
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
                    value: JSON.stringify(blocks),
                    action_id: 'shareMessage',
                    style: 'primary',
                },
                // {
                // type: 'button',
                // text: {
                // type: 'plain_text',
                // text: 'Not Relevant',
                // emoji: true,
                // },
                // value: 'share',
                // action_id: 'setOutdated',
                // style: 'danger',
                // },
            ],
        },
    ];
}
