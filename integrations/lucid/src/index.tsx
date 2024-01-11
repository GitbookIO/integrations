import { createIntegration, createComponent, createOAuthHandler } from '@gitbook/runtime';

const LucidComponent = createComponent<{
    url?: string;
}>({
    componentId: 'lucid-component',

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

        const lucidEmbedUrl = `https://lucid.app/embeds/link?document=${documentId}&clientId=${context.environment.secrets.CLIENT_ID}`;

        return (
            <block>
                <webframe
                    source={{
                        url: lucidEmbedUrl,
                    }}
                    aspectRatio={1}
                />
            </block>
        );
    },
});

export default createIntegration({
    fetch: (request, context) => {
        const oauthHandler = createOAuthHandler({
            redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
            clientId: context.environment.secrets.CLIENT_ID,
            clientSecret: context.environment.secrets.CLIENT_SECRET,
            scopes: ['lucidchart.document.app'],
            authorizeURL: 'https://lucid.app/oauth2/authorize',
            accessTokenURL: `https://api.lucid.co/oauth2/token`,
        });

        return oauthHandler(request, context);
    },
    components: [LucidComponent],
});
