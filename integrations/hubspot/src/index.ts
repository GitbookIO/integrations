import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type HubSpotRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            hubspot_id?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: HubSpotRuntimeContext,
) => {
    const hubspotId = environment.siteInstallation?.configuration?.hubspot_id;

    if (!hubspotId) {
        return;
    }

    return new Response((script as string).replace('<hubspot_id>', hubspotId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<HubSpotRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
