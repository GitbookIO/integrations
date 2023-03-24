import { Event, IntegrationEnvironment } from '@gitbook/api';

import { ComponentDefinition } from './components';
import { createContext, RuntimeContext } from './context';
import { EventCallbackMap, FetchEventCallback, FetchPublishScriptEventCallback } from './events';
import { Logger } from './logger';

const logger = Logger('integrations');

interface IntegrationRuntimeDefinition<Context extends RuntimeContext = RuntimeContext> {
    /**
     * Handler for the fetch event. As it has slightly stricter typing, it's pulled out of the generic
     * events map.
     */
    fetch?: FetchEventCallback<Context>;

    /**
     * Handler for fetching the injectable script for an integration.
     */
    fetch_published_script?: FetchPublishScriptEventCallback<Context>;

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

        /**
         * Only check the version in production, as the dispatcher is not versioned
         * in development mode
         */
        if (MODE === 'production') {
            if (version !== 'v1') {
                logger.error(`unsupported version ${version}`);
                return new Response(`Unsupported version ${version}`, { status: 400 });
            }
        }

        try {
            const formData = await ev.request.formData();

            const event = JSON.parse(formData.get('event') as string) as Event;
            const fetchBody = formData.get('fetch-body');
            const context = createContext(
                JSON.parse(formData.get('environment') as string) as IntegrationEnvironment
            ) as Context;

            if (event.type === 'fetch' && definition.fetch) {
                logger.info(`handling fetch ${event.request.method} ${event.request.url}`);

                // Create a new Request that mimics the original Request
                const request = new Request(event.request.url, {
                    method: event.request.method,
                    headers: new Headers(event.request.headers),
                    body: fetchBody,
                });

                const resp = await definition.fetch(request, context);
                logger.debug(
                    `response ${resp.status} ${resp.statusText} Content-Type: ${resp.headers.get(
                        'content-type'
                    )}`
                );
                return resp;
            }

            if (event.type === 'fetch_published_script' && definition.fetch_published_script) {
                logger.info(`handling fetch_script`);

                const resp = await definition.fetch_published_script(event, context);

                if (!resp) {
                    logger.debug(`fetch_published_script is no-op, sending no-op script`);

                    return new Response('/** no-op */', {
                        headers: {
                            'Content-Type': 'application/javascript',
                        },
                    });
                }

                logger.debug(
                    `response ${resp.status} ${resp.statusText} Content-Type: ${resp.headers.get(
                        'content-type'
                    )}`
                );

                return resp;
            }

            if (event.type === 'ui_render') {
                const component = components.find((c) => c.componentId === event.componentId);

                if (!component) {
                    return new Response('Component not defined', { status: 404 });
                }

                return await component.render(event, context);
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

            logger.info(`integration does not handle ${event.type} events`);
            return new Response(`Integration does not handle ${event.type} events`, {
                status: 200,
            });
        } catch (err) {
            logger.error(err.stack);
            throw err;
        }
    }

    addEventListener('fetch', (ev) => {
        ev.respondWith(handleWorkerDispatchEvent(ev));
    });
}
