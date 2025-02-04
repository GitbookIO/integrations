import {
    ContentComputeDocumentEvent,
    ContentComputeRevisionEventResponse,
    ContentComputeRevisionEvent,
    ComputedContentDependencyValue,
    ComputedContentDependencyRef,
    Document,
} from '@gitbook/api';
import { PlainObject } from './common';
import { RuntimeCallback, RuntimeContext } from './context';

export interface ContentSourceDefinition<Context extends RuntimeContext = RuntimeContext> {
    sourceId: string;
    compute: RuntimeCallback<
        [ContentComputeRevisionEvent | ContentComputeDocumentEvent],
        Promise<Response>,
        Context
    >;
}

export type ContentSourceDependenciesValueFromRef<Dependencies extends Record<string, {
    ref: ComputedContentDependencyRef;
}>> = {
    // TODO: extend to support other types once ComputedContentDependencyRef becomes a union
    [K in keyof Dependencies]: ComputedContentDependencyValue;
}

/**
 * Create a content source. The result should be bind to the integration using `contentSources`.
 */
export function createContentSource<
    Props extends PlainObject = {},
    Dependencies extends Record<string, {
        ref: ComputedContentDependencyRef;
    }> = {},
    Context extends RuntimeContext = RuntimeContext,
>(source: {
    /**
     * ID of the source, referenced in the YAML file.
     */
    sourceId: string;

    /**
     * Callback to generate the pages.
     */
    getRevision: RuntimeCallback<
        [
            {
                props: Props;
                dependencies: ContentSourceDependenciesValueFromRef<Dependencies>;
            },
        ],
        Promise<ContentComputeRevisionEventResponse>,
        Context
    >;

    /**
     * Callback to generate the document of a page.
     */
    getPageDocument: RuntimeCallback<
        [
            {
                props: Props;
                dependencies: ContentSourceDependenciesValueFromRef<Dependencies>;
            },
        ],
        Promise<Document | void>,
        Context
    >;
}): ContentSourceDefinition<Context> {
    return {
        sourceId: source.sourceId,
        compute: async (event, context) => {
            const output =
                event.type === 'content_compute_revision'
                    ? await source.getRevision(
                          {
                              props: event.props as Props,
                              dependencies: event.dependencies as ContentSourceDependenciesValueFromRef<Dependencies>,
                          },
                          context,
                      )
                    : {
                          document: await source.getPageDocument(
                              {
                                  props: event.props as Props,
                                  dependencies: event.dependencies as ContentSourceDependenciesValueFromRef<Dependencies>,
                              },
                              context,
                          ),
                      };

            return new Response(JSON.stringify(output), {
                headers: {
                    'content-type': 'application/json',
                },
            });
        },
    };
}
