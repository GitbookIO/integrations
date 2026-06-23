import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './plausibleScript.raw.js';

type PlausibleRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            scriptKey?: string;
            selfHostedUrl?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: PlausibleRuntimeContext,
) => {
    const scriptKey = environment.siteInstallation?.configuration?.scriptKey;
    const selfHostedUrl = environment.siteInstallation?.configuration?.selfHostedUrl || '';
    if (!scriptKey) {
        return;
    }

    const baseUrl = selfHostedUrl || 'https://plausible.io';
    const scriptSrc = `${baseUrl}/js/${scriptKey}.js`;

    return new Response((script as string).replace('<scriptSrc>', scriptSrc), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<PlausibleRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
