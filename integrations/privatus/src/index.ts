import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type PrivatusRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            site_id?: string;
        }
    >
>;

// Page views, engagement, outbound links and downloads, page speed, clicks and surveys.
const MODULES = 'engage,auto,vitals,clicks,ask';

const SITE_ID_PATTERN = /^pa_[A-Za-z0-9]+$/;

/**
 * Returns the trimmed site ID when it is valid, otherwise undefined.
 * Only letters and digits are allowed after "pa_", so the value is safe to put in the script.
 */
export function normalizeSiteId(value: unknown): string | undefined {
    if (typeof value !== 'string') {
        return undefined;
    }

    const siteId = value.trim();
    return SITE_ID_PATTERN.test(siteId) ? siteId : undefined;
}

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: PrivatusRuntimeContext,
) => {
    const siteId = normalizeSiteId(environment.siteInstallation?.configuration?.site_id);
    if (!siteId) {
        return;
    }

    return new Response(
        (script as string).replace('<SITE_ID>', siteId).replace('<MODULES>', MODULES),
        {
            headers: {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'max-age=604800',
            },
        },
    );
};

export default createIntegration<PrivatusRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
