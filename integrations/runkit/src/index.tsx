import { Router } from 'itty-router';

import {
    createIntegration,
    createComponent,
    RuntimeContext,
    FetchEventCallback,
    ExposableError,
} from '@gitbook/runtime';

import { getWebframeCacheControl, getWebframeCacheKey } from './cache';
import { fetchRunKitFromLink } from './runkit';
import { webFrameHTML } from './webframe';

type EmbedBlockProps = {
    content?: string;
    nodeVersion?: string;
    url?: string;
};

type EmbedBlockState = {
    editable: boolean;
    content: string;
    nodeVersion?: string;
};

const embedBlock = createComponent<EmbedBlockProps, EmbedBlockState>({
    componentId: 'embed',
    initialState: (props, context) => {
        return {
            editable: context.type === 'document' ? context.editable : false,
            content: props.content || `// Hello world!`,
            nodeVersion: props.nodeVersion,
        };
    },
    async action(element, action) {
        switch (action.action) {
            case '@link.unfurl': {
                const { url } = action;
                const match = await fetchRunKitFromLink(url);
                if (!match) {
                    throw new ExposableError('Invalid RunKit link');
                }

                return {
                    state: {
                        editable:
                            element.context.type === 'document' ? element.context.editable : false,
                        url,
                        content: match.content,
                        nodeVersion: match.nodeVersion,
                    },
                };
            }
        }

        return element;
    },
    async render(element, context) {
        const { environment } = context;

        const cacheKey = getWebframeCacheKey();
        const webframeURL = new URL(`${environment.integration.urls.publicEndpoint}/webframe`);
        webframeURL.search = cacheKey;

        return (
            <block>
                <webframe
                    source={{
                        url: webframeURL.toString(),
                    }}
                    data={{
                        content: element.dynamicState('content'),
                        nodeVersion: element.dynamicState('nodeVersion'),
                        editable: element.dynamicState('editable'),
                    }}
                />
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
                environment.integration.urls.publicEndpoint,
        ).pathname,
    });

    /**
     * Handle requests to serve the webframe content.
     */
    const cacheControl = getWebframeCacheControl();
    router.get(
        '/webframe',
        async (request) =>
            new Response(webFrameHTML, {
                headers: {
                    'Content-Type': 'text/html',
                    'Cache-Control': cacheControl,
                },
            }),
    );

    const response = await router.handle(request, context);
    if (!response) {
        return new Response(`No route matching`, { status: 404 });
    }

    return response;
};

export default createIntegration({
    fetch: handleFetchEvent,
    components: [embedBlock],
});
