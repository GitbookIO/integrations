import type { ContentRefOpenAPI } from '@gitbook/api';
import {
    type ContentSourceDependenciesValueFromRef,
    ContentSourceInput,
    createContentSource,
    ExposableError,
} from '@gitbook/runtime';
import { assertNever } from '../utils';
import type { OpenAPIRuntimeContext } from '../types';
import { divideOpenAPISpecSchema, getLatestOpenAPISpecContent } from '../parser/spec';
import { getRevisionFromSpec } from '../parser/revision';
import { getGroupDocument } from '../parser/group';
import { getModelsDocument } from '../parser/models';

type GetRevisionProps = {
    /**
     * Should a models page be generated?
     * @default true
     */
    models?: boolean;
};

export type GenerateGroupPageProps = {
    doc: 'operations';
    group: string;
};

type GenerateModelsPageProps = {
    doc: 'models';
};

type GetPageDocumentProps = GenerateGroupPageProps | GenerateModelsPageProps;

export type GenerateContentSourceDependencies = {
    spec: { ref: ContentRefOpenAPI };
};

/**
 * Content source to generate pages from an OpenAPI specification.
 */
export const generateContentSource = createContentSource<
    GetRevisionProps,
    GetPageDocumentProps,
    GenerateContentSourceDependencies
>({
    sourceId: 'generate',

    getRevision: async ({ props, dependencies }, ctx) => {
        const specContent = await getOpenAPISpecFromDependencies(dependencies, ctx);
        return getRevisionFromSpec({ specContent, props });
    },

    getPageDocument: async ({ props, dependencies }, ctx) => {
        switch (props.doc) {
            case 'operations':
                return generateGroupDocument({ props, dependencies }, ctx);
            case 'models':
                return generateModelsDocument({ props, dependencies }, ctx);
            default:
                assertNever(props);
        }
    },
});

/**
 * Generate a document for a group in the OpenAPI specification.
 */
async function generateGroupDocument(
    input: ContentSourceInput<GenerateGroupPageProps, GenerateContentSourceDependencies>,
    ctx: OpenAPIRuntimeContext,
) {
    const { props, dependencies } = input;
    const spec = await getOpenAPISpecFromDependencies(dependencies, ctx);
    const groups = divideOpenAPISpecSchema(spec.schema);

    const group = groups.find((g) => g.id === props.group);

    if (!group) {
        throw new Error(`Group ${props.group} not found`);
    }

    return getGroupDocument({ group, specContent: spec });
}

/**
 * Generate a document for the models page in the OpenAPI specification.
 */
async function generateModelsDocument(
    input: ContentSourceInput<GenerateModelsPageProps, GenerateContentSourceDependencies>,
    ctx: OpenAPIRuntimeContext,
) {
    const { dependencies } = input;
    const specContent = await getOpenAPISpecFromDependencies(dependencies, ctx);
    return getModelsDocument({ specContent });
}

/**
 * Get the OpenAPI specification from the OpenAPI specification dependency.
 */
async function getOpenAPISpecFromDependencies(
    dependencies: ContentSourceDependenciesValueFromRef<GenerateContentSourceDependencies>,
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
