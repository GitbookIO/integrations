import { ContentKitBlock, UIRenderEvent, ContentKitRenderOutput } from '@gitbook/api';

interface ComponentInstance<Props, State> {
    props: Props;
    state: State;
}

const components = new Map<string, (event: UIRenderEvent) => Promise<ContentKitRenderOutput>>();

export function createComponentCallback<Props = {}, State = {}, Action = void>(component: {
    componentId: string;
    initialState: State;
    action?: (
        instance: ComponentInstance<Props, State>,
        action: Action
    ) => Promise<ComponentInstance<Props, State>>;
    render: (instance: ComponentInstance<Props, State>) => Promise<ContentKitBlock>;
}) {
    if (components.size === 0) {
        addEventListener('ui_render', async (e) => {
            // @ts-ignore
            const event = e as UIRenderEvent;

            const component = components.get(event.componentId);
            if (!component) {
                return;
            }
            return component(event);
        });
    }

    components.set(component.componentId, async (event) => {
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
    });
}
