import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type IntercomRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            app_id?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: IntercomRuntimeContext
) => {
    const appId = environment.spaceInstallation.configuration.app_id;
    if (!appId) {
        throw new Error(
            `The Intercom application ID is missing from the Space (ID: ${event.installationId}) installation.`
        );
    }

    return new Response(script.replace('<TO_REPLACE>', appId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<IntercomRuntimeContext>({
    events: {
        fetch_published_script: handleFetchEvent,
    },
});
