import { UIRenderEvent } from '@gitbook/api';

import { ComponentDefinition } from './components';
import { createContext } from './context';
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
    // TODO: adapt the implementation to the new runtime (Cloudflare Workers)
    // where we will listen to an incoming HTTP request and parse it.

    const { events = {}, components = [] } = definition;

    // @ts-ignore - `environment` is currently a global variable until we switch to Cloudflare Workers
    const context = createContext(environment);

    if (components.length > 0) {
        addEventListener('ui_render', async (e) => {
            // @ts-ignore
            const event = e as UIRenderEvent;

            const component = components.find((c) => c.componentId === event.componentId);
            if (!component) {
                return;
            }
            return component.render(event, context);
        });
    }

    Object.entries(events).forEach(([type, callback]) => {
        if (Array.isArray(callback)) {
            callback.forEach((cb) =>
                addEventListener(type, (event) => {
                    return cb(event, context);
                })
            );
        } else {
            addEventListener(type, (event) => {
                return callback(event, context);
            });
        }
    });
}
