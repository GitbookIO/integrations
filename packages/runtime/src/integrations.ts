import { createContext, RuntimeContext } from './context';
import { EventCallbackMap, FetchEventCallback } from './events';

interface IntegrationRuntimeDefinition<Context extends RuntimeContext = RuntimeContext> {
    /**
     * Handler for the fetch event. As it has slightly stricter typing, it's pulled out of the generic
     * events map.
     */
    fetch?: FetchEventCallback<Context>;

    /**
     * Handler for GitBook events.
     */
    events?: EventCallbackMap<Context>;
}

/**
 * Create and initialize an integration runtime.
 */
export function createIntegration<Context extends RuntimeContext = RuntimeContext>(
    definition: IntegrationRuntimeDefinition<Context>
) {
    // TODO: adapt the implementation to the new runtime (Cloudflare Workers)
    // where we will listen to an incoming HTTP request and parse it.

    const { events = {} } = definition;

    // @ts-ignore - `environment` is currently a global variable until we switch to Cloudflare Workers
    const context = createContext(environment);

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

    if (definition.fetch) {
        addEventListener('fetch', (event) => {
            return definition.fetch(event, context);
        });
    }
}
