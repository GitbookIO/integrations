export async function acknowledgeSlackRequest(req: Request) {
    /**
     * We acknowledge the slack request immediately to avoid failures
     * and "queue" the actual task to be executed in a subsequent request.
     */
    fetch(`${req.url}_task`, {
        method: 'POST',
        body: await req.text(),
        headers: {
            'content-type': req.headers.get('content-type'),
            'x-slack-signature': req.headers.get('x-slack-signature'),
            'x-slack-request-timestamp': req.headers.get('x-slack-request-timestamp'),
        },
    });

    return new Response(JSON.stringify({ acknowledged: true }), {
        'Content-Type': 'application/json',
    });
}

/**
 * Handle an event from Slack.
 */
export function createSlackEventsHandler(handlers: {
    [type: string]: (event: object) => Promise<any>;
}): (request: Request) => Promise<Response> {
    return async (request) => {
        const event = await request.json();

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
