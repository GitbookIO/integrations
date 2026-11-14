import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type GravitoRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            config_token?: string;
        }
    >
>;

const GRAVITO_CONFIGS_BASE_URL = 'https://cdn.gravito.net/cmpconfigs/';

/**
 * Only allow simple path segments in the decoded token so that the resulting URL
 * always points inside the Gravito config CDN.
 */
const CONFIG_PATH_RE = /^[A-Za-z0-9._-]+(\/[A-Za-z0-9._-]+)*\/?$/;

/**
 * Resolve the URL of the published Gravito CMP configuration from the token
 * shown in the "Deployment" tab of the Gravito CMP configurator.
 *
 * The token is the base64 encoding of the config path on the Gravito CDN,
 * which is how Gravito's own Google Tag Manager template resolves it:
 * `https://cdn.gravito.net/cmpconfigs/<decoded token>config.json`.
 *
 * The already decoded path is accepted too, but only when the value is not valid
 * base64: a decodable token that yields garbage is a typo, not a path.
 */
export function resolveConfigUrl(token: string): string | undefined {
    const trimmed = token.trim();
    if (!trimmed) {
        return undefined;
    }

    let path: string;
    try {
        path = atob(trimmed).trim();
    } catch {
        path = trimmed;
    }

    if (!CONFIG_PATH_RE.test(path) || path.split('/').includes('..')) {
        return undefined;
    }
    return `${GRAVITO_CONFIGS_BASE_URL}${path.endsWith('/') ? path : `${path}/`}config.json`;
}

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: GravitoRuntimeContext,
) => {
    const configToken = environment.siteInstallation?.configuration?.config_token;
    const configUrl = configToken ? resolveConfigUrl(configToken) : undefined;

    if (!configUrl) {
        return;
    }

    return new Response((script as string).replace('<CONFIG_URL>', configUrl), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<GravitoRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
