import { Router } from 'itty-router';
import {
    createIntegration,
    createComponent,
    RuntimeContext,
    FetchEventCallback,
} from '@gitbook/runtime';
import { fetchRunKitFromLink } from './runkit';
import { getWebFrameHTML } from './webframe';

const runKitEmbedBlock = createComponent<{
    content?: string;
    nodeVersion?: string;
    url?: string;
}>({
    componentId: 'runkitEmbed',
    initialState: (props) => {
        return {
            content: props.content || `// Hello world!`,
            nodeVersion: props.nodeVersion,
        };
    },
    async action(element, action) {
        switch (action.action) {
            case '@link.unfurl': {
                const { url } = action;
                const { content, nodeVersion } = await fetchRunKitFromLink(url);

                return {
                    props: {
                        url,
                        content,
                        nodeVersion,
                    },
                };
            }
        }

        return element;
    },
    async render(element, context) {
        const { environment } = context;
        const { editable } = element.context;

        const renderRunKitURL = new URL(`${environment.integration.urls.publicEndpoint}/webframe`);
        renderRunKitURL.searchParams.set('readOnly', editable ? 'false' : 'true');

        return (
            <block>
                <box>
                    <webframe
                        source={{
                            url: renderRunKitURL.toString(),
                        }}
                        data={{
                            content: element.dynamicState('content'),
                            nodeVersion: element.dynamicState('nodeVersion'),
                        }}
                    />
                </box>
            </block>
        );
    },
});

const handleFetchEvent: FetchEventCallback<RuntimeContext> = async (request, context) => {
    const { environment } = context;
    const router = Router({
        base: new URL(
            environment.spaceInstallation?.urls?.publicEndpoint ||
                environment.installation?.urls.publicEndpoint ||
                environment.integration.urls.publicEndpoint
        ).pathname,
    });

    /**
     * Handle requests to serve the webframe content.
     */
    router.get('/webframe', async (request) => {
        const readOnly = request.query?.readOnly === 'true';
        return new Response(getWebFrameHTML(readOnly), {
            headers: {
                'Content-Type': 'text/html',
            },
        });
    });

    const response = await router.handle(request, context);
    if (!response) {
        return new Response(`No route matching`, { status: 404 });
    }

    return response;
};

export default createIntegration({
    fetch: handleFetchEvent,
    components: [runKitEmbedBlock],
});
