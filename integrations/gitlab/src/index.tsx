import { createIntegration, createComponent, createOAuthHandler } from '@gitbook/runtime';

import { getGitlabContent, GitlabProps } from './gitlab';
import { GitlabRuntimeContext } from './types';

const gitlabCodeBlock = createComponent<{ url?: string }, {}, {}, GitlabRuntimeContext>({
    componentId: 'gitlab-code-block',
    async action(element, action) {
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
        const { url } = element.props as GitlabProps;
        const content = await getGitlabContent(url, context);

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
                    {content ? <codeblock content={content.toString()} lineNumbers={true} /> : null}
                </card>
            </block>
        );
    },
});

export default createIntegration<GitlabRuntimeContext>({
    fetch: (request, context) => {
        const oauthHandler = createOAuthHandler({
            redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
            clientId: context.environment.secrets.CLIENT_ID,
            clientSecret: context.environment.secrets.CLIENT_SECRET,
            authorizeURL: 'https://gitlab.com/oauth/authorize?scope=read_repository',
            accessTokenURL: 'https://gitlab.com/oauth/token',
        });

        return oauthHandler(request, context);
    },
    components: [gitlabCodeBlock],
});
