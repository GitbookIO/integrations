import { Request } from 'itty-router';

/**
 * //
 */
export function createSlackEventsHandler(handlers: {
    [type: string]: (event: object) => Promise<any>;
}): (request: Request) => Promise<Response> {
    return async (request) => {
        const eventText = await request.text();

        console.log('eventText', eventText);
        return new Response(`got ${eventText}`, { status: 200 });

        const event = await request.json();

        if (!event.type) {
            return new Response(`Invalid event`, {
                status: 422,
            });
        }

        const handler = handlers[event.type];
        if (!handler) {
            return new Response(`No handler for event type "${event.type}"`, {
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
