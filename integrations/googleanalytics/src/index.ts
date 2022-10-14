import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type GARuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            tracking_id?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: GARuntimeContext
) => {
    const trackingId = environment.spaceInstallation.configuration.tracking_id;
    if (!trackingId) {
        throw new Error(
            `The Google Analytics tracking ID is missing from the Space (ID: ${event.installationId}) installation.`
        );
    }

    return new Response(script.replace('<TO_REPLACE>', trackingId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<GARuntimeContext>({
    events: {
        fetch_published_script: handleFetchEvent,
    },
});
