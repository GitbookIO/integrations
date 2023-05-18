import { createIntegration, createComponent, createOAuthHandler } from '@gitbook/runtime';

import { getGithubContent, GithubProps } from './github';
import { GithubRuntimeContext } from './types';

const embedBlock = createComponent<{ url?: string }, {}, {}, GithubRuntimeContext>({
    componentId: 'github-code-block',

    async action(element, action) {
        switch (action.action) {
            case '@link.unfurl': {
                const { url } = action;
                // const content = await getGithubContent(url);

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
        const { url } = element.props as GithubProps;
        const content = await getGithubContent(url, context);

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
                >
                    <codeblock content={content.toString()} lineNumbers={true} />
                </card>
            </block>
        );
    },
});

export default createIntegration<GithubRuntimeContext>({
    fetch: (request, context) => {
        const oauthHandler = createOAuthHandler({
            redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
            clientId: context.environment.secrets.CLIENT_ID,
            clientSecret: context.environment.secrets.CLIENT_SECRET,
            authorizeURL: 'https://github.com/login/oauth/authorize?scope=repo',
            accessTokenURL: 'https://github.com/login/oauth/access_token',
        });

        return oauthHandler(request, context);
    },
    components: [embedBlock],
});
