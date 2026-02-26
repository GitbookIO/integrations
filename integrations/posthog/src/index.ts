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
            identifyUsers?: boolean;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment, currentUser }: PostHogRuntimeContext,
) => {
    const instancesURLs = {
        EU: 'https://eu.i.posthog.com',
        US: 'https://us.i.posthog.com',
    };
    const projectApiKey = environment.siteInstallation?.configuration?.projectApiKey;
    const instanceAddress = environment.siteInstallation?.configuration?.instanceAddress;
    const identifyUsers = environment.siteInstallation?.configuration?.identifyUsers ?? false;

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

    let scriptContent = script as string;
    scriptContent = scriptContent.replace('<ph_project_api_key>', projectApiKey);
    scriptContent = scriptContent.replace('<ph_instance_address>', instancesURLs[instanceAddress]);

    // Add user identification after PostHog initialization if enabled
    if (identifyUsers && currentUser) {
        scriptContent += `
posthog.identify("${currentUser.id}", {
    name: "${currentUser.displayName || ''}",
    email: "${currentUser.email || ''}",
    avatar: "${currentUser.photoURL || ''}"
});
`;
    }

    return new Response(scriptContent, {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<PostHogRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
