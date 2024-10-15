import {
    createIntegration,
    createComponent,
    RuntimeEnvironment,
    RuntimeContext,
} from '@gitbook/runtime';

import { extractToucanInfoFromURL } from './toucan';

interface ToucanInstallationConfiguration {}

type ToucanRuntimeEnvironment = RuntimeEnvironment<ToucanInstallationConfiguration>;
type ToucanRuntimeContext = RuntimeContext<ToucanRuntimeEnvironment>;

/**
 * Component to render the block when embeding a Toucan Toco URL.
 */
const embedBlock = createComponent<{
    toucanId?: string;
    url?: string;
    height?: number;
    width?: number;
}>({
    componentId: 'embed',

    async action(element, action) {
        switch (action.action) {
            case '@link.unfurl': {
                const { url } = action;
                const nodeProps = extractToucanInfoFromURL(url);

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
        const { toucanId, url, height, width } = element.props;

        function getAspectRatio(height?: number, width?: number): number {
            if (height && width && height > 0 && width > 0) {
                return width / height;
            }
            return 1;
        }

        const aspectRatio = getAspectRatio(height, width);

        if (!toucanId || !url) {
            return (
                <block>
                    <card
                        title={'Toucan Toco'}
                        onPress={
                            url
                                ? {
                                      action: '@ui.url.open',
                                      url,
                                  }
                                : undefined
                        }
                        icon={
                            environment.integration.urls.icon ? (
                                <image
                                    source={{
                                        url: environment.integration.urls.icon,
                                    }}
                                    aspectRatio={aspectRatio}
                                />
                            ) : undefined
                        }
                    />
                </block>
            );
        }

        return (
            <block>
                <webframe
                    source={{
                        url,
                    }}
                    aspectRatio={1}
                />
            </block>
        );
    },
});

export default createIntegration<ToucanRuntimeContext>({
    components: [embedBlock],
});
