import {
    createIntegration,
    createComponent,
    RuntimeEnvironment,
    RuntimeContext,
} from '@gitbook/runtime';

import {
    ARCADE_OEMBED_CACHE_MAX_AGE,
    extractArcadeFlowFromURL,
    fetchArcadeOEmbedData,
} from './arcade';

interface ArcadeInstallationConfiguration {}

type ArcadeRuntimeEnvironment = RuntimeEnvironment<ArcadeInstallationConfiguration>;
type ArcadeRuntimeContext = RuntimeContext<ArcadeRuntimeEnvironment>;

/**
 * Component to render the block when embeding an Arcade URL.
 */
const embedBlock = createComponent<{
    flowId?: string;
    url?: string;
    language?: string;
}>({
    componentId: 'embed',

    async action(element, action) {
        switch (action.action) {
            case '@link.unfurl': {
                const { url } = action;
                const nodeProps = extractArcadeFlowFromURL(url);

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
        const { environment } = context;
        const { flowId, url, language } = element.props;

        if (!flowId) {
            return (
                <block>
                    <card
                        title={'Arcade'}
                        onPress={{
                            action: '@ui.url.open',
                            url,
                        }}
                        icon={
                            environment.integration.urls.icon ? (
                                <image
                                    source={{
                                        url: environment.integration.urls.icon,
                                    }}
                                    aspectRatio={1}
                                />
                            ) : undefined
                        }
                    />
                </block>
            );
        }

        const embedData = await fetchArcadeOEmbedData(flowId, context);
        // Bound output caching as well so dimension changes and deleted flows are rechecked.
        element.setCache({ maxAge: ARCADE_OEMBED_CACHE_MAX_AGE });
        const aspectRatio = embedData.width / embedData.height;
        const embedUrl = `https://demo.arcade.software/${flowId}?embed${language ? `&language=${encodeURIComponent(language)}` : ''}`;
        return (
            <block>
                <webframe
                    source={{
                        url: embedUrl,
                    }}
                    aspectRatio={aspectRatio}
                />
            </block>
        );
    },
});

export default createIntegration<ArcadeRuntimeContext>({
    components: [embedBlock],
});
