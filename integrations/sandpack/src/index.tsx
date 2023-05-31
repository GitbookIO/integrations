import {
    createIntegration,
    RuntimeContext,
    RuntimeEnvironment,
    FetchPublishScriptEventCallback,
} from '@gitbook/runtime';

import script from './script.raw.js';

type SandpackRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            app_id?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: SandpackRuntimeContext
) => {
    const appId = environment.spaceInstallation.configuration.app_id;

    if (!appId) {
        return;
    }

    return new Response(script.replace('<TO_REPLACE>', appId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<SandpackRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
