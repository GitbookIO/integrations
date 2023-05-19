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
        const { toucanId, url } = element.props;

        if (!toucanId) {
            return (
                <block>
                    <card
                        title={'Toucan Toco'}
                        onPress={{
                            action: '@ui.url.open',
                            url,
                        }}
                        icon={
                            <image
                                source={{
                                    url: environment.integration.urls.icon,
                                }}
                                aspectRatio={1}
                            />
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
