import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import matomoScript from './matomoScript.raw.js';

type MatomoRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            server_url?: string;
            site_id?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: MatomoRuntimeContext,
) => {
    const serverUrl = environment.siteInstallation?.configuration?.server_url;
    const siteId = environment.siteInstallation?.configuration?.site_id;

    if (!serverUrl || !siteId) {
        return;
    }

    const js = (matomoScript as string)
        .replace('<MATOMO_SERVER_URL>', serverUrl.replace(/\/$/, ''))
        .replace('<MATOMO_SITE_ID>', String(siteId));

    return new Response(js, {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<MatomoRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});


