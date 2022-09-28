import { Event, IntegrationEnvironment } from '@gitbook/api';

import { ComponentDefinition } from './components';
import { createContext, RuntimeContext } from './context';
import { EventCallbackMap, FetchEventCallback } from './events';
import { Logger } from './logger';

const logger = Logger('integrations');

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

    /**
     * Components to expose in the integration.
     */
    components?: Array<ComponentDefinition<Context>>;
}

/**
 * Create and initialize an integration runtime.
 */
export function createIntegration<Context extends RuntimeContext = RuntimeContext>(
    definition: IntegrationRuntimeDefinition<Context>
) {
    const { events = {}, components = [] } = definition;

    /**
     * Handle a fetch event sent by the integration dispatcher.
     */
    async function handleWorkerDispatchEvent(ev: FetchEvent): Promise<Response> {
        const version = new URL(ev.request.url).pathname.slice(1);

        if (version !== 'v1') {
            return new Response(`Unsupported version ${version}`, { status: 400 });
        }

        const formData = await ev.request.formData();

        const event = JSON.parse(formData.get('event') as string) as Event;
        const context = createContext(
            JSON.parse(formData.get('environment') as string) as IntegrationEnvironment
        );

        if (event.type === 'fetch' && definition.fetch) {
            logger.info(`handling fetch event ${event.request.url}`);

            // Create a new Request that mimics the original Request
            const request = new Request(event.request.url, {
                method: event.request.method,
                headers: new Headers(event.request.headers),
            });

            return definition.fetch(request, context);
        }

        if (event.type === 'ui_render') {
            const component = components.find((c) => c.componentId === event.componentId);
            if (!component) {
                return new Response('Component not defined', { status: 404 });
            }

            // @ts-ignore
            const result = await component.render(event, context);
            return new Response(JSON.stringify(result), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const cb = events[event.type];

        if (cb) {
            logger.info(`handling GitBook-generated event ${event.type}`);

            if (Array.isArray(cb)) {
                await Promise.all(cb.map((c) => c(event, context)));
            } else {
                await cb(event, context);
            }

            // TODO: maybe the callback wants to return something
            return new Response('OK', { status: 200 });
        }

        return new Response(`Integration does not handle ${event.type} events`, {
            status: 200,
        });
    }

    addEventListener('fetch', (ev) => {
        ev.respondWith(handleWorkerDispatchEvent(ev));
    });
}
