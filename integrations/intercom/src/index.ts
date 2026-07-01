import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type IntercomRegion = 'US' | 'EU' | 'Australia';

type IntercomRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            app_id?: string;
            region?: IntercomRegion;
        }
    >
>;

const apiBases: Record<IntercomRegion, string> = {
    US: 'https://api-iam.intercom.io',
    EU: 'https://api-iam.eu.intercom.io',
    Australia: 'https://api-iam.au.intercom.io',
};

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: IntercomRuntimeContext,
) => {
    const appId = environment.siteInstallation?.configuration?.app_id;

    if (!appId) {
        return;
    }

    const region = environment.siteInstallation?.configuration?.region ?? 'US';
    const apiBase = apiBases[region] ?? apiBases.US;

    return new Response(
        (script as string).replace('<TO_REPLACE>', appId).replace('<API_BASE>', apiBase),
        {
            headers: {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'max-age=604800',
            },
        },
    );
};

export default createIntegration<IntercomRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
