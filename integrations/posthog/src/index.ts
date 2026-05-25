import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type PostHogRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            projectApiKey?: string;
            instanceAddress?: 'EU' | 'US';
            reverseProxyUrl?: string;
        }
    >
>;

const instancesURLs = {
    EU: 'https://eu.i.posthog.com',
    US: 'https://us.i.posthog.com',
} as const;

const uiHosts = {
    EU: 'https://eu.posthog.com',
    US: 'https://us.posthog.com',
} as const;

function normalizeReverseProxyUrl(url: string): string {
    let u = url.trim();
    if (!u) {
        return '';
    }
    u = u.replace(/\/+$/, '');
    if (!/^https?:\/\//i.test(u)) {
        u = `https://${u}`;
    }
    return u;
}

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: PostHogRuntimeContext,
) => {
    const projectApiKey = environment.siteInstallation?.configuration?.projectApiKey;
    const instanceAddress = environment.siteInstallation?.configuration?.instanceAddress;
    const reverseProxyRaw = environment.siteInstallation?.configuration?.reverseProxyUrl;
    if (!projectApiKey) {
        throw new Error(
            `The PostHog project API key is missing from the space configuration (ID: ${
                'spaceId' in event ? event.spaceId : event.siteId
            }).`,
        );
    }
    if (!instanceAddress) {
        throw new Error(
            `The PostHog instance address is missing from the space configuration (ID: ${
                'spaceId' in event ? event.spaceId : event.siteId
            }).`,
        );
    }

    const normalizedProxy = reverseProxyRaw ? normalizeReverseProxyUrl(reverseProxyRaw) : '';
    const apiHost = normalizedProxy || instancesURLs[instanceAddress];
    const uiHost = uiHosts[instanceAddress];

    return new Response(
        (script as string)
            .replace('<ph_project_api_key>', projectApiKey)
            .replace('<ph_api_host>', apiHost)
            .replace('<ph_ui_host>', uiHost),
        {
            headers: {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'max-age=604800',
            },
        },
    );
};

export default createIntegration<PostHogRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
