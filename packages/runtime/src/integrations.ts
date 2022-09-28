import { Event, IntegrationEnvironment } from '@gitbook/api';

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
}

/**
 * Create and initialize an integration runtime.
 */
export function createIntegration<Context extends RuntimeContext = RuntimeContext>(
    definition: IntegrationRuntimeDefinition<Context>
) {
    // WebSocketPair is a non-standard API that is only provided in CloudFlare workers. We check
    // its presence to determine if we are inside a CloudFlare worker.
    if (typeof WebSocketPair !== 'undefined') {
        return createCloudFlareIntegration(definition);
    }

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
            return definition.fetch(event.request, context);
        });
    }
}

/**
 * Create an integration for CloudFlare workers. Eventually this will become the default way
 * of creating integrations.
 */
function createCloudFlareIntegration<Context extends RuntimeContext = RuntimeContext>(
    definition: IntegrationRuntimeDefinition<Context>
) {
    const { events = {} } = definition;

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
