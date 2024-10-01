import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type KoalaRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            koala_key?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: KoalaRuntimeContext,
) => {
    const koalaId = environment.siteInstallation?.configuration?.koala_key;

    if (!koalaId) {
        return;
    }

    return new Response((script as string).replace('<TO_REPLACE>', koalaId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<KoalaRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
