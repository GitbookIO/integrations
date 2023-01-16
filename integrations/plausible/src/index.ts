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
            domain?: string;
            host?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: PlausibleRuntimeContext
) => {
    const domain = environment.spaceInstallation.configuration.domain;
    const host = environment.spaceInstallation.configuration.host || 'plausible.io';
    if (!domain) {
        return;
    }

    return new Response(script.replace('<domain>', domain).replace('<host>', normalizeHost(host)), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<PlausibleRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});

function normalizeHost(host: string) {
    if (host.startsWith('https://') || host.startsWith('http://')) {
        return host;
    }

    return `https://${host}`;
}
