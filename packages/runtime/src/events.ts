import { Event } from '@gitbook/api';

import { RuntimeCallback } from './context';

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
export type EventCallback<T extends EventType> = RuntimeCallback<
    [EventTypeMap[T]],
    void | Promise<void>
>;

/**
 * Mapping of event types to their callbacks.
 */
export type EventCallbackMap = { [T in EventType]?: EventCallback<T> | Array<EventCallback<T>> };
