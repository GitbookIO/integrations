import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './piwikScript.raw.js';

type PiwikRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            piwik_container_url?: string;
            piwik_site_id?: string;
            data_layer_name?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    _event,
    { environment }: PiwikRuntimeContext,
) => {
    const piwikContainerUrl = environment.siteInstallation?.configuration?.piwik_container_url;
    const piwikSiteId = environment.siteInstallation?.configuration?.piwik_site_id;

    if (!piwikContainerUrl || !piwikSiteId) {
        return;
    }

    const dataLayerName =
        environment.siteInstallation?.configuration?.data_layer_name || 'dataLayer';

    // Normalize: ensure exactly one trailing slash so that `containerUrl + id + ".js"` is valid.
    const containerUrl = piwikContainerUrl.replace(/\/?$/, '/');

    const updatedScript = (script as string)
        .replace('<PIWIK_CONTAINER_URL>', containerUrl)
        .replace('<PIWIK_DATA_LAYER_NAME>', dataLayerName)
        .replace('<PIWIK_SITE_ID>', piwikSiteId);

    return new Response(updatedScript, {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<PiwikRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
