import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './amplitudeScript.raw.js';

const DEFAULT_SERVER_URL = 'https://api2.amplitude.com/2/httpapi';
const EU_SERVER_URL = 'https://api.eu.amplitude.com/2/httpapi';

/**
 * Maps server region selection to the Amplitude script CDN host.
 * Projects with EU data residency are only served by the EU CDN,
 * the US CDN responds with 401 "Invalid Key." for them (and vice versa).
 */
function getCdnHost(region: string | undefined): string {
    switch (region) {
        case 'EU':
            return 'cdn.eu.amplitude.com';
        default:
            return 'cdn.amplitude.com';
    }
}

type AmplitudeRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            amplitude_api_key?: string;
            server_region?: string;
            server_url?: string;
            autocapture_attribution?: boolean;
            autocapture_page_views?: boolean;
            autocapture_sessions?: boolean;
            autocapture_form_interactions?: boolean;
            autocapture_file_downloads?: boolean;
            autocapture_element_interactions?: boolean;
            autocapture_frustration_interactions?: boolean;
            autocapture_page_url_enrichment?: boolean;
            autocapture_network_tracking?: boolean;
            autocapture_web_vitals?: boolean;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    _event,
    { environment }: AmplitudeRuntimeContext,
) => {
    const config = environment.siteInstallation?.configuration;
    const amplitudeApiKey = config?.amplitude_api_key;

    if (!amplitudeApiKey) {
        return;
    }

    const isEU = config?.server_region === 'EU';
    const serverUrl = config?.server_url ?? DEFAULT_SERVER_URL;
    // The default server URL of the selected region is redundant: the SDK
    // derives it from serverZone. Only a genuinely custom URL (e.g. a proxy)
    // needs to be passed on.
    const isRegionDefaultServerUrl =
        serverUrl === DEFAULT_SERVER_URL || (isEU && serverUrl === EU_SERVER_URL);
    const initConfig = {
        ...(isEU ? { serverZone: 'EU' } : {}),
        ...(isRegionDefaultServerUrl ? {} : { serverUrl }),
        fetchRemoteConfig: true,
        autocapture: {
            attribution: config?.autocapture_attribution ?? true,
            pageViews: config?.autocapture_page_views ?? true,
            sessions: config?.autocapture_sessions ?? true,
            formInteractions: config?.autocapture_form_interactions ?? true,
            fileDownloads: config?.autocapture_file_downloads ?? true,
            elementInteractions: config?.autocapture_element_interactions ?? false,
            frustrationInteractions: config?.autocapture_frustration_interactions ?? false,
            pageUrlEnrichment: config?.autocapture_page_url_enrichment ?? true,
            networkTracking: config?.autocapture_network_tracking ?? false,
            webVitals: config?.autocapture_web_vitals ?? false,
        },
    };

    const initConfigJson = JSON.stringify(initConfig).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

    let scriptContent = (script as string).replace(/<TO_REPLACE>/g, amplitudeApiKey);
    scriptContent = scriptContent.replace(
        '<TO_REPLACE_CDN_HOST>',
        getCdnHost(config?.server_region),
    );
    scriptContent = scriptContent.replace('<TO_REPLACE_INIT_CONFIG>', initConfigJson);

    return new Response(scriptContent, {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<AmplitudeRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
