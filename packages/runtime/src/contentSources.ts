import {
    ContentComputeDocumentEvent,
    ContentComputeRevisionEventResponse,
    ContentComputeRevisionEvent,
    ComputedContentDependencyResolved,
    ComputedContentDependency,
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

export type ContentSourceDependenciesValueFromRef<
    Dependencies extends Record<string, ComputedContentDependency>,
> = {
    [K in keyof Dependencies]: Extract<
        ComputedContentDependencyResolved,
        { ref: Dependencies[K]['ref'] }
    >;
};

export type ContentSourceInput<
    Props extends PlainObject = {},
    Dependencies extends Record<string, ComputedContentDependency> = {},
> = {
    props: Props;
    dependencies: ContentSourceDependenciesValueFromRef<Dependencies>;
};

/**
 * Create a content source. The result should be bind to the integration using `contentSources`.
 */
export function createContentSource<
    GetRevisionProps extends PlainObject = {},
    GetPageDocumentProps extends PlainObject = {},
    Dependencies extends Record<string, ComputedContentDependency> = {},
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
        [ContentSourceInput<GetRevisionProps, Dependencies>],
        Promise<ContentComputeRevisionEventResponse>,
        Context
    >;

    /**
     * Callback to generate the document of a page.
     */
    getPageDocument: RuntimeCallback<
        [ContentSourceInput<GetPageDocumentProps, Dependencies>],
        Promise<Document>,
        Context
    >;
}): ContentSourceDefinition<Context> {
    return {
        sourceId: source.sourceId,
        compute: async (event, context) => {
            const output = await (async () => {
                switch (event.type) {
                    case 'content_compute_revision': {
                        return source.getRevision(
                            {
                                props: event.props as GetRevisionProps,
                                dependencies:
                                    event.dependencies as ContentSourceDependenciesValueFromRef<Dependencies>,
                            },
                            context,
                        );
                    }
                    case 'content_compute_document': {
                        return {
                            document: await source.getPageDocument(
                                {
                                    props: event.props as GetPageDocumentProps,
                                    dependencies:
                                        event.dependencies as ContentSourceDependenciesValueFromRef<Dependencies>,
                                },
                                context,
                            ),
                        };
                    }
                    default:
                        assertNever(event);
                }
            })();

            return new Response(JSON.stringify(output), {
                headers: {
                    'content-type': 'application/json',
                },
            });
        },
    };
}

function assertNever(value: never): never {
    throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
}
