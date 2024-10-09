import {
    ContentComputeDocumentEvent,
    ContentComputeRevisionEventResponse,
    ContentComputeRevisionEvent,
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

/**
 * Create a content source. The result should be bind to the integration using `contentSources`.
 */
export function createContentSource<
    Props extends PlainObject = {},
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
                        },
                        context,
                    )
                    : {
                          document: await source.getPageDocument(
                              {
                                  props: event.props as Props,
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
