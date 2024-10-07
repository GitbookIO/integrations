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
};

type TranslateDocumentProps = TranslateProps & {
    /** ID of the origin document in the source space */
    document: string;
};

/**
 * Content source that translates pages from an origin space into a given language.
 */
export const translateContentSource = createContentSource<
    TranslateProps | TranslateDocumentProps,
    OpenAITranslateRuntimeContext
>({
    sourceId: 'translate',
    getPages: async (input, ctx) => {
        const { data: revision } = await ctx.api.spaces.getCurrentRevision(input.props.space);
        const inputs = getInputsFromRevision(ctx, input.props, revision);

        // TODO: optimize to annotate JSON after translation
        const translated = await translateJSON(ctx, input.props.language, inputs, [
            'title',
            'description',
        ]);
        return translated;
    },
    getPageDocument: async (input, ctx) => {
        if (!('document' in input.props)) {
            return;
        }

        const { data: document } = await ctx.api.spaces.getDocumentById(
            input.props.space,
            input.props.document,
        );
        const translated = await translateJSON(ctx, input.props.language, document, ['text']);
        return translated;
    },
});

function getInputsFromRevision(
    ctx: OpenAITranslateRuntimeContext,
    inputProps: TranslateProps,
    revision: Revision,
) {
    return getInputsFromPages(ctx, inputProps, revision.pages);
}

function getInputsFromPages(
    ctx: OpenAITranslateRuntimeContext,
    inputProps: TranslateProps,
    pages: Array<
        RevisionPageGroup | RevisionPageLink | RevisionPageDocument | RevisionPageComputed
    >,
) {
    return pages
        .slice(0, 3) // TODO: remove this limit
        .map((page) => getInputFromPage(ctx, inputProps, page));
}

function getInputFromPage(
    ctx: OpenAITranslateRuntimeContext,
    inputProps: TranslateProps,
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
                pages: getInputsFromPages(ctx, inputProps, page.pages) as Array<
                    InputPageDocument | InputPageLink | InputPageComputed
                >,
                computed: {
                    integration: ctx.environment.integration.name,
                    source: 'translate',
                    props: page.documentId
                        ? {
                              ...inputProps,
                              document: page.documentId,
                          }
                        : inputProps,
                },
            };
        case 'group':
            return {
                type: 'group',
                id: page.id,
                title: page.title,
                slug: page.slug,
                pages: getInputsFromPages(ctx, inputProps, page.pages) as Array<
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
                computed: page.computed,
            };
    }
}
