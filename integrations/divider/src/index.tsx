import {
    createIntegration,
    createComponent,
    FetchEventCallback,
    RuntimeContext,
} from '@gitbook/runtime';

type IntegrationContext = {} & RuntimeContext;

const handleFetchEvent: FetchEventCallback<IntegrationContext> = async (request, context) => {
    // Use the API to make requests to GitBook
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { api } = context;

    return new Response('Hello World');
};

/**
 * Component to render the divider.
 */
const divider = createComponent<{
    url: string;
}>({
    componentId: 'divider',

    async render(element, context) {
        return (
            <block>
                <divider />
            </block>
        );
    },
});

export default createIntegration({
    fetch: handleFetchEvent,
    components: [divider],
    events: {},
});
