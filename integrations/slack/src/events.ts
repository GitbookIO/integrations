import { Request } from 'itty-router';

/**
 * //
 */
export function createSlackEventsHandler(handlers: {
    [type: string]: (event: object) => Promise<any>;
}): (request: Request) => Promise<Response> {
    return async (request) => {
        const event = await request.json();
        console.log('receive events', JSON.stringify(event, null, 2));

        if (!event.type) {
            return new Response(`Invalid event`, {
                status: 422,
            });
        }

        const eventType = event.event?.type || event.type;
        const handler = handlers[eventType];
        if (!handler) {
            return new Response(`No handler for event type "${eventType}"`, {
                status: 404,
            });
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
