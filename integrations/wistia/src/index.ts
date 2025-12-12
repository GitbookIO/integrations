import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type WistiaRuntimeContext = RuntimeContext<RuntimeEnvironment<{}, {}>>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async () => {
    return new Response(script as string, {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<WistiaRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
