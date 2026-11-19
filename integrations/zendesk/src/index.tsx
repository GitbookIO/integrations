import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type ZendeskRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            site_tag?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: ZendeskRuntimeContext
) => {
    const trackingId = environment.siteInstallation?.configuration?.site_tag

    if (!trackingId) {
        return
    }

    return new Response((script as string).replace('<TO_REPLACE>', trackingId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<ZendeskRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
