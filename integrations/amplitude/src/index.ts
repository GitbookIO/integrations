import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './amplitudeScript.raw.js';

const DEFAULT_SERVER_URL = 'https://api2.amplitude.com/2/httpapi';

type AmplitudeRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            amplitude_api_key?: string;
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

    const serverUrl = config?.server_url ?? DEFAULT_SERVER_URL;
    const initConfig = {
        ...(serverUrl !== DEFAULT_SERVER_URL ? { serverUrl } : {}),
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

    const initConfigJson = JSON.stringify(initConfig)
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'");

    let scriptContent = (script as string).replace(/<TO_REPLACE>/g, amplitudeApiKey);
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
