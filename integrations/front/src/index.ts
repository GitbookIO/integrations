import {
    createIntegration,
    IntegrationError,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import script from './script.raw.js';

type FrontRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            chat_id?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: FrontRuntimeContext,
) => {
    const chatId = environment.siteInstallation?.configuration?.chat_id;
    if (!chatId) {
        throw new IntegrationError('configuration_required');
    }

    return new Response((script as string).replace('<TO_REPLACE>', chatId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<FrontRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
