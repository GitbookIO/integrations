import type { ContentRefOpenAPI } from '@gitbook/api';
import {
    type ContentSourceDependenciesValueFromRef,
    ContentSourceInput,
    createContentSource,
    ExposableError,
} from '@gitbook/runtime';
import { assertNever } from '../utils';
import type { OpenAPIRuntimeContext } from '../types';
import { getLatestOpenAPISpecContent } from '../parser/spec';
import { getRevisionFromSpec } from '../parser/revision';
import { getOpenAPIPageDocument } from '../parser/page';
import { getModelsDocument } from '../parser/models';
import * as infoPages from '../parser/pages/info';
import * as operationsPages from '../parser/pages/operations';

export type OpenAPIContentSource = ContentSourceInput<
    {
        /**
         * Should a models page be generated?
         * @default true
         */
        models?: boolean;
    },
    {
        spec: {
            ref: ContentRefOpenAPI;
        };
    }
>;

export type GenerateOperationsPageProps = {
    doc: 'operations' | 'info';
    page: string;
};

type GenerateModelsPageProps = {
    doc: 'models';
};

type GetPageDocumentProps = GenerateOperationsPageProps | GenerateModelsPageProps;

/**
 * Content source to generate pages from an OpenAPI specification.
 */
export const generateContentSource = createContentSource<
    OpenAPIContentSource['props'],
    GetPageDocumentProps,
    OpenAPIContentSource['dependencies']
>({
    sourceId: 'generate',

    getRevision: async ({ props, dependencies }, ctx) => {
        const specContent = await getOpenAPISpecFromDependencies(dependencies, ctx);
        return getRevisionFromSpec({ specContent, props });
    },

    getPageDocument: async ({ props, dependencies }, ctx) => {
        const { doc } = props;
        const specContent = await getOpenAPISpecFromDependencies(dependencies, ctx);

        switch (doc) {
            case 'operations':
            case 'info': {
                const page = (() => {
                    switch (props.doc) {
                        case 'info': {
                            return infoPages.getPageById(specContent.schema, props.page);
                        }
                        case 'operations': {
                            return operationsPages.getPageById(specContent.schema, props.page);
                        }
                        default:
                            assertNever(props);
                    }
                })();

                if (!page) {
                    throw new ExposableError(`OpenAPI page (id: "${props.page}") not found`);
                }

                return getOpenAPIPageDocument({ page, specContent });
            }
            case 'models': {
                return getModelsDocument({ specContent });
            }
            default:
                assertNever(props);
        }
    },
});

/**
 * Get the OpenAPI specification from the OpenAPI specification dependency.
 */
async function getOpenAPISpecFromDependencies(
    dependencies: ContentSourceDependenciesValueFromRef<OpenAPIContentSource['dependencies']>,
    ctx: OpenAPIRuntimeContext,
) {
    const { api } = ctx;
    const { installation } = ctx.environment;
    const specValue = dependencies.spec.value;

    if (!installation) {
        throw new ExposableError('Installation not found');
    }

    if (specValue?.object !== 'openapi-spec') {
        throw new ExposableError('Invalid spec');
    }

    return getLatestOpenAPISpecContent({
        api,
        openAPISpec: specValue,
        organizationId: installation.target.organization,
    });
}
