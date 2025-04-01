import {
    ContentRefSpace,
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
import { ContentSourceInput, createContentSource, ExposableError } from '@gitbook/runtime';
import { AiTranslateRuntimeContext } from '../types';
import { translateJSON } from './openai';

/** Props passed to the `getRevision` method. */
export type TranslateContentSourceProps = {
    language: string;
};

export type TranslateContentSourceDependencies = {
    space: { ref: ContentRefSpace };
};

type TranslateDocumentProps = TranslateContentSourceProps & {
    /** ID of the origin document in the source space */
    document: string;
};

/**
 * Content source to generate pages from an OpenAPI specification.
 */
export const translateContentSource = createContentSource<
    TranslateContentSourceProps,
    TranslateDocumentProps,
    TranslateContentSourceDependencies
>({
    sourceId: 'translate',

    getRevision: async ({ props, dependencies }, ctx) => {
        const spaceDep = dependencies.space.value;
        if (!spaceDep) {
            throw new ExposableError('Space not found');
        }

        const { data: revision } = await ctx.api.spaces.getRevisionById(
            spaceDep.id,
            spaceDep.revision,
        );

        const pages = getInputsFromRevision(ctx, { props, dependencies }, revision);

        const translated = await translateJSON(
            ctx,
            props.language,
            {
                pages,
            },
            ['title', 'description'],
        );

        return {
            pages: translated.pages,
            files: revision.files,
        };
    },

    getPageDocument: async ({ props, dependencies }, ctx) => {
        const spaceDep = dependencies.space.value;
        if (!spaceDep) {
            throw new ExposableError('Space not found');
        }

        const { data: document } = await ctx.api.spaces.getDocumentById(
            spaceDep.id,
            props.document,
        );

        const translated = await translateJSON(ctx, props.language, document, ['text']);
        return { document: translated };
    },
});

function getInputsFromRevision(
    ctx: AiTranslateRuntimeContext,
    inputProps: ContentSourceInput<TranslateContentSourceProps, TranslateContentSourceDependencies>,
    revision: Revision,
) {
    return getInputsFromPages(ctx, inputProps, revision.pages);
}

function getInputsFromPages(
    ctx: AiTranslateRuntimeContext,
    inputProps: ContentSourceInput<TranslateContentSourceProps, TranslateContentSourceDependencies>,
    pages: Array<
        RevisionPageGroup | RevisionPageLink | RevisionPageDocument | RevisionPageComputed
    >,
) {
    return pages.map((page) => getInputFromPage(ctx, inputProps, page));
}

function getInputFromPage(
    ctx: AiTranslateRuntimeContext,
    inputProps: ContentSourceInput<TranslateContentSourceProps, TranslateContentSourceDependencies>,
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
                computed: page.documentId
                    ? {
                          // @ts-expect-error TODO: fix it
                          integration: ctx.environment.integration.name,
                          source: 'translate',
                          props: {
                              ...inputProps.props,
                              document: page.documentId,
                          },
                          dependencies: {
                              space: { ref: inputProps.dependencies.space.ref },
                          },
                      }
                    : undefined,
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
