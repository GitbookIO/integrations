import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

/**
 * Maps server region selection to Mixpanel API host URL
 */
function getApiHost(region: string | undefined): string {
    switch (region) {
        case 'EU':
            return 'https://api-eu.mixpanel.com';
        case 'India':
            return 'https://api-in.mixpanel.com';
        case 'Standard (US)':
            return 'https://api.mixpanel.com';
        default:
            return 'https://api.mixpanel.com';
    }
}

type MixpanelRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            project_token?: string;
            server_region?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: MixpanelRuntimeContext,
) => {
    const projectToken = environment.siteInstallation?.configuration?.project_token;
    const serverRegion =
        environment.siteInstallation?.configuration?.server_region || 'Standard (US)';

    if (!projectToken) {
        throw new Error(
            `The Mixpanel Project Token is missing from the configuration (ID: ${
                'spaceId' in event ? event.spaceId : event.siteId
            }).`,
        );
    }

    const apiHost = getApiHost(serverRegion);
    const scriptContent = (script as string)
        .replace('<TO_REPLACE>', projectToken)
        .replace('<API_HOST_PLACEHOLDER>', apiHost);

    return new Response(scriptContent, {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<MixpanelRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
