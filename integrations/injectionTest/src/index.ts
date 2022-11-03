import { createIntegration, FetchPublishScriptEventCallback } from '@gitbook/runtime';

export const handleFetchEvent: FetchPublishScriptEventCallback = async () => {
    return new Response(
        `
(function(){
    alert('I was injected');
})();
`,
        {
            headers: {
                'Content-Type': 'application/javascript',
                'Cache-Control': 'max-age=604800',
            },
        }
    );
};

export default createIntegration({
    fetch_published_script: handleFetchEvent,
});
