import { Event } from '@gitbook/api';

import { RuntimeCallback, RuntimeContext } from './context';

/**
 * Type of an event.
 */
export type EventType = Event['type'];

/**
 * Internal type to map event types to their event instance.
 */
type EventTypeMap = { [T in Event as T['type']]: T };

/**
 * Callback for a specific event type.
 */
export type EventCallback<
    T extends EventType,
    Context extends RuntimeContext = RuntimeContext
> = RuntimeCallback<[EventTypeMap[T]], void | Promise<void>, Context>;

/**
 * Mapping of event types to their callbacks.
 */
export type EventCallbackMap<Context extends RuntimeContext = RuntimeContext> = {
    [T in EventType]?: EventCallback<T, Context> | Array<EventCallback<T, Context>>;
};

/**
 * Callback for fetch events.
 */
export type FetchEventCallback<Context extends RuntimeContext = RuntimeContext> = RuntimeCallback<
    [Request],
    Response | Promise<Response>,
    Context
>;
