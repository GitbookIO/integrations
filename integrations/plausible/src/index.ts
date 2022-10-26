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
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: PlausibleRuntimeContext
) => {
    const domain = environment.spaceInstallation.configuration.domain;
    if (!domain) {
        throw new Error(
            `The Plausible domain is missing from the Space (ID: ${event.installationId}) installation.`
        );
    }

    return new Response(script.replace('<TO_REPLACE>', domain), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<PlausibleRuntimeContext>({
    events: {
        fetch_published_script: handleFetchEvent,
    },
});
