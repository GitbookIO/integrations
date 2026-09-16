import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type CookieScriptRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            cookiescript_id?: string;
        }
    >
>;

/**
 * Cookie Script IDs are alphanumeric identifiers used as a path segment in the banner script URL.
 * Reject anything else rather than interpolating it into the injected script.
 */
const COOKIESCRIPT_ID_REGEX = /^[a-zA-Z0-9]+$/;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: CookieScriptRuntimeContext,
) => {
    const cookieScriptId = environment.siteInstallation?.configuration?.cookiescript_id?.trim();

    if (!cookieScriptId || !COOKIESCRIPT_ID_REGEX.test(cookieScriptId)) {
        return;
    }

    return new Response((script as string).replace('<COOKIESCRIPT_ID>', cookieScriptId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<CookieScriptRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
