import {
    createIntegration,
    IntegrationError,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type ReoDotDevRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            tracking_id?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: ReoDotDevRuntimeContext,
) => {
    const trackingId = environment.siteInstallation?.configuration?.tracking_id;

    if (!trackingId) {
        throw new IntegrationError('configuration_required');
    }

    return new Response((script as string).replace('<TO_REPLACE>', trackingId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<ReoDotDevRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
