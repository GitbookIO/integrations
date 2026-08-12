import { Router } from 'itty-router';

import {
    createComponent,
    createIntegration,
    FetchEventCallback,
    RuntimeContext,
} from '@gitbook/runtime';

import { webFrameHTML } from './webframe';

const visitorClaimsWebframeDemo = createComponent({
    componentId: 'visitorClaimsWebframeDemo',
    async render(_element, { environment }) {
        const webframeURL = new URL(`${environment.integration.urls.publicEndpoint}/webframe`);
        webframeURL.searchParams.set('v', String(environment.integration.version));

        return (
            <block>
                <webframe
                    source={{
                        url: webframeURL.toString(),
                    }}
                    data={{
                        label: 'Visitor claims webframe demo',
                        mode: 'dev-test',
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

    router.get(
        '/webframe',
        async () =>
            new Response(webFrameHTML, {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'no-store',
                },
            }),
    );

    const response = await router.handle(request, context);
    if (!response) {
        return new Response('No route matching', { status: 404 });
    }

    return response;
};

export default createIntegration({
    fetch: handleFetchEvent,
    components: [visitorClaimsWebframeDemo],
});
