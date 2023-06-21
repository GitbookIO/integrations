import { createComponent, createIntegration, RuntimeContext } from '@gitbook/runtime';

import { getPreviewUrl } from './sandpack';

const embedBlock = createComponent<{ url?: string }, {}, {}, RuntimeContext>({
    componentId: 'sandpack',

    async render(element, context) {
        const previewUrl = await getPreviewUrl();

        return (
            <block>
                <webframe
                    source={{
                        url: previewUrl,
                    }}
                    aspectRatio={16 / 9}
                />
            </block>
        );
    },
});

export default createIntegration({
    components: [embedBlock],
});
