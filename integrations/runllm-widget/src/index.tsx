import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type IntercomRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            native_ai_experience?: boolean;
            assistant_id?: string;
            name?: string;
            server_address?: string;
            position?: string;
            logo?: string;
            theme_color?: string;
            keyboard_shortcut?: string;
            community_type?: string;
            community_url?: string;
            disable_ask_a_person?: boolean;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: IntercomRuntimeContext,
) => {
    const config = environment.siteInstallation?.configuration;
    const assistantId = config?.assistant_id;
    const nativeAiExperience = environment.siteInstallation?.configuration?.native_ai_experience;

    if (!assistantId) {
        return;
    }

    const name = config?.name ?? '';
    const serverAddress = config?.server_address ?? '';
    const position = config?.position ?? '';
    const logo = config?.logo ?? '';
    const themeColor = config?.theme_color ?? '';
    const keyboardShortcut = config?.keyboard_shortcut ?? '';
    const communityType = config?.community_type ?? '';
    const communityUrl = config?.community_url ?? '';
    const disableAskAPerson = config?.disable_ask_a_person ? 'false' : '';

    return new Response(
        (script as string)
            .replace('<NATIVE_AI_EXPERIENCE>', nativeAiExperience ? 'true' : 'false')
            .replace('<ASSISTANT_ID>', assistantId)
            .replace('<NAME>', name)
            .replace('<SERVER_ADDRESS>', serverAddress)
            .replace('<POSITION>', position)
            .replace('<KEYBOARD_SHORTCUT>', keyboardShortcut)
            .replace('<THEME_COLOR>', themeColor)
            .replace('<BRAND_LOGO>', logo)
            .replace('<COMMUNITY_URL>', communityUrl)
            .replace('<COMMUNITY_TYPE>', communityType)
            .replace('<DISABLE_ASK_A_PERSON>', disableAskAPerson)
        {
            headers: {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'max-age=604800',
            },
        },
    );
};

export default createIntegration<IntercomRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
