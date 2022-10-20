import {
    createIntegration,
    createComponent,
    RuntimeEnvironment,
    RuntimeContext,
} from '@gitbook/runtime';

interface ArcadeInstallationConfiguration {}

type ArcadeRuntimeEnvironment = RuntimeEnvironment<ArcadeInstallationConfiguration>;
type ArcadeRuntimeContext = RuntimeContext<ArcadeRuntimeEnvironment>;

/**
 * Component to render the block when embeding an Arcade URL.
 */
const embedBlock = createComponent<{
    flowId?: string;
    url?: string;
}>({
    componentId: 'embed',

    async action(element, action) {
        switch (action.action) {
            case '@link.unfurl': {
                const { url } = action;
                const nodeProps = extractFlowFromURL(url);

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
        const { flowId, url } = element.props;

        if (!flowId) {
            return (
                <block>
                    <card
                        title={'Not found'}
                        onPress={{
                            action: '@ui.url.open',
                            url,
                        }}
                        icon={
                            <image
                                source={{
                                    url: context.environment.integration.urls.icon,
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
                        url: `https://demo.arcade.software/${flowId}`,
                    }}
                    aspectRatio={1024 / 571}
                />
            </block>
        );
    },
});

function extractFlowFromURL(input: string): {
    flowId?: string;
} {
    const url = new URL(input);
    if (!['app.arcade.software', 'demo.arcade.software'].includes(url.hostname)) {
        return;
    }

    const parts = url.pathname.split('/');
    if (!['flows', 'share'].includes(parts[1])) {
        return;
    }

    return { flowId: parts[2] };
}

export default createIntegration<ArcadeRuntimeContext>({
    components: [embedBlock],
});
