import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type PendoRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            api_key?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: PendoRuntimeContext,
) => {
    const apiKey = environment.siteInstallation?.configuration?.api_key;
    if (!apiKey) {
        throw new Error(
            `The API key is missing from the configuration (ID: ${
                'spaceId' in event ? event.spaceId : event.siteId
            }).`,
        );
    }

    return new Response((script as string).replace('<TO_REPLACE>', apiKey), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<PendoRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
