import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './plausibleScript.raw.js';

type PlausibleRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            domain?: string;
            api?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: PlausibleRuntimeContext
) => {
    const domain = environment.siteInstallation?.configuration?.domain;
    const api = environment.siteInstallation?.configuration?.api || '';
    if (!domain) {
        return;
    }

    return new Response(script.replace('<domain>', domain).replace('<api>', api), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<PlausibleRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
