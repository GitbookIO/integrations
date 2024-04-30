import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type ZendeskRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            site_tag?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: ZendeskRuntimeContext
) => {
    const trackingId =
        environment.siteInstallation?.configuration?.site_tag ??
        environment.spaceInstallation.configuration.site_tag ??
        'Site_Tag_Missing';
    if (!trackingId) {
        throw new Error(
            `The Zendesk site tag is missing from the configuration (ID: ${
                'spaceId' in event ? event.spaceId : event.siteId
            }).`
        );
    }

    return new Response(script.replace('<TO_REPLACE>', trackingId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<ZendeskRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
