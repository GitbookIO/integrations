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
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: PostHogRuntimeContext,
) => {
    const instancesURLs = {
        EU: 'https://eu.i.posthog.com',
        US: 'https://us.i.posthog.com',
    };
    const projectApiKey = environment.siteInstallation?.configuration?.projectApiKey;
    const instanceAddress = environment.siteInstallation?.configuration?.instanceAddress;
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

    return new Response(
        (script as string)
            .replace('<ph_project_api_key>', projectApiKey)
            .replace('<ph_instance_address>', instancesURLs[instanceAddress]),
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
