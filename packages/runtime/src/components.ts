import {
    ContentKitBlock,
    ContentKitContext,
    ContentKitDefaultAction,
    ContentKitRenderOutput,
    UIRenderEvent,
} from '@gitbook/api';

import { RuntimeCallback, RuntimeContext } from './context';

type PlainObjectValue =
    | number
    | string
    | boolean
    | PlainObject
    | undefined
    | null
    | PlainObjectValue[];
type PlainObject = {
    [key: string]: PlainObjectValue;
};

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

export type ComponentAction<Action = void> = Action extends void
    ? ContentKitDefaultAction
    : ContentKitDefaultAction | Action;

/**
 * Create a component instance. The result should be bind to the integration using `blocks`.
 */
export function createComponent<
    Props extends PlainObject = {},
    State extends PlainObject = {},
    Action = void,
    Context extends RuntimeContext = RuntimeContext,
>(component: {
    /**
     * Unique identifier for the component in the integration.
     */
    componentId: string;

    /**
     * Initial state of the component.
     */
    initialState?:
        | State
        | ((props: Props, renderContext: ContentKitContext, context: Context) => State);

    /**
     * Callback to handle a dispatched action.
     */
    action?: RuntimeCallback<
        [ComponentInstance<Props, State>, ComponentAction<Action>],
        Promise<
            | { type?: 'element'; props?: Props; state?: State }
            | { type: 'complete'; returnValue?: PlainObject }
            | undefined
        >,
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
                throw new Error(`Invalid component ID: ${event.componentId}`);
            }

            // @ts-ignore
            const action = event.action as ComponentAction<Action> | undefined;
            const props = event.props as Props;
            const state =
                (event.state as State | undefined) ||
                (typeof component.initialState === 'function'
                    ? component.initialState(props, event.context, context)
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

            const wrapResponse = (output: ContentKitRenderOutput) => {
                return new Response(JSON.stringify(output), {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(cache
                            ? {
                                  // @ts-ignore - I'm not sure how to fix this one with TS
                                  'Cache-Control': `max-age=${cache.maxAge}`,
                              }
                            : {}),
                    },
                });
            };

            if (action && component.action) {
                const actionResult = await component.action(instance, action, context);

                // If the action is complete, return the result directly. No need to render the component.
                if (actionResult?.type === 'complete') {
                    return wrapResponse(actionResult);
                }

                instance = { ...instance, ...actionResult };
            }

            const element = await component.render(instance, context);

            const output: ContentKitRenderOutput = {
                // for backward compatibility always default to 'element'
                type: 'element',
                state: instance.state,
                props: instance.props,
                element,
            };

            return wrapResponse(output);
        },
    };
}
