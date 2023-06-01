import { createIntegration, FetchPublishScriptEventCallback } from '@gitbook/runtime';

import script from './script.raw.js';

export const handleFetchEvent: FetchPublishScriptEventCallback = async (event, { environment }) => {
    return new Response(script, {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration({
    fetch_published_script: handleFetchEvent,
});
