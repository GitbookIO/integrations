import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type FullStoryRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            organization_id?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: FullStoryRuntimeContext,
) => {
    const organizationId = environment.siteInstallation?.configuration?.organization_id;
    if (!organizationId) {
        return;
    }

    return new Response((script as string).replace('<TO_REPLACE>', organizationId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<FullStoryRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
