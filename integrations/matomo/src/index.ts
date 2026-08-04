import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import matomoScript from './matomoScript.raw.js';

type MatomoRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            server_url?: string;
            site_id?: string;
            load_js_tracker?: boolean;
            track_referrer?: boolean;
            track_outbound_clicks?: boolean;
            click_selectors?: string;
            goal_mappings_json?: string;
            user_id_cookie?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event: any,
    { environment }: MatomoRuntimeContext,
) => {
    const cfg = environment.siteInstallation?.configuration || {};
    const serverUrl = cfg.server_url;
    const siteId = cfg.site_id;

    if (!serverUrl || !siteId) {
        return;
    }

    const js = (matomoScript as string)
        .replace('<MATOMO_SERVER_URL>', serverUrl.replace(/\/$/, ''))
        .replace('<MATOMO_SITE_ID>', String(siteId))
        .replace('<LOAD_JS_TRACKER>', String(cfg.load_js_tracker ?? true))
        .replace('<TRACK_REFERRER>', String(cfg.track_referrer ?? true))
        .replace('<TRACK_OUTBOUND>', String(cfg.track_outbound_clicks ?? true))
        .replace('<CLICK_SELECTORS>', String(cfg.click_selectors ?? ''))
        .replace('<GOAL_MAPPINGS_JSON>', String(cfg.goal_mappings_json ?? ''))
        .replace('<USER_ID_COOKIE>', String(cfg.user_id_cookie ?? ''));

    return new Response(js, {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<MatomoRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
