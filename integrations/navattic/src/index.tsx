import {
    createIntegration,
    createComponent,
    RuntimeEnvironment,
    RuntimeContext,
} from '@gitbook/runtime';

import { extractNavatticDemoIdFromURL } from './navattic';

interface NavatticInstallationConfiguration {}

type NavatticRuntimeEnvironment = RuntimeEnvironment<NavatticInstallationConfiguration>;
type NavatticRuntimeContext = RuntimeContext<NavatticRuntimeEnvironment>;

// Navattic recommends a 16:10 aspect ratio for embedded demos.
const DEFAULT_ASPECT_RATIO = 16 / 10;

/**
 * Component to render the block when embeding a Navattic demo URL.
 */
const embedBlock = createComponent<{
    demoId?: string;
    url?: string;
}>({
    componentId: 'embed',

    async action(element, action) {
        switch (action.action) {
            case '@link.unfurl': {
                const { url } = action;
                const nodeProps = extractNavatticDemoIdFromURL(url);

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
        const { demoId, url } = element.props;

        if (!demoId) {
            return (
                <block>
                    <card
                        title={'Navattic'}
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

        const embedUrl = `https://capture.navattic.com/${demoId}`;
        return (
            <block>
                <webframe
                    source={{
                        url: embedUrl,
                    }}
                    aspectRatio={DEFAULT_ASPECT_RATIO}
                />
            </block>
        );
    },
});

export default createIntegration<NavatticRuntimeContext>({
    components: [embedBlock],
});
