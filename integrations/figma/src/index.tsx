import { createIntegration, createComponent, createOAuthHandler } from "@gitbook/runtime";

/**
 * 
 */
const embedBlock = createComponent<{
    fileId?: string;
    url?: string;
}>({
    componentId: 'embed',

    async action(element, action) {
        switch (action.action) {
            case '@link.unfurl': {
                const { url } = action;
                const fileId = extractFileIdFromURL(url);
                
                return {
                    props: {
                        fileId,
                        url,
                    }
                }
            }
        }

        return element;
    },

    async render(element, { environment }) {
        const { fileId, url } = element.props;
        
        return (
            <block>
                <card
                title={fileId || 'Not found'}
                onPress={{
                    action: '@ui.url.open',
                    url,
                }}>
                    <image
                        source={{
                            url: 'https://www.figma.com/favicon.ico',
                        }}
                    />
                </card>
            </block>
        );
    }
})

function extractFileIdFromURL(input: string): string | undefined {
    // https://www.figma.com/file/<id>/...
    const url = new URL(input);
    if (url.hostname !== 'www.figma.com') {
        return;
    }

    const parts = url.pathname.split('/');
    if (parts[1] !== 'file') {
        return;
    }

    return parts[2];
}


export default createIntegration({
    events: {
        fetch: (request, context) => {
            const oauthHandler = createOAuthHandler({
                redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
                clientId: environment.secrets.CLIENT_ID || 'cSdAhvzjrFTG61DEGnxnb6',
                clientSecret: environment.secrets.CLIENT_SECRET || 'AFUd58LjGNoA2RzWsgXzP2Dn5WgRpu',
                authorizeURL: 'https://www.figma.com/oauth?scope=file_read',
                accessTokenURL: 'https://www.figma.com/api/oauth/token',
            })

            return oauthHandler(request, context);
        }
    },
    components: [embedBlock]
});
