import { createIntegration, createComponent, createOAuthHandler } from '@gitbook/runtime';

import { getGitlabContent, GitlabProps } from './gitlab';
import { GitlabRuntimeContext } from './types';
import { getFileExtension } from './utils';

const gitlabCodeBlock = createComponent<
    { url?: string },
    { visible: boolean },
    {
        action: 'show' | 'hide';
    },
    GitlabRuntimeContext
>({
    componentId: 'gitlab-code-block',
    initialState: {
        visible: true,
    },
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
            case 'show': {
                return { state: { visible: true } };
            }
            case 'hide': {
                return { state: { visible: false } };
            }
        }

        return element;
    },
    async render(element, context) {
        const { url } = element.props as GitlabProps;
        const found = await getGitlabContent(url, context);

        if (!found) {
            return (
                <block>
                    <card
                        title={'Not found'}
                        onPress={{
                            action: '@ui.url.open',
                            url,
                        }}
                        icon={
                            context.environment.integration.urls.icon ? <image
                                source={{
                                    url: context.environment.integration.urls.icon,
                                }}
                                aspectRatio={1}
                            /> : undefined
                        }
                    />
                </block>
            );
        }

        const { content, filePath } = found;
        const fileExtension = await getFileExtension(filePath);

        return (
            <block
                controls={[
                    {
                        label: 'Show title & link',
                        onPress: {
                            action: 'show',
                        },
                    },
                    {
                        label: 'Hide title & link',
                        onPress: {
                            action: 'hide',
                        },
                    },
                ]}
            >
                <card
                    title={element.state.visible ? url : ''}
                    onPress={
                        element.state.visible
                            ? {
                                  action: '@ui.url.open',
                                  url,
                              }
                            : { action: 'null' }
                    }
                    icon={
                        context.environment.integration.urls.icon ? <image
                            source={{
                                url: context.environment.integration.urls.icon,
                            }}
                            aspectRatio={1}
                        /> : undefined
                    }
                >
                    {content ? (
                        <codeblock
                            content={content.toString()}
                            lineNumbers={true}
                            syntax={fileExtension}
                        />
                    ) : null}
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
            authorizeURL: 'https://gitlab.com/oauth/authorize?scope=read_repository+api',
            accessTokenURL: 'https://gitlab.com/oauth/token',
        });

        return oauthHandler(request, context);
    },
    components: [gitlabCodeBlock],
});
