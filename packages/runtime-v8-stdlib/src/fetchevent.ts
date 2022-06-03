import { Request } from './request';

const invalidResponseType = new Error(
    `Invalid response type for 'fetch' event. Expecting a straight Response, a function returning a Promise<Response> or a Response.`
);

export class FetchEvent {
    public type: 'string';
    public request: any;
    public callback: any;
    public respondWithEntered: boolean;

    constructor(type, init, callback) {
        this.type = type;
        this.request = new Request(init.request.url, init.request);
        if (!this.request) {
            throw new Error('init.request is required.');
        }
        this.callback = callback;
        this.respondWithEntered = false;
    }

    /**
     * respondWith callback
     * @callback respondWithCallback
     * @param {Response} The HTTP response to reply with
     */
    /**
     * Registers a function to generate a response for this event
     * @param {respondWithCallback} fn
     */
    public respondWith(input: undefined | Response | Promise<Response | undefined>) {
        this.respondWithEntered = true;

        const handleResponse = (response: Response | undefined) => {
            if (response instanceof Response || response === undefined) {
                return this.callback(null, response);
            } else if (response === undefined) {
                return this.callback(invalidResponseType);
            }
        };

        if (input instanceof Promise) {
            input
                .then((res) => {
                    handleResponse(res);
                })
                .catch((err) => {
                    this.callback(err);
                });
        } else {
            handleResponse(input);
        }
    }
}
