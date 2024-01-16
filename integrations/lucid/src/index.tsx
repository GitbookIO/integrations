import { Router } from 'itty-router';

import {
    createIntegration,
    createComponent,
    createOAuthHandler,
    FetchEventCallback,
} from '@gitbook/runtime';

const defaultContent = '';

const LucidComponent = createComponent<{
    url?: string;
    content?: string;
}>({
    componentId: 'lucid-component',
    initialState: (props) => {
        return {
            content: props.content || defaultContent,
        };
    },

    async action(element, action) {
        switch (action.action) {
            case '@link.unfurl': {
                // The pasted URL
                const { url } = action;

                return {
                    props: {
                        url,
                    },
                };
            }
        }

        return element;
    },

    async render(element, context) {
        const { url } = element.props;
        const urlObject = new URL(url);
        const documentId = urlObject.pathname.split('/')[2];

        const frameUrl = new URL(context.environment.spaceInstallation?.urls?.publicEndpoint);
        frameUrl.searchParams.set('document', documentId);

        const output = (
            <webframe
                source={{
                    url: frameUrl.toString(),
                }}
                aspectRatio={16 / 9}
            />
        );

        return <block>{output}</block>;
    },
});

const handleFetchEvent: FetchEventCallback = async (request, context) => {
    const { environment } = context;

    const router = Router({
        base: new URL(
            environment.spaceInstallation?.urls?.publicEndpoint ||
                environment.installation?.urls.publicEndpoint ||
                environment.integration.urls.publicEndpoint
        ).pathname,
    });

    router.get('/', async () => {
        return new Response(
            `<html>
                <body>
                    <iframe id="lucid-embed" src="https://lucid.app/embeds/link?document=${new URL(
                        request.url
                    ).searchParams.get('document')}&clientId=${
                context.environment.secrets.CLIENT_ID
            }" style="height:100%; width: 100%;" frameborder="0" border="0"></iframe>
                </body>
            </html>`,
            {
                headers: {
                    'Content-Type': 'text/html',
                    'Cache-Control': 'public, max-age=86400',
                },
            }
        );
    });

    /*
     * Authenticate the user using OAuth.
     */
    router.get(
        '/oauth',
        // @ts-ignore
        createOAuthHandler({
            redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
            clientId: context.environment.secrets.CLIENT_ID,
            clientSecret: context.environment.secrets.CLIENT_SECRET,
            scopes: ['lucidchart.document.app'],
            authorizeURL: 'https://lucid.app/oauth2/authorize',
            accessTokenURL: `https://api.lucid.co/oauth2/token`,
        })
    );

    const response = await router.handle(request, context);
    if (!response) {
        return new Response(`No route matching ${request.method} ${request.url}`, {
            status: 404,
        });
    }

    return response;
};

export default createIntegration({
    fetch: handleFetchEvent,
    components: [LucidComponent],
});
