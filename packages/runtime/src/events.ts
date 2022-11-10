import { Event, FetchEvent, FetchPublishedScriptEvent } from '@gitbook/api';

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
    T extends NonFetchEvent,
    Context extends RuntimeContext = RuntimeContext
> = RuntimeCallback<[EventTypeMap[T]], void | Promise<void>, Context>;

/**
 * All GitBook events, exluding the generic fetch event.
 */
export type NonFetchEvent = Exclude<
    EventType,
    FetchEvent['type'] | FetchPublishedScriptEvent['type']
>;

/**
 * Mapping of event types to their callbacks.
 */
export type EventCallbackMap<Context extends RuntimeContext = RuntimeContext> = {
    [T in NonFetchEvent]?: EventCallback<T, Context> | Array<EventCallback<T, Context>>;
};

/**
 * Callback for fetch events.
 */
export type FetchEventCallback<Context extends RuntimeContext = RuntimeContext> = RuntimeCallback<
    [Request],
    Response | Promise<Response>,
    Context
>;

/**
 * Callback for fetch events to fetch published scripts from integrations.
 */
export type FetchPublishScriptEventCallback<Context extends RuntimeContext = RuntimeContext> =
    RuntimeCallback<
        [FetchPublishedScriptEvent],
        Response | undefined | Promise<Response | undefined>, // Scripts can return undefined, in which case a no-op script will be sent back to the caller.
        Context
    >;
