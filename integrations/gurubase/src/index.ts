import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type GurubaseConfig = {
    widgetId: string;
    text?: string;
    marginBottom?: string;
    marginRight?: string;
    bgColor?: string;
    iconUrl?: string;
    name?: string;
    lightMode?: boolean;
    baseUrl?: string;
}

type GurubaseRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        GurubaseConfig
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: GurubaseRuntimeContext,
) => {
    const config = environment.siteInstallation?.configuration;
    if (!config?.widgetId) {
        throw new Error(
            `The Gurubase Widget ID is missing from the configuration (ID: ${
                'spaceId' in event ? event.spaceId : event.siteId
            }).`,
        );
    }

    // Create configuration object for the widget
    const widgetConfig = {
        widgetId: config.widgetId,
        text: config.text || 'Ask AI',
        margins: {
            bottom: config.marginBottom || '20px',
            right: config.marginRight || '20px'
        },
        bgColor: config.bgColor,
        iconUrl: config.iconUrl,
        name: config.name || 'AI Assistant',
        lightMode: config.lightMode || false,
        baseUrl: config.baseUrl,
    };

    return new Response(
        (script as string).replace(
            "'<TO_REPLACE>'",
            JSON.stringify(widgetConfig)
        ),
        {
            headers: {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'max-age=604800',
            },
        }
    );
};

export default createIntegration<GurubaseRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
