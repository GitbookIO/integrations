import * as bridge from './bridge';
import { FetchEvent } from './fetchevent';
import { Response } from './response';

export function addEventListener(type, eventHandler) {
    const refCallback = new bridge._ivm.Reference(async (event, context, rawCallback) => {
        const callback = async (error: Error | undefined, response: any | undefined) => {
            if (error) {
                rawCallback(error.stack, undefined);
            }

            try {
                if (response instanceof Response) {
                    response = {
                        status: response.status,
                        headers: response.headers.toJSON(),
                        body: await response.text(),
                    };
                }

                if (response) {
                    response = JSON.stringify(response);
                } else {
                    response = undefined;
                }

                rawCallback(undefined, response);
            } catch (error) {
                rawCallback(error.stack, undefined);
            }
        };

        if (event.type === 'fetch') {
            const fetchEvent = new FetchEvent(event.type, event, callback);

            try {
                const result = await eventHandler(fetchEvent);

                if (result && !this.respondWithEntered) {
                    fetchEvent.respondWith(result);
                }
            } catch (error) {
                callback(error, undefined);
            }
        } else {
            try {
                const result = await eventHandler(event, context);
                callback(undefined, result);
            } catch (error) {
                callback(error, undefined);
            }
        }
    });

    bridge._addEventListener.apply(null, [type, refCallback]);
}
