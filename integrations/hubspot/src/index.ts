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
            script_loader_url?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = (
    event,
    { environment }: HubSpotRuntimeContext
) => {
    const scriptLoaderURL =
        environment.siteInstallation?.configuration?.script_loader_url ??
        environment.spaceInstallation.configuration.script_loader_url;

    if (!scriptLoaderURL) {
        throw new Error(
            `The HubSpot Script Loader URL is missing from the configuration (ID: ${event.spaceId}).`
        );
    }

    return new Response(script.replace('<TO_REPLACE_SCRIPT_LOADER_ID>', scriptLoaderURL), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<HubSpotRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
