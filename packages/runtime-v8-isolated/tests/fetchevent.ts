import * as assert from 'assert';
import test from 'node:test';

import { runIsolatedEvent } from '..';

test('FetchEvent', async (t) => {
    await t.test('should return the response as a raw object', async () => {
        const code = `
            addEventListener('fetch', (event) => {
                return new Response('Hello world');
            });
            `;
        const result = await runIsolatedEvent(code, {
            type: 'fetch',
            request: {},
        });

        assert.deepEqual(result, {
            logs: [],
            returnValue: {
                body: 'Hello world',
                headers: {},
                status: 200,
            },
        });
    });

    await t.test('should have access to the incoming request (request.url)', async () => {
        const code = `
            addEventListener('fetch', (event) => {
                return new Response('Handling ' + event.request.url);
            });
            `;
        const result = await runIsolatedEvent(code, {
            type: 'fetch',
            request: {
                method: 'GET',
                url: 'http://myserver.com',
                headers: {},
                body: '',
            },
        });

        assert.deepEqual(result, {
            logs: [],
            returnValue: {
                body: 'Handling http://myserver.com',
                headers: {},
                status: 200,
            },
        });
    });

    await t.test('should have access to the incoming request body (request.body)', async () => {
        const code = `
            addEventListener('fetch', async (event) => {
                const text = await event.request.text();
                return new Response('Handling ' + text);
            });
            `;
        const result = await runIsolatedEvent(code, {
            type: 'fetch',
            request: {
                method: 'POST',
                url: 'http://myserver.com',
                headers: {},
                body: 'a request body',
            },
        });

        assert.deepEqual(result, {
            logs: [],
            returnValue: {
                body: 'Handling a request body',
                headers: {},
                status: 200,
            },
        });
    });

    await t.test('should allow using respondWith', async () => {
        const code = `
            addEventListener('fetch', (event) => {
                event.respondWith(new Response('Hello world'));
            });
            `;
        const result = await runIsolatedEvent(code, {
            type: 'fetch',
            request: {},
        });

        assert.deepEqual(result, {
            logs: [],
            returnValue: {
                body: 'Hello world',
                headers: {},
                status: 200,
            },
        });
    });

    await t.test('should allow using respondWith with a promise', async () => {
        const code = `
            async function respondWithPromise() {
                return new Response('Hello world');
            }
    
            addEventListener('fetch', (event) => {
                event.respondWith(respondWithPromise());
            });
            `;
        const result = await runIsolatedEvent(code, {
            type: 'fetch',
            request: {},
        });

        assert.deepEqual(result, {
            logs: [],
            returnValue: {
                body: 'Hello world',
                headers: {},
                status: 200,
            },
        });
    });

    await t.test('should allow using respondWith with undefined', async () => {
        const code = `
            addEventListener('fetch', (event) => {
                event.respondWith(undefined);
            });
            `;
        const result = await runIsolatedEvent(code, {
            type: 'fetch',
            request: {},
        });

        assert.deepEqual(result, {
            logs: [],
            returnValue: undefined,
        });
    });
});
