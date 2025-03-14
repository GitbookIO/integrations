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
export async function getRevisionFromSpec(args: {
    specContent: OpenAPISpecContent;
    props?: {
        models?: boolean;
    };
}): Promise<ContentComputeRevisionEventResponse> {
    const { specContent, props } = args;
    const tree = getOpenAPITree(specContent.schema);
    const [tagPages, modelsId] = await Promise.all([
        openAPIPagesToInputPages(tree, specContent),
        sha1('models'),
    ]);

    return {
        pages: [
            ...tagPages,
            ...(props?.models
                ? [
                      {
                          id: modelsId,
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

async function openAPIPagesToInputPages(
    pages: OpenAPIPage[],
    specContent: OpenAPISpecContent,
): Promise<InputPageDocument[]> {
    return Promise.all(
        pages.map(async (openAPIPage) => {
            const operations = extractPageOperations(openAPIPage);

            const [id, pages] = await Promise.all([
                sha1(`tag-${openAPIPage.id}`),
                openAPIPage.pages
                    ? openAPIPagesToInputPages(openAPIPage.pages, specContent)
                    : undefined,
            ]);

            const page: InputPageDocument = {
                id,
                type: 'document',
                title: openAPIPage.title,
                icon: openAPIPage.tag?.['x-page-icon'],
                description: openAPIPage.tag?.['x-page-description'] ?? '',
                pages,
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
        }),
    );
}

async function sha1(message: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
