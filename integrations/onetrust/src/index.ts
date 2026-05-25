import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type OneTrustRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            domain_script_id?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: OneTrustRuntimeContext,
) => {
    const domainScriptId = environment.siteInstallation?.configuration?.domain_script_id;

    if (!domainScriptId) {
        return;
    }

    return new Response((script as string).replace('<DOMAIN_SCRIPT_ID>', domainScriptId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<OneTrustRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
