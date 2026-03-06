import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type FreshdeskRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            widget_id?: string;
        }
    >
>;

function parseWidgetConfiguration(
    widgetInput?: string,
): { widgetId: string; widgetURL: string } | null {
    if (!widgetInput?.trim()) {
        return null;
    }

    const value = widgetInput.trim();

    try {
        const parsedURL = new URL(value);
        const widgetId = parsedURL.pathname.match(/\/widgets\/([^/]+)\.js$/)?.[1];
        if (!widgetId) {
            return null;
        }

        return {
            widgetId,
            widgetURL: parsedURL.toString(),
        };
    } catch {
        return {
            widgetId: value,
            widgetURL: `https://widget.freshworks.com/widgets/${value}.js`,
        };
    }
}

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: FreshdeskRuntimeContext,
) => {
    const widgetInput = environment.siteInstallation?.configuration?.widget_id;
    const widgetConfig = parseWidgetConfiguration(widgetInput);
    if (!widgetConfig) {
        throw new Error(
            `The Freshdesk widget configuration is invalid. Expected a widget ID or a full URL ending with /widgets/<widget_id>.js (ID: ${
                'spaceId' in event ? event.spaceId : event.siteId
            }).`,
        );
    }

    const scriptContent = (script as string)
        .replaceAll('<WIDGET_ID>', widgetConfig.widgetId)
        .replaceAll('<WIDGET_URL>', widgetConfig.widgetURL);

    return new Response(scriptContent, {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<FreshdeskRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
