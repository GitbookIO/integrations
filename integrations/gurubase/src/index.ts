import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type GurubaseRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            widgetId?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: GurubaseRuntimeContext,
) => {
    const widgetId = environment.siteInstallation?.configuration?.widgetId;
    if (!widgetId) {
        throw new Error(
            `The Gurubase Widget ID is missing from the configuration (ID: ${
                'spaceId' in event ? event.spaceId : event.siteId
            }).`,
        );
    }

    return new Response((script as string).replace('<TO_REPLACE>', widgetId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<GurubaseRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
