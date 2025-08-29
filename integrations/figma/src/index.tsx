import {
    createIntegration,
    createComponent,
    createOAuthHandler,
    RuntimeEnvironment,
    RuntimeContext,
} from '@gitbook/runtime';
import { ContentKitIcon } from '@gitbook/api';

import { extractNodeFromURL, fetchFigmaFile, fetchFigmaNode } from './figma';

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
                    },
                };
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
                        icon={
                            context.environment.integration.urls.icon ? (
                                <image
                                    source={{
                                        url: context.environment.integration.urls.icon,
                                    }}
                                    aspectRatio={1}
                                />
                            ) : undefined
                        }
                    />
                </block>
            );
        }

        const file = nodeId ? undefined : await fetchFigmaFile(fileId, context);
        const node = nodeId ? await fetchFigmaNode(fileId, nodeId, context) : undefined;

        if (!file && !node) {
            return (
                <block>
                    <card
                        title={'Not found'}
                        onPress={{
                            action: '@ui.url.open',
                            url,
                        }}
                        icon={
                            context.environment.integration.urls.icon ? (
                                <image
                                    source={{
                                        url: context.environment.integration.urls.icon,
                                    }}
                                    aspectRatio={1}
                                />
                            ) : undefined
                        }
                    />
                </block>
            );
        }

        element.setCache({ maxAge: 60 * 60 * 24 });
        return (
            <block>
                <card
                    title={
                        (node?.name ?? file?.name) + (node?.nodeName ? ` - ${node.nodeName}` : '')
                    }
                    onPress={{
                        action: '@ui.url.open',
                        url,
                    }}
                    icon={
                        context.environment.integration.urls.icon ? (
                            <image
                                source={{
                                    url: context.environment.integration.urls.icon,
                                }}
                                aspectRatio={1}
                            />
                        ) : undefined
                    }
                    buttons={[
                        <button
                            icon={ContentKitIcon.Maximize}
                            tooltip="Open preview"
                            onPress={{
                                action: '@ui.modal.open',
                                componentId: 'previewModal',
                                props: {
                                    url,
                                },
                            }}
                        />,
                    ]}
                >
                    {node?.nodeImage ? (
                        <image
                            source={{
                                url: node.nodeImage.url,
                            }}
                            aspectRatio={node.nodeImage.width / node.nodeImage.height}
                        />
                    ) : null}
                </card>
            </block>
        );
    },
});

/**
 * Component to render the preview modal when zooming.
 */
const previewModal = createComponent<{
    url: string;
}>({
    componentId: 'previewModal',

    async render(element, context) {
        const url = new URL('https://www.figma.com/embed');
        url.searchParams.set('embed_host', 'gitbook.com');
        url.searchParams.set('url', element.props.url);

        return (
            <modal size="fullscreen">
                <webframe
                    source={{
                        url: url.toString(),
                    }}
                />
            </modal>
        );
    },
});

export default createIntegration<FigmaRuntimeContext>({
    fetch: (request, context) => {
        const oauthHandler = createOAuthHandler({
            redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
            clientId: context.environment.secrets.CLIENT_ID,
            clientSecret: context.environment.secrets.CLIENT_SECRET,
            authorizeURL: 'https://www.figma.com/oauth?scope=file_read',
            accessTokenURL: 'https://api.figma.com/v1/oauth/token',
        });

        return oauthHandler(request, context);
    },
    components: [embedBlock, previewModal],
});
