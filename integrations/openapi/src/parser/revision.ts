import type { ContentComputeRevisionEventResponse, InputPageDocument } from '@gitbook/api';
import { assertNever } from '../utils';
import type { OpenAPISpecContent } from './spec';
import { getRootPages, type OpenAPIPage } from './pages';
import { sha1 } from './sha1';

/**
 * Generate the revision for the OpenAPI specification.
 */
export async function getRevisionFromSpec(args: {
    specContent: OpenAPISpecContent;
    props?: {
        models?: boolean;
    };
}): Promise<ContentComputeRevisionEventResponse> {
    const { specContent, props } = args;
    const rootPages = getRootPages(specContent.schema);
    const [pages, modelPage] = await Promise.all([
        openAPIPagesToInputPages(rootPages, specContent),
        props?.models ? getModelsInputPage(specContent) : null,
    ]);
    return { pages: modelPage ? [...pages, modelPage] : pages };
}

async function getModelsInputPage(specContent: OpenAPISpecContent) {
    return {
        id: await sha1('models'),
        type: 'document' as const,
        title: 'Models',
        computed: {
            integration: 'openapi',
            source: 'generate',
            props: { doc: 'models' },
            dependencies: {
                spec: {
                    ref: { kind: 'openapi' as const, spec: specContent.slug },
                },
            },
        },
    };
}

async function openAPIPagesToInputPages(
    pages: OpenAPIPage[],
    specContent: OpenAPISpecContent,
): Promise<InputPageDocument[]> {
    return Promise.all(
        pages.map(async (openAPIPage) => {
            const [id, pages] = await Promise.all([
                sha1(openAPIPage.id),
                openAPIPage.pages
                    ? openAPIPagesToInputPages(openAPIPage.pages, specContent)
                    : undefined,
            ]);

            switch (openAPIPage.type) {
                case 'operations': {
                    return {
                        id,
                        type: 'document',
                        title: openAPIPage.title,
                        icon: openAPIPage.tag?.['x-page-icon'],
                        description: openAPIPage.tag?.['x-page-description'] ?? '',
                        pages,
                        computed: openAPIPage.operations.length
                            ? {
                                  integration: 'openapi',
                                  source: 'generate',
                                  props: {
                                      doc: 'operations' as const,
                                      page: openAPIPage.id,
                                  },
                                  dependencies: {
                                      spec: {
                                          ref: { kind: 'openapi' as const, spec: specContent.slug },
                                      },
                                  },
                              }
                            : undefined,
                    };
                }
                case 'info': {
                    return {
                        id,
                        type: 'document',
                        title: openAPIPage.title,
                        pages,
                        computed: {
                            integration: 'openapi',
                            source: 'generate',
                            props: {
                                doc: 'info' as const,
                                page: openAPIPage.id,
                            },
                            dependencies: {
                                spec: {
                                    ref: { kind: 'openapi' as const, spec: specContent.slug },
                                },
                            },
                        },
                    };
                }
                default:
                    assertNever(openAPIPage);
            }
        }),
    );
}
