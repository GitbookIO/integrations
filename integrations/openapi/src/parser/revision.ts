import type { ContentComputeRevisionEventResponse, InputPage } from '@gitbook/api';
import type { GenerateGroupPageProps } from '../contentSources';
import { divideOpenAPISpecSchema, type OpenAPISpecContent } from './spec';
import { OpenAPIV3 } from '@gitbook/openapi-parser';

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
    const groups = divideOpenAPISpecSchema(specContent.schema);

    const groupPages = groups.map((group) => {
        const documentProps: GenerateGroupPageProps = {
            doc: 'operations' as const,
            group: group.id,
        };

        const page: InputPage = {
            type: 'document',
            title: (group.tag ? getTagTitle(group.tag) : '') || improveTagName(group.id),
            icon: group.tag?.['x-page-icon'],
            description: group.tag?.['x-page-description'] ?? '',
            computed: {
                integration: 'openapi',
                source: 'generate',
                props: documentProps,
                dependencies: {
                    spec: {
                        ref: { kind: 'openapi' as const, spec: specContent.slug },
                    },
                },
            },
        };

        return page;
    });

    return {
        pages: [
            ...groupPages,
            ...(props?.models
                ? [
                      {
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

/**
 * Get the title for a tag.
 */
function getTagTitle(tag: OpenAPIV3.TagObject) {
    return tag['x-page-title'] ?? improveTagName(tag.name ?? '');
}

/**
 * Improve a tag name to be used as a page title:
 * - Capitalize the first letter
 * - Split on - and capitalize each word
 */
function improveTagName(tagName: string) {
    return tagName
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
