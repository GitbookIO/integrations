import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type OsanoRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            customer_id?: string;
            config_id?: string;
            variant?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: OsanoRuntimeContext,
) => {
    const customerId = environment.siteInstallation?.configuration?.customer_id;
    const configId = environment.siteInstallation?.configuration?.config_id;
    const variant = environment.siteInstallation?.configuration?.variant;

    if (!customerId || !configId) {
        return;
    }

    return new Response(
        (script as string)
            .replace('<CUSTOMER_ID>', customerId)
            .replace('<CONFIG_ID>', configId)
            .replace('<VARIANT_QUERY>', variant ? `?variant=${encodeURIComponent(variant)}` : ''),
        {
            headers: {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'max-age=604800',
            },
        },
    );
};

export default createIntegration<OsanoRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
