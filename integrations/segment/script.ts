import { api } from '@gitbook/runtime';

addEventListener('installation:setup', async (event) => {
    // Do something when the integration has been installed 
});

addEventListener('fetch', async (event) => {
    // Do something when receiving an HTTP request
    event.respondWith(new Response('Hello world!'));
});

addEventListener('space:content:updated', async (event) => {
    // Depending on the scopes of your integration
    // You can listen to different events related to user actions.
});