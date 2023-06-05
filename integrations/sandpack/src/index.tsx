import {
    createComponent,
    createIntegration,
    FetchPublishScriptEventCallback,
    RuntimeContext,
} from '@gitbook/runtime';

import script from './script.raw.js';

const embedBlock = createComponent<{ url?: string }, {}, {}, RuntimeContext>({
    componentId: 'sandpack',

    async render(element, context) {
        return (
            <block>
                <card id={'iframe'}></card>
            </block>
        );
    },
});

export const handleFetchEvent: FetchPublishScriptEventCallback = async (event, { environment }) => {
    return new Response(script, {
        headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'max-age=604800',
        },
    });
};

export default createIntegration({
    fetch_published_script: handleFetchEvent,
    components: [embedBlock],
});
