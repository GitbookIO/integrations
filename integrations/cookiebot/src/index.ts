import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type CookiebotRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            implementation_id?: string;
            blocking_mode?: 'auto' | 'manual';
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: CookiebotRuntimeContext,
) => {
    const implementationId = environment.siteInstallation?.configuration?.implementation_id;
    const blockingMode = environment.siteInstallation?.configuration?.blocking_mode;

    if (!implementationId) {
        return;
    }

    const blockingModeScript =
        blockingMode === 'auto' ? "s.setAttribute('data-blockingmode', 'auto');" : '';

    const scriptContent = (script as string)
        .replace('<CBID>', implementationId)
        .replace('__BLOCKING_MODE__', blockingModeScript);

    return new Response(scriptContent, {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<CookiebotRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
