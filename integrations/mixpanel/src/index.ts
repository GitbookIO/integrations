import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type MixpanelRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            project_token?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: MixpanelRuntimeContext
) => {
    const projectToken = environment.siteInstallation?.configuration?.project_token;

    if (!projectToken) {
        throw new Error(
            `The Mixpanel Project Token is missing from the configuration (ID: ${
                'spaceId' in event ? event.spaceId : event.siteId
            }).`
        );
    }

    return new Response(script.replace('<TO_REPLACE>', projectToken), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<MixpanelRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
