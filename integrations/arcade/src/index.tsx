import { Router } from 'itty-router';

import {
    createIntegration,
    createComponent,
    RuntimeEnvironment,
    RuntimeContext,
    FetchEventCallback,
    Logger,
} from '@gitbook/runtime';

import { extractArcadeFlowFromURL, fetchArcadeOEmbedData } from './arcade';
import { ArcadeEmbedStep } from './types';
import { webFrameHTML } from './webframe';

interface ArcadeInstallationConfiguration {}

type ArcadeRuntimeEnvironment = RuntimeEnvironment<ArcadeInstallationConfiguration>;
type ArcadeRuntimeContext = RuntimeContext<ArcadeRuntimeEnvironment>;

const logger = Logger('arcade');

/**
 * Component to render the block when embeding an Arcade URL.
 */
const embedBlock = createComponent<{
    flowId?: string;
    url?: string;
    currentStep?: string;
    steps?: string;
}>({
    componentId: 'embed',

    initialState: (props) => {
        return {
            steps: props.steps,
            currentStep: props.currentStep,
        };
    },

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
        const { flowId, url, steps } = element.props;

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

        const embedData = await fetchArcadeOEmbedData(flowId);
        const aspectRatio = embedData.width / embedData.height;
        const embedWebFrame = (
            <webframe
                source={{
                    url: `${environment.integration.urls.publicEndpoint}/webframe`,
                }}
                aspectRatio={aspectRatio}
                data={{
                    flowId,
                    currentStep: element.dynamicState('currentStep'),
                    steps: element.dynamicState('steps'),
                }}
            />
        );

        let flowSteps: Array<ArcadeEmbedStep> = [];
        if (steps) {
            try {
                flowSteps = JSON.parse(steps) as Array<ArcadeEmbedStep>;
            } catch (err) {
                logger.info(
                    'Error while deserializing the Arcade flow steps. Defaulting to no steps.'
                );
            }
        }
        return flowSteps.length > 0 ? (
            <block>
                <hstack>
                    <box grow={2}>{embedWebFrame}</box>
                    <box>
                        <vstack>
                            {flowSteps.map((flowStep, index) => (
                                <input
                                    label={flowStep.name ? flowStep.name : `Step ${index + 1}`}
                                    hint={flowStep.description}
                                    element={<radio state="currentStep" value={flowStep.id} />}
                                />
                            ))}
                        </vstack>
                    </box>
                </hstack>
            </block>
        ) : (
            <block>{embedWebFrame}</block>
        );
    },
});

const handleFetchEvent: FetchEventCallback<RuntimeContext> = async (request, context) => {
    const { environment } = context;
    const router = Router({
        base: new URL(
            environment.spaceInstallation?.urls?.publicEndpoint ||
                environment.installation?.urls.publicEndpoint ||
                environment.integration.urls.publicEndpoint
        ).pathname,
    });

    /**
     * Handle requests to serve the webframe content.
     */
    router.get(
        '/webframe',
        async (request) =>
            new Response(webFrameHTML, {
                headers: {
                    'Content-Type': 'text/html',
                },
            })
    );

    const response = await router.handle(request, context);
    if (!response) {
        return new Response(`No route matching`, { status: 404 });
    }

    return response;
};

export default createIntegration<ArcadeRuntimeContext>({
    fetch: handleFetchEvent,
    components: [embedBlock],
});
