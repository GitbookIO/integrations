import { Router } from 'itty-router';

import { FetchEventCallback } from '@gitbook/runtime';
import { statuspageAPI, StatuspagePageObject } from './api';

/**
 * Handle incoming HTTP requests
 */
export const handleFetchEvent: FetchEventCallback = async (request, context) => {
    const { environment } = context;

    const router = Router({
        base: new URL(
            environment.spaceInstallation?.urls?.publicEndpoint ||
                environment.installation?.urls.publicEndpoint ||
                environment.integration.urls.publicEndpoint
        ).pathname,
    });

    /*
     * List the channels the user can select in the configuration flow.
     */
    router.get('/pages', async () => {
        const pages = await statuspageAPI<StatuspagePageObject[]>(context, {
            method: 'GET',
            path: 'pages',
        });

        const completions = pages.map((page) => ({
            label: page.name,
            value: page.id,
        }));

        return new Response(JSON.stringify(completions), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });

    const response = await router.handle(request, context);
    if (!response) {
        return new Response(`No route matching ${request.method} ${request.url}`, {
            status: 404,
        });
    }

    return response;
};
