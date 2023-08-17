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
        ];
    }
}
