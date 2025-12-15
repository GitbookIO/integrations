import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type FreshdeskRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            widget_id?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: FreshdeskRuntimeContext,
) => {
    const widgetId = environment.siteInstallation?.configuration?.widget_id;
    if (!widgetId) {
        throw new Error(
            `The Freshdesk Widget ID is missing from the configuration (ID: ${
                'spaceId' in event ? event.spaceId : event.siteId
            }).`,
        );
    }

    return new Response((script as string).replaceAll('<TO_REPLACE>', widgetId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<FreshdeskRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
