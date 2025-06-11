import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type UnifyRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            api_key?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: UnifyRuntimeContext,
) => {
    const apiKey = environment.siteInstallation?.configuration?.api_key;
    if (!apiKey) {
        return;
    }

    return new Response((script as string).replace('<TO_REPLACE>', apiKey), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<UnifyRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
