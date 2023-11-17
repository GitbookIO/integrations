import { createIntegration, createComponent } from '@gitbook/runtime';

const tldrawBlock = createComponent<{ url: string }>({
    componentId: 'tldraw-block',

    async action(element, action: any) {
        switch (action.action) {
            case '@link.unfurl': {
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

        element.setCache({ maxAge: 1 });

        return (
            <block>
                <card
                    title={'tldraw project'}
                    icon={
                        <image
                            source={{
                                url: context.environment.integration.urls.icon,
                            }}
                            aspectRatio={1}
                        />
                    }
                    onPress={{
                        action: '@ui.modal.open',
                        componentId: 'tldraw-modal',
                        props: {
                            url,
                        },
                    }}
                    buttons={[
                        <button
                            icon={'maximize' as any}
                            tooltip="Edit"
                            onPress={{
                                action: '@ui.modal.open',
                                componentId: 'tldraw-modal',
                                props: {
                                    url,
                                },
                            }}
                        />,
                    ]}
                >
                    {/* TODO: Add a thumbnail */}
                </card>
            </block>
        );
    },
});

const tldrawModal = createComponent<{ url: string }>({
    componentId: 'tldraw-modal',

    async render(element) {
        return (
            <modal size="fullscreen">
                <webframe
                    aspectRatio={16 / 9}
                    source={{
                        url: element.props.url,
                    }}
                />
            </modal>
        );
    },
});

export default createIntegration({
    components: [tldrawModal, tldrawBlock],
    events: {},
});
