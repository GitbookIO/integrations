import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type GurubaseRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            widgetId?: string;
            text?: string;
            bottomMargin?: string;
            rightMargin?: string;
            bgColor?: string;
            iconUrl?: string;
            name?: string;
            baseUrl?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: GurubaseRuntimeContext,
) => {
    const config = environment.siteInstallation?.configuration || {};
    const widgetId = config.widgetId;

    if (!widgetId) {
        throw new Error(
            `The Gurubase Widget ID is missing from the configuration (ID: ${
                'spaceId' in event ? event.spaceId : event.siteId
            }).`,
        );
    }

    const scriptConfig = {
        widgetId,
        text: config.text,
        margins: JSON.stringify({
            bottom: config.bottomMargin || '60px',
            right: config.rightMargin || '20px',
        }),
        bgColor: config.bgColor,
        iconUrl: config.iconUrl,
        name: config.name,
        baseUrl: config.baseUrl,
    };

    // Properly escape the config JSON for safe insertion into JavaScript
    const escapedConfig = JSON.stringify(scriptConfig).replace(/'/g, "\\'").replace(/"/g, '\\"');

    return new Response((script as string).replace("'<TO_REPLACE>'", `'${escapedConfig}'`), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<GurubaseRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
