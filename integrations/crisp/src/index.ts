import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type CrispRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            tracking_id?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: CrispRuntimeContext
) => {
    const trackingId = environment.siteInstallation?.configuration?.tracking_id;
    if (!trackingId) {
        throw new Error(
            `The Crisp Website ID is missing from the configuration (ID: ${
                'spaceId' in event ? event.spaceId : event.siteId
            }).`
        );
    }

    return new Response(script.replace('<TO_REPLACE>', trackingId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<CrispRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
