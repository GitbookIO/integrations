import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type HotjarRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            tracking_id?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: HotjarRuntimeContext
) => {
    const trackingId = environment.spaceInstallation.configuration.tracking_id;
    if (!trackingId) {
        throw new Error(
            `The Hotjar Site ID is missing from the configuration (ID: ${event.spaceId}).`
        );
    }

    return new Response(script.replace('<TO_REPLACE>', trackingId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<HotjarRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
