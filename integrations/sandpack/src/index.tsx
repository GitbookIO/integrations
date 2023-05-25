import { Sandpack } from "@codesandbox/sandpack-react";
import {
    createIntegration,
    createComponent,
    FetchEventCallback,
    RuntimeContext,
} from '@gitbook/runtime';

type IntegrationContext = {} & RuntimeContext;

const handleFetchEvent: FetchEventCallback<IntegrationContext> = async (request, context) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { api } = context;
    const user = api.user.getAuthenticatedUser();

    return new Response(JSON.stringify(user));
};

const exampleBlock = createComponent({
    componentId: 'sandpack',
    initialState: (props) => {
        return {
            message: 'Click Me',
        };
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'click':
                console.log('Button Clicked');
                return {};
        }
    },
    render: async (element, action, context) => {
        const files = {}

        return <Sandpack files={files} theme="dark" template="nextjs"></Sandpack>;
    },
});

export default createIntegration({
    fetch: handleFetchEvent,
    components: [exampleBlock],
    events: {},
});
