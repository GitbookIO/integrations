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
            widget_url?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: FreshdeskRuntimeContext,
) => {
    const configuredWidgetURL = environment.siteInstallation?.configuration?.widget_url;
    const legacyWidgetId = environment.siteInstallation?.configuration?.widget_id;
    const widgetURL =
        configuredWidgetURL ??
        (legacyWidgetId ? `https://widget.freshworks.com/widgets/${legacyWidgetId}.js` : undefined);
    if (!widgetURL) {
        throw new Error(
            `The Freshdesk Widget URL is missing from the configuration (ID: ${
                'spaceId' in event ? event.spaceId : event.siteId
            }).`,
        );
    }

    const widgetId = (() => {
        try {
            return new URL(widgetURL).pathname.match(/\/widgets\/([^/]+)\.js$/)?.[1];
        } catch {
            return undefined;
        }
    })();
    if (!widgetId) {
        throw new Error(
            `The Freshdesk Widget URL is invalid. Expected a URL ending with /widgets/<widget_id>.js (ID: ${
                'spaceId' in event ? event.spaceId : event.siteId
            }).`,
        );
    }

    const scriptContent = (script as string)
        .replaceAll('<WIDGET_ID>', widgetId)
        .replaceAll('<WIDGET_URL>', widgetURL);

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
