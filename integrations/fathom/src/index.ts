import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './fathomScript.raw.js';

type FathomRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            site_id?: string;
            track_external_links?: boolean;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: FathomRuntimeContext
) => {
    const siteId = environment.siteInstallation?.configuration?.site_id;

    if (!siteId) {
        return;
    }

    const trackExternalLinks =
        environment.siteInstallation?.configuration?.track_external_links ??
        environment.spaceInstallation?.configuration?.track_external_links ??
        false;

    return new Response(script.replace('<TO_REPLACE>', `${siteId}, ${trackExternalLinks}`), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<FathomRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
