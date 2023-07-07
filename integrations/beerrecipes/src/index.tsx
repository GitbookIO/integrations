import {
    createIntegration,
    createComponent,
    FetchEventCallback,
    RuntimeContext,
} from '@gitbook/runtime';

type IntegrationContext = {} & RuntimeContext;
type IntegrationBlockProps = {};
type IntegrationBlockState = { message: string };
type IntegrationAction = { action: 'click' };

const handleFetchEvent: FetchEventCallback<IntegrationContext> = async (request, context) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { api } = context;
    const user = api.user.getAuthenticatedUser();

    return new Response(JSON.stringify(user));
};

async function getFromFetchRequest() {
    const resp = await fetch('https://api.punkapi.com/v2/beers');

    if (!resp.ok) {
        throw new Error(`Could not fetch JIRA sites ${resp.status} ${resp.statusText}`);
    }

    const resources = await resp.json();

    return resources;
}

const beerRecipesBlock = createComponent<
    IntegrationBlockProps,
    IntegrationBlockState,
    IntegrationAction,
    IntegrationContext
>({
    componentId: 'beerrecipes',
    initialState: (props) => {
        return {
            message: 'Click Me',
        };
    },
    action: async (element, action, context) => {
        switch (action.action) {
            case 'click':
                const resp = await getFromFetchRequest();

                return {
                    props: {
                        response: resp,
                    },
                };
        }
    },
    render: async (element, context) => {
        return (
            <block>
                <text children={['Request beer recipes.']}></text>

                <text children={[`${JSON.stringify(element?.props?.response)}`]}></text>

                <input
                    element={
                        <checkbox
                            state="toppings"
                            value="onions"
                            confirm={{
                                title: 'Are you sure?',
                                text: 'Bla bla bla',
                                confirm: 'Yes',
                            }}
                        />
                    }
                    label="Yes, I want to request images"
                    hint="This will make an outgoing fetch request."
                ></input>
                <button label="Get data" onPress={{ action: 'click' }}></button>
            </block>
        );
    },
});

export default createIntegration({
    fetch: handleFetchEvent,
    components: [beerRecipesBlock],
    events: {},
});
