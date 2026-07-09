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
            piwik_container_name?: string;
            piwik_site_id?: string;
            data_layer_name?: string;
        }
    >
>;

// A Piwik PRO container name is a DNS label: the subdomain of containers.piwik.pro.
const CONTAINER_NAME_RE = /^[a-z0-9-]{1,63}$/i;
// Piwik PRO site/container IDs are UUIDs.
const SITE_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// The data layer name is used as a global variable/property name in the injected script.
const DATA_LAYER_NAME_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    _event,
    { environment }: PiwikRuntimeContext,
) => {
    const piwikContainerName = environment.siteInstallation?.configuration?.piwik_container_name;
    const piwikSiteId = environment.siteInstallation?.configuration?.piwik_site_id;

    if (!piwikContainerName || !CONTAINER_NAME_RE.test(piwikContainerName)) {
        return;
    }

    if (!piwikSiteId || !SITE_ID_RE.test(piwikSiteId)) {
        return;
    }

    const dataLayerName =
        environment.siteInstallation?.configuration?.data_layer_name || 'dataLayer';

    if (!DATA_LAYER_NAME_RE.test(dataLayerName)) {
        return;
    }

    const containerUrl = `https://${piwikContainerName}.containers.piwik.pro/`;

    const updatedScript = (script as string)
        .replace("'<PIWIK_CONTAINER_URL>'", JSON.stringify(containerUrl))
        .replace("'<PIWIK_DATA_LAYER_NAME>'", JSON.stringify(dataLayerName))
        .replace("'<PIWIK_SITE_ID>'", JSON.stringify(piwikSiteId));

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
