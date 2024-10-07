import { Event, IntegrationEnvironment } from '@gitbook/api';

import { ComponentDefinition } from './components';
import { createContext, RuntimeContext } from './context';
import {
    EventCallbackMap,
    FetchEventCallback,
    FetchPublishScriptEventCallback,
    FetchVisitorAuthenticationEventCallback,
} from './events';
import { Logger } from './logger';
import { ExposableError } from './errors';

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
     * Handler for fetching the visitor auth for an integration.
     */
    fetch_visitor_authentication?: FetchVisitorAuthenticationEventCallback<Context>;

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
    definition: IntegrationRuntimeDefinition<Context>,
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
                JSON.parse(formData.get('environment') as string) as IntegrationEnvironment,
                ev.waitUntil.bind(ev), // internally, waitUntil contains a check on 'this' to ensure this === FetchEvent so we bind it here before passing it down
            ) as Context;

            logger.info(`[${event.eventId}] ${event.type}`);

            switch (event.type) {
                case 'fetch': {
                    logger.info(`handling fetch ${event.request.method} ${event.request.url}`);

                    if (!definition.fetch) {
                        throw new ExposableError('Integration does not handle HTTP requests', 400);
                    }

                    // Create a new Request that mimics the original Request
                    const request = new Request(event.request.url, {
                        method: event.request.method,
                        headers: new Headers(event.request.headers),
                        body: fetchBody,
                    });

                    const resp = await definition.fetch(request, context);
                    logger.debug(
                        `response ${resp.status} ${resp.statusText} Content-Type: ${resp.headers.get(
                            'content-type',
                        )}`,
                    );
                    return resp;
                }
                case 'fetch_published_script': {
                    logger.info(`handling fetch_script`);

                    if (!definition.fetch_published_script) {
                        throw new ExposableError(
                            'Integration does not handle fetch_published_script',
                            400,
                        );
                    }

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
                            'content-type',
                        )}`,
                    );

                    return resp;
                }
                case 'fetch_visitor_authentication': {
                    logger.info(`handling fetch_visitor_authentication`);

                    if (!definition.fetch_visitor_authentication) {
                        throw new ExposableError(
                            'Integration does not handle fetch_visitor_authentication',
                            400,
                        );
                    }
                    const resp = await definition.fetch_visitor_authentication(event, context);

                    logger.debug(
                        `response ${resp.status} ${resp.statusText} Content-Type: ${resp.headers.get(
                            'content-type',
                        )}`,
                    );

                    return resp;
                }

                case 'ui_render': {
                    const component = components.find((c) => c.componentId === event.componentId);

                    if (!component) {
                        throw new ExposableError(`Component ${event.componentId} not found`, 404);
                    }

                    return await component.render(event, context);
                }

                default: {
                    const cb = events[event.type];

                    if (cb) {
                        logger.info(`handling GitBook-generated event ${event.type}`);

                        if (Array.isArray(cb)) {
                            // @ts-ignore
                            await Promise.all(cb.map((c) => c(event, context)));
                        } else {
                            // @ts-ignore
                            await cb(event, context);
                        }

                        return new Response('OK', { status: 200 });
                    }

                    logger.info(`integration does not handle ${event.type} events`);
                    return new Response(`Integration does not handle ${event.type} events`, {
                        status: 200,
                    });
                }
            }
        } catch (err) {
            const error = err as Error | ExposableError;
            logger.error(error.stack ?? error.message);
            return new Response(
                JSON.stringify({
                    error:
                        error instanceof ExposableError ? error.message : 'Internal server error',
                }),
                {
                    status: error instanceof ExposableError ? error.code : 500,
                    headers: { 'content-type': 'application/json' },
                },
            );
        }
    }

    addEventListener('fetch', (ev: FetchEvent) => {
        ev.respondWith(handleWorkerDispatchEvent(ev));
    });
}
