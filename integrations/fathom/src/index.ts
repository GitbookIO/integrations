import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './fathomScript.raw.js';

type FathomRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            site_id?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: FathomRuntimeContext
) => {
    const siteId = environment.siteInstallation?.configuration?.site_id;

    if (!siteId) {
        return;
    }

    return new Response(script.replace('<TO_REPLACE>', siteId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<FathomRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
