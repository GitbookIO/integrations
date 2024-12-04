import {
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
    RuntimeEnvironment,
} from '@gitbook/runtime';

import rawScript from './script.raw.js';

type ZoomInfoRuntimeContext = RuntimeContext<
    RuntimeEnvironment<
        {},
        {
            script?: string;
        }
    >
>;

export const handleFetchEvent: FetchPublishScriptEventCallback = async (
    event,
    { environment }: ZoomInfoRuntimeContext,
) => {
    const script = environment.siteInstallation?.configuration?.script;
    console.log('handling fetch');
    if (!script) {
        throw new Error(
            `The ZoomInfo script is missing from the configuration (ID: ${
                'spaceId' in event ? event.spaceId : event.siteId
            }).`,
        );
    }
    // matches occurances of alphanumeric strings inside single quotes
    // of length of exactly 20, which is what we need
    const regex = /'[a-f0-9]{20}'/;

    const match = script.match(regex);
    if (!match) {
        throw new Error(`Match for ZoomInfo's site id could not be found`);
    }

    // match[0] looks like "'abc...'" we need to remove the single quotes
    const siteId = match[0].replace(/\'/g, '');
    console.log('siteId', siteId);
    console.log('rawScript', rawScript);

    return new Response((rawScript as string).replace('<TO_REPLACE>', siteId), {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration<ZoomInfoRuntimeContext>({
    fetch_published_script: handleFetchEvent,
});
