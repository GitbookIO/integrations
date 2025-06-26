import { Router } from 'itty-router';
import {
    createIntegration,
    FetchEventCallback,
    FetchPublishScriptEventCallback,
} from '@gitbook/runtime';

import script from './marketoMunchkin.raw.js';
import { marketoFormBlock, settingsModal } from './form';
import { MarketoRuntimeContext } from './types';
import { webFrameHTML } from './webframe';
import { getWebframeCacheControl } from './cache';

export const handleFetchScriptEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: MarketoRuntimeContext,
) => {
    const account = environment.siteInstallation?.configuration?.account;
    const workspace = environment.siteInstallation?.configuration?.workspace || '';

    if (!account) {
        return;
    }

    return new Response(
        (script as string).replace('<account>', account).replace('<workspace>', workspace),
        {
            headers: {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'max-age=604800',
            },
        },
    );
};

const handleFetchEvent: FetchEventCallback<MarketoRuntimeContext> = async (request, context) => {
    const { environment } = context;
    const router = Router({
        base: new URL(
            environment.siteInstallation?.urls?.publicEndpoint ||
                environment.installation?.urls.publicEndpoint ||
                environment.integration.urls.publicEndpoint,
        ).pathname,
    });

    /**
     * Handle requests to serve the webframe content.
     */
    const cacheControl = getWebframeCacheControl();
    router.get(
        '/webframe',
        async (_request) =>
            new Response(webFrameHTML, {
                headers: {
                    'Content-Type': 'text/html',
                    'Cache-Control': cacheControl,
                },
            }),
    );

    const response = await router.handle(request, context);
    if (!response) {
        return new Response(`No route matching`, { status: 404 });
    }

    return response;
};

export default createIntegration<MarketoRuntimeContext>({
    fetch_published_script: handleFetchScriptEvent,
    fetch: handleFetchEvent,
    components: [marketoFormBlock, settingsModal],
});
