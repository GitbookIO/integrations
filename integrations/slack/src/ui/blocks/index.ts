import { RevisionPage } from '@gitbook/api';

export function PageBlock(page: RevisionPage, publicUrl: string) {
    const url = `${publicUrl}/${page.slug}`;
    return {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: `* <${url}|:page_facing_up: ${page.title}>* `,
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

export function QueryDisplayBlock(params: {
    queries: Array<string>;
    heading?: string;
    displayFullQuery?: boolean;
}) {
    const { queries, heading, displayFullQuery } = params;

    if (queries?.length === 0) {
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
                    text: heading ?? 'Some followup questions you might try:',
                },
            },
        ],

        // ...(displayFullQuery
        //     ? FollowUpQueryList({ queries })
        //     : [FollowUpQueryButtons({ queries })]),

        ...FollowUpQueryList({ queries }),
    ];
}

export function FollowUpQueryButtons(props: { queries: Array<string> }) {
    const { queries } = props;

    return {
        type: 'actions',
        elements: queries.map((question) => ({
            type: 'button',
            text: {
                type: 'plain_text',
                text: question, // note! there's a 76 character limit
                emoji: true,
            },
            value: question,
            action_id: 'queryLens',
        })),
    };
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
                text: 'Ask Lens',
                emoji: true,
            },
            value: query,
            action_id: 'queryLens',
        },
    }));

    // type: 'actions',
    // elements: queries.map((question) => ({
    //     type: 'button',
    //     text: {
    //         type: 'plain_text',
    //    text: question.slice(0, 75),
    //         emoji: true,
    //     },
    //     value: 'queryLens',
   })),
}
