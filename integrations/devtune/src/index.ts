import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type DevTuneRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            snippet_key?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: DevTuneRuntimeContext,
) => {
    const snippetKey = environment.siteInstallation?.configuration?.snippet_key;
    if (!snippetKey) {
        return;
    }

    // Validate snippet key format (XSS prevention)
    if (!/^[a-zA-Z0-9_-]+$/.test(snippetKey)) {
        return;
    }

    return new Response((script as string).replace('<SNIPPET_KEY>', snippetKey), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<DevTuneRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
