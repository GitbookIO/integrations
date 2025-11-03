import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './scarf-script.raw.js';

type ScarfRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            pixel_id?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: ScarfRuntimeContext,
) => {
    const pixelId = environment.siteInstallation?.configuration?.pixel_id;

    if (!pixelId) {
        throw new Error(`The Scarf pixel ID is missing from the configuration.`);
    }

    return new Response((script as string).replace('[PIXEL_ID]', pixelId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<ScarfRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
