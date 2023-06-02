import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type HeapRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            tracking_id?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: HeapRuntimeContext
) => {
    const trackingId = environment.spaceInstallation.configuration.tracking_id;
    if (!trackingId) {
        throw new Error(
            `The Heap environment ID is missing from the configuration (ID: ${event.spaceId}).`
        );
    }

    return new Response(script.replace('<TO_REPLACE>', trackingId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<HeapRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
