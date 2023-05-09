import { createIntegration, createComponent } from '@gitbook/runtime';

import { getGithubContent, GithubProps } from './github';

const githubCodeBlock = createComponent({
    componentId: 'github-code-block',
    async action(block, action) {
        if (action.action === '@link.unfurl') {
            const content = await getGithubContent(action.url);

            return {
                props: {
                    content,
                    url: action.url,
                },
            };
        }
    },
    async render(block, context) {
        const { content, url } = block.props as GithubProps;

        if (!content) {
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
                <card
                    title={url}
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
                    buttons={[
                        <button
                            icon="maximize"
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
                    <codeblock content={content.toString()} lineNumbers={true} />
                </card>
            </block>
        );
    },
});

export default createIntegration({
    components: [githubCodeBlock],
});
