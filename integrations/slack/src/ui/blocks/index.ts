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
                type: 'divider',
            },
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: title,
                },
            },
            ...blocks.flat(),
        ];
    }
}

export function QueryDisplayBlock(params: { queries: Array<string> }) {
    const { queries } = params;

    if (queries?.length === 0) {
        return [];
    }

    return [
        {
            type: 'divider',
        },

        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: 'Some followup questions you might try:',
            },
        },

        {
            type: 'actions',
            elements: queries.map((question) => ({
                type: 'button',
                text: {
                    type: 'plain_text',
                    text: question,
                    emoji: true,
                },
                value: 'queryLens',
            })),
        },
    ];
}

// function buildSearchSectionBlock(section: SearchSectionResult) {
// const title = section.title ? `* ${section.title.replace(/"/g, '')}* ` : ``;
// const body = ` - _${section.body.replace(/"/g, '').split('\n').join('').slice(0, 128)} _`;
// const text = `: hash: ${title}${body} `;
// return [
// {
// type: 'section',
// text: {
// type: 'mrkdwn',
// text,
// },
// accessory: {
// type: 'button',
// text: {
// type: 'plain_text',
// text: 'View',
// emoji: true,
// },
// url: section.urls.app,
// action_id: section.id,
// },
// },
// ];
// }
