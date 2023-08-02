import { createIntegration, FetchEventCallback, RuntimeContext } from '@gitbook/runtime';

type IntegrationContext = {} & RuntimeContext;

const handleFetchEvent: FetchEventCallback<IntegrationContext> = async (request, context) => {
    return new Response('OK');
};

export default createIntegration({
    fetch: handleFetchEvent,
});
