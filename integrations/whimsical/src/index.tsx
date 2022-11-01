import { ContentKitBlock } from '@gitbook/api';
import { createIntegration, createComponent } from '@gitbook/runtime';

const EMBED_BASE_URL = 'https://whimsical.com/embed';

function defaultBlock(url: string, iconUrl: string): ContentKitBlock {
    return (
        <block>
            <card
                title={'Whimsical'}
                hint={url}
                onPress={{
                    action: '@ui.url.open',
                    url,
                }}
                icon={
                    <image
                        source={{
                            url: iconUrl,
                        }}
                        aspectRatio={1}
                    />
                }
            />
        </block>
    );
}

const extractIdFromUrl = (input: string) => {
    const url = new URL(input);
    if (url.hostname !== 'whimsical.com') {
        return;
    }

    return url.pathname.split('/').at(-1).split('-').at(-1);
};

/**
 * Component to render the block when embeding a Figma URL.
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
                const fileId = extractIdFromUrl(url);

                return {
                    props: {
                        fileId,
                        url,
                    },
                };
            }
        }

        return element;
    },

    async render(element, context) {
        const { fileId, url } = element.props;

        if (!fileId) {
            return defaultBlock(url, context.environment.integration.urls.icon);
        }

        return (
            <block>
                <webframe
                    aspectRatio={16 / 9}
                    source={{
                        url: `${EMBED_BASE_URL}/${fileId}`,
                    }}
                />
            </block>
        );
    },
});

export default createIntegration({
    components: [embedBlock],
});
