import { Request } from 'itty-router';

/**
 * //
 */
export function createSlackEventsHandler(handlers: {
    [type: string]: (event: object) => Promise<any>;
}): (request: Request) => Promise<Response> {
    return async (request) => {
        const event = await request.json();

        if (!event.type) {
            throw new Error('Invalid event');
        }

        const handler = handlers[event.type];
        if (!handler) {
            throw new Error(`No handler for event type "${event.type}"`);
        }

        const data = await handler(event);

        if (typeof data === 'string') {
            return new Response(data, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
        }

        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    };
}
