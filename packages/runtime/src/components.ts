import {
    ContentKitBlock,
    UIRenderEvent,
    ContentKitRenderOutput,
    ContentKitContext,
} from '@gitbook/api';

import { RuntimeCallback, RuntimeContext } from './context';

type PlainObject = { [key: string]: number | string | boolean | PlainObject | undefined | null };

export interface ComponentRenderCache {
    maxAge: number;
}

export interface ComponentInstance<Props extends PlainObject, State extends PlainObject> {
    props: Props;
    state: State;
    context: ContentKitContext;

    /**
     * Set the cache max-age for the output of this component.
     */
    setCache(cache: ComponentRenderCache): void;

    /**
     * Return an identifier for a dynamic state binding.
     */
    dynamicState<Key extends keyof State>(key: Key): { $state: Key };
}

export interface ComponentDefinition<Context extends RuntimeContext = RuntimeContext> {
    componentId: string;
    render: RuntimeCallback<[UIRenderEvent], Promise<Response>, Context>;
}

/**
 * Create a component instance. The result should be bind to the integration using `blocks`.
 */
export function createComponent<
    Props extends PlainObject = {},
    State extends PlainObject = {},
    Action = void,
    Context extends RuntimeContext = RuntimeContext
>(component: {
    /**
     * Unique identifier for the component in the integration.
     */
    componentId: string;

    /**
     * Initial state of the component.
     */
    initialState?: State | ((props: Props, renderContext: ContentKitContext) => State);

    /**
     * Callback to handle a dispatched action.
     */
    action?: RuntimeCallback<
        [ComponentInstance<Props, State>, Action],
        Promise<{ props?: Props; state?: State }>,
        Context
    >;

    /**
     * Callback to render the component.
     */
    render: RuntimeCallback<[ComponentInstance<Props, State>], Promise<ContentKitBlock>, Context>;
}): ComponentDefinition<Context> {
    return {
        componentId: component.componentId,
        render: async (event, context) => {
            if (event.componentId !== component.componentId) {
                return;
            }

            // @ts-ignore
            const action = event.action as Action | undefined;
            const props = event.props as Props;
            const state =
                (event.state as State | undefined) ||
                (typeof component.initialState === 'function'
                    ? component.initialState(props, event.context)
                    : ((component.initialState || {}) as State));

            let cache: ComponentRenderCache | undefined = undefined;

            let instance: ComponentInstance<Props, State> = {
                state,
                props,
                context: event.context,
                setCache: (newCache) => {
                    cache = newCache;
                },
                dynamicState: (key) => ({ $state: key }),
            };

            if (action && component.action) {
                instance = { ...instance, ...(await component.action(instance, action, context)) };
            }

            const element = await component.render(instance, context);

            const output: ContentKitRenderOutput = {
                state: instance.state,
                props: instance.props,
                element,
            };

            return new Response(JSON.stringify(output), {
                headers: {
                    'Content-Type': 'application/json',
                    ...(cache ? { 'Cache-Control': `max-age=${cache.maxAge}` } : {}),
                },
            });
        },
    };
}
