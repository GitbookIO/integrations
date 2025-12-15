import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './amplitudeScript.raw.js';

type AmplitudeRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            amplitude_api_key?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    _event,
    { environment }: AmplitudeRuntimeContext,
) => {
    const amplitudeApiKey = environment.siteInstallation?.configuration?.amplitude_api_key;

    if (!amplitudeApiKey) {
        return;
    }

    return new Response((script as string).replace(/<TO_REPLACE>/g, amplitudeApiKey), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<AmplitudeRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
