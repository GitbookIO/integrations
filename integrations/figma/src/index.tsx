import { createIntegration, createComponent, createOAuthHandler, RuntimeEnvironment, RuntimeContext } from "@gitbook/runtime";
import { extractNodeFromURL, fetchFigmaFile, fetchFigmaNode } from "./figma";

interface FigmaInstallationConfiguration {
    oauth_credentials?: {
        access_token: string;
    };
}

type FigmaRuntimeEnvironment = RuntimeEnvironment<FigmaInstallationConfiguration>;
type FigmaRuntimeContext = RuntimeContext<FigmaRuntimeEnvironment>;

/**
 * Component to render the block when embeding a Figma URL.
 */
const embedBlock = createComponent<{
    fileId?: string;
    nodeId?: string;
    url?: string;
}>({
    componentId: 'embed',

    async action(element, action) {
        switch (action.action) {
            case '@link.unfurl': {
                const { url } = action;
                const nodeProps = extractNodeFromURL(url);
                
                return {
                    props: {
                        ...nodeProps,
                        url,
                    }
                }
            }
        }

        return element;
    },

    async render(element, context) {
        const { fileId, nodeId, url } = element.props;

        if (!fileId) {
            return (
                <block>
                    <card
                    title={'Not found'}
                    onPress={{
                        action: '@ui.url.open',
                        url,
                    }}
                    icon={(
                        <image
                            source={{
                                url: context.environment.integration.urls.icon,
                            }}
                            aspectRatio={1}
                        />
                    )} />
                </block>
            );
        }

        const file = nodeId ? await fetchFigmaNode(fileId, nodeId, context) : await fetchFigmaFile(fileId, context);
        
        return (
            <block>
                <card
                title={file ? file.name + (file.nodeName ? ` - ${file.nodeName}` : '') :  'Not found'}
                onPress={{
                    action: '@ui.url.open',
                    url,
                }}
                icon={(
                    <image
                        source={{
                            url: context.environment.integration.urls.icon,
                        }}
                        aspectRatio={1}
                    />
                )}
                buttons={[
                    <button icon="maximize" tooltip="Open preview" action={{
                        action: '@ui.modal.open',
                        componentId: 'previewModal',
                        props: {
                            url,
                        }
                    }} />
                ]}
                >
                    {file.nodeImage ? (
                        <image
                            source={{
                                url: file.nodeImage.url,
                            }}
                            aspectRatio={file.nodeImage.width / file.nodeImage.height}
                        />
                    ) : null}
                </card>
            </block>
        );
    }
})

/**
 * Component to render the preview modal when zooming.
 */
const previewModal = createComponent<{
    url: string
}>({
    componentId: 'previewModal',

    async render(element, context) {
        const url = new URL('https://www.figma.com/embed');
        url.searchParams.set('embed_host', 'gitbook.com');
        url.searchParams.set('url', element.props.url);

        return (
            <modal size="fullscreen">
                <webframe source={{
                    url: url.toString()
                }} />
            </modal>
        )
    }
})

export default createIntegration<FigmaRuntimeContext>({
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
    components: [embedBlock, previewModal]
});
