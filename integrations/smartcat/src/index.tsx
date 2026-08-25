import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type SmartcatRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            site_tag?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: SmartcatRuntimeContext
) => {
    const smartCatScriptTag = environment.siteInstallation?.configuration?.site_tag;

    return new Response(script.replace('<TO_REPLACE>', smartCatScriptTag), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<SmartcatRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
