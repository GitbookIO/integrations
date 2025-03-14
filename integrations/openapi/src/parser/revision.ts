import type { ContentComputeRevisionEventResponse, InputPageDocument } from '@gitbook/api';
import {
    extractPageOperations,
    getOpenAPITree,
    type OpenAPIPage,
    type OpenAPISpecContent,
} from './spec';

/**
 * Generate the revision for the OpenAPI specification.
 */
export function getRevisionFromSpec(args: {
    specContent: OpenAPISpecContent;
    props?: {
        models?: boolean;
    };
}): ContentComputeRevisionEventResponse {
    const { specContent, props } = args;
    const tree = getOpenAPITree(specContent.schema);

    return {
        pages: [
            ...openAPIPagesToInputPages(tree, specContent),
            ...(props?.models
                ? [
                      {
                          id: 'models',
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
                      },
                  ]
                : []),
        ],
    };
}
function openAPIPagesToInputPages(
    pages: OpenAPIPage[],
    specContent: OpenAPISpecContent,
): InputPageDocument[] {
    return pages.map((openAPIPage) => {
        const operations = extractPageOperations(openAPIPage);

        const page: InputPageDocument = {
            id: `tag-${openAPIPage.id}`,
            type: 'document',
            title: openAPIPage.title,
            icon: openAPIPage.tag?.['x-page-icon'],
            description: openAPIPage.tag?.['x-page-description'] ?? '',
            pages: openAPIPage.pages
                ? openAPIPagesToInputPages(openAPIPage.pages, specContent)
                : undefined,
            computed: operations.length
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

        return page;
    });
}
