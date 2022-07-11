import { Request } from 'itty-router';

export function createSlackCommandsHandler(handlers: {
    [type: string]: (slashEvent: object) => Promise<any>;
}): (request: Request) => Promise<Response> {
    return async (request) => {
        const slashEvent = await request.formData();

        console.log('received slash command', JSON.stringify(slashEvent, null, 2));

        if (!slashEvent.command) {
            return new Response(`Invalid slash command`, {
                status: 422,
            });
        }

        const { command } = slashEvent;

        const handler = handlers[command];
        if (!handler) {
            return new Response(`No handler for slash command "${command}"`, {
                status: 404,
            });
        }

        const data = await handler(slashEvent);

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
