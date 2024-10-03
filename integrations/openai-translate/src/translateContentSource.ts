import { createContentSource } from '@gitbook/runtime';
import { OpenAITranslateRuntimeContext } from './types';
import { translateJSON } from './openai';
import {
    InputPageComputed,
    InputPageDocument,
    InputPageGroup,
    InputPageLink,
    Revision,
    RevisionPageComputed,
    RevisionPageDocument,
    RevisionPageGroup,
    RevisionPageLink,
} from '@gitbook/api';

type TranslateProps = {
    /** Language to translate to */
    language: string;
    /** ID of the space */
    space: string;
    /** ID of the root page in the space */
    // page?: string;
};

/**
 * Content source that translates pages from an origin space into a given language.
 */
export const translateContentSource = createContentSource<
    TranslateProps,
    OpenAITranslateRuntimeContext
>({
    sourceId: 'translate',
    getPages: async (input, ctx) => {
        const { data: revision } = await ctx.api.spaces.getCurrentRevision(input.props.space);
        const inputs = getInputsFromRevision(revision);

        const translated = await translateJSON(ctx, input.props.language, inputs, [
            'title',
            'description',
        ]);
        return translated;
    },
    getPageDocument: async (input, ctx) => {
        const { data: page } = await ctx.api.spaces.getPageById(input.props.space, input.page.id, {
            format: 'document',
        });

        if (page.type !== 'document') {
            throw new Error('Unexpected, Only documents can be translated');
        }

        const jsonDocument = 'document' in page ? page.document : null;
        if (!jsonDocument) {
            return;
        }

        const translated = await translateJSON(ctx, input.props.language, jsonDocument, ['text']);
        return translated;
    },
});

function getInputsFromRevision(revision: Revision) {
    return getInputsFromPages(revision.pages);
}

function getInputsFromPages(
    pages: Array<
        RevisionPageGroup | RevisionPageLink | RevisionPageDocument | RevisionPageComputed
    >,
) {
    return pages.map(getInputFromPage);
}

function getInputFromPage(
    page: RevisionPageGroup | RevisionPageLink | RevisionPageDocument | RevisionPageComputed,
): InputPageDocument | InputPageGroup | InputPageLink | InputPageComputed {
    switch (page.type) {
        case 'document':
            return {
                type: 'document',
                id: page.id,
                title: page.title,
                slug: page.slug,
                description: page.description,
                pages: getInputsFromPages(page.pages) as Array<
                    InputPageDocument | InputPageLink | InputPageComputed
                >,
            };
        case 'group':
            return {
                type: 'group',
                id: page.id,
                title: page.title,
                slug: page.slug,
                pages: getInputsFromPages(page.pages) as Array<
                    InputPageDocument | InputPageLink | InputPageComputed
                >,
            };
        case 'link':
            return {
                type: 'link',
                id: page.id,
                title: page.title,
                target: page.target,
            };
        case 'computed':
            return {
                type: 'computed',
                id: page.id,
                title: page.title,
                source: page.source,
            };
    }
}
