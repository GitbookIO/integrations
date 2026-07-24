import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './calibermindScript.raw.js';

type CaliberMindRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            write_key?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    _event,
    { environment }: CaliberMindRuntimeContext,
) => {
    const writeKey = environment.siteInstallation?.configuration?.write_key;

    if (!writeKey) {
        return;
    }

    return new Response((script as string).replace('<TO_REPLACE>', writeKey), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<CaliberMindRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
