import {
    createIntegration,
    createComponent,
    FetchEventCallback,
    RuntimeContext,
} from '@gitbook/runtime';

type IntegrationContext = {} & RuntimeContext;
type IntegrationBlockProps = {};
type IntegrationBlockState = { response: any };
type IntegrationAction = { action: 'click' };

const handleFetchEvent: FetchEventCallback<IntegrationContext> = async (request, context) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { api } = context;
    const user = api.user.getAuthenticatedUser();

    return new Response(JSON.stringify(user));
};

async function getFromFetchRequest() {
    const resp = await fetch('https://api.punkapi.com/v2/beers/random');

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
            response: {},
        };
    },
    action: async (element, action, context) => {
        console.log('action: ', action);
        switch (action.action) {
            case 'click':
                const resp = await getFromFetchRequest();
                console.log('clicked');
                return {
                    state: {
                        response: resp,
                    },
                };
        }
    },
    render: async (element, context) => {
        console.log(element);
        if (element.state.response.length > 0) {
            return (
                <block>
                    <text
                        children={[
                            `Ingredients for `,
                            {
                                type: 'text',
                                style: 'bold',
                                children: [`${element.state.response[0].name}`],
                            },
                        ]}
                    />
                    <text children={[`${element.state.response[0].description}`]} />
                    <input label="Show details" element={<switch state="details" />} />

                    <text children={[`Malts`]} style="bold" />
                    {element.state.response[0].ingredients.malt.map((malt) => (
                        <vstack>
                            <input
                                label={`${malt.name}`}
                                hint={`${malt.amount.value} ${malt.amount.unit}`}
                                element={<checkbox state={`${malt.name}`} value={`${malt.name}`} />}
                            />
                        </vstack>
                    ))}

                    <text children={[`Hops`]} style="bold" />
                    {element.state.response[0].ingredients.hops.map((hop) => (
                        <vstack>
                            <input
                                label={`${hop.name}`}
                                hint={`${hop.amount.value} ${hop.amount.unit}`}
                                element={<checkbox state={`${hop.name}`} value={`${hop.name}`} />}
                            />
                        </vstack>
                    ))}

                    <text children={[`${JSON.stringify(element.state)}`]}></text>
                </block>
            );
        }

        return (
            <block>
                <text children={['Give me a random beer recipe']}></text>
                <button label="Generate recipe" onPress={{ action: 'click' }}></button>
            </block>
        );
    },
});

export default createIntegration({
    fetch: handleFetchEvent,
    components: [beerRecipesBlock],
    events: {},
});

// return <text children={[`${JSON.stringify(beer.name)}`]}></text>;
