import { ContentKitBlock, UIRenderEvent, ContentKitRenderOutput } from '@gitbook/api';

export interface ComponentInstance<Props, State> {
    props: Props;
    state: State;
}

export interface ComponentDefinition {
    componentId: string;
    render: (event: UIRenderEvent) => Promise<ContentKitRenderOutput>;
}

/**
 * Create a component instance. The result should be bind to the integration using `blocks`.
 */
export function createComponent<Props = {}, State = {}, Action = void>(component: {
    /**
     * Unique identifier for the component in the integration.
     */
    componentId: string;

    /**
     * Initial state of the component.
     */
    initialState: State;

    /**
     * Callback to handle a dispatched action.
     */
    action?: (
        instance: ComponentInstance<Props, State>,
        action: Action
    ) => Promise<ComponentInstance<Props, State>>;

    /**
     * Callback to render the component.
     */
    render: (instance: ComponentInstance<Props, State>) => Promise<ContentKitBlock>;
}): ComponentDefinition {
    return {
        componentId: component.componentId,
        render: async (event) => {
            if (event.componentId !== component.componentId) {
                return;
            }

            const { action } = event;
            let instance: ComponentInstance<Props, State> = {
                state: (event.state || component.initialState) as State,
                props: event.props as Props,
            };

            if (action && component.action) {
                instance = await component.action(instance, action);
            }

            const element = await component.render(instance);

            return {
                state: instance.state,
                props: instance.props,
                element,
            };
        },
    };
}
