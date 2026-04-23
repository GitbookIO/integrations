import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type LeadForensicsRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            tracking_id?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: LeadForensicsRuntimeContext,
) => {
    const trackingId = environment.siteInstallation?.configuration?.tracking_id;

    if (!trackingId) {
        return;
    }

    return new Response((script as string).replace('<TO_REPLACE>', trackingId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<LeadForensicsRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
