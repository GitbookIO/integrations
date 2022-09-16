import { UIRenderEvent } from '@gitbook/api';

import { ComponentDefinition } from './components';
import { EventCallbackMap } from './events';

interface IntegrationRuntimeDefinition {
    /**
     * Handler for events.
     */
    events?: EventCallbackMap;

    /**
     * Components to bind in the runtime.
     */
    components?: ComponentDefinition[];
}

/**
 * Create and initialize an integration runtime.
 */
export function createIntegration(definition: IntegrationRuntimeDefinition) {
    const { events = {}, components = [] } = definition;

    // TODO: adapt to new runtime (Cloudflare Workers)

    if (components.length > 0) {
        addEventListener('ui_render', async (e) => {
            // @ts-ignore
            const event = e as UIRenderEvent;

            const component = components.find((c) => c.componentId === event.componentId);
            if (!component) {
                return;
            }
            return component.render(event);
        });
    }

    Object.entries(events).forEach(([type, callback]) => {
        if (Array.isArray(callback)) {
            callback.forEach((cb) => addEventListener(type, cb));
        } else {
            addEventListener(type, callback);
        }
    });
}
