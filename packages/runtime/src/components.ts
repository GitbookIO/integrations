import { ContentKitBlock, UIRenderEvent, ContentKitRenderOutput } from '@gitbook/api';

import { RuntimeCallback, RuntimeContext } from './context';

export interface ComponentInstance<Props, State> {
    props: Props;
    state: State;
}

export interface ComponentDefinition<Context extends RuntimeContext = RuntimeContext> {
    componentId: string;
    render: RuntimeCallback<[UIRenderEvent], Promise<ContentKitRenderOutput>, Context>;
}

type PlainObject = { [key: string]: number | string | boolean | PlainObject | undefined | null };

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
    initialState: State | ((props: Props) => State);

    /**
     * Callback to handle a dispatched action.
     */
    action?: RuntimeCallback<
        [ComponentInstance<Props, State>, Action],
        Promise<ComponentInstance<Props, State>>,
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

            const action = event.action as Action | undefined;
            const props = event.props as Props;
            const state =
                (event.state as State | undefined) ||
                (typeof component.initialState === 'function'
                    ? component.initialState(props)
                    : component.initialState);

            let instance: ComponentInstance<Props, State> = {
                state,
                props,
            };

            if (action && component.action) {
                instance = await component.action(instance, action, context);
            }

            const element = await component.render(instance, context);

            return {
                state: instance.state,
                props: instance.props,
                element,
            };
        },
    };
}
