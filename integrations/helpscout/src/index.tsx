import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type HelpScoutRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            helpscout_id?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: HelpScoutRuntimeContext
) => {
    const koalaId =
        environment.spaceInstallation.configuration.helpscout_id ??
        environment.siteInstallation?.configuration?.helpscout_id ??
        'Koala Key not configured';

    if (!koalaId) {
        return;
    }

    return new Response(script.replace('<TO_REPLACE>', koalaId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<HelpScoutRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
