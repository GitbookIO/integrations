import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type SyftRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            syft_key?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: SyftRuntimeContext
) => {
    const syftId =
        environment.spaceInstallation.configuration.syft_key ??
        environment.siteInstallation?.configuration?.syft_key ??
        'Syft Key not configured';

    if (!syftId) {
        throw new Error(
            `The Syft API key is missing from the configuration (ID: ${
                'spaceId' in event ? event.spaceId : event.siteId
            }).`
        );
    }

    return new Response(script.replace('<API_KEY>', syftId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<SyftRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});