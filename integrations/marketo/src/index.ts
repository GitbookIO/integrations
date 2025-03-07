import {
    createIntegration,
    FetchEventCallback,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './marketoMunchkin.raw.js';

type MarketoRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            account?: string;
            workspace?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: MarketoRuntimeContext,
) => {
    const account = environment.siteInstallation?.configuration?.account;
    const workspace = environment.siteInstallation?.configuration?.workspace || '';

    if (!account) {
        return;
    }

    return new Response(
        (script as string).replace('<account>', account).replace('<workspace>', workspace),
        {
            headers: {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'max-age=604800',
            },
        },
    );
};

export default createIntegration<MarketoRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
