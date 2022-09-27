import { createIntegration, createComponent } from '@gitbook/runtime';
import { handleFetchEvent } from './fetch';

const pageBlock = createComponent<{}, {}>({
    componentId: 'page',
    async render(element, { environment }) {
        return (
            <block>
                <card title="All Systems Operational" />
            </block>
        );
    },
});

export default createIntegration({
    fetch: handleFetchEvent,
    components: [pageBlock],
});
