import { createIntegration, createComponent, createOAuthHandler } from '@gitbook/runtime';

import { getGitlabContent, GitlabProps } from './gitlab';
import { GitlabRuntimeContext } from './types';
import { getFileExtension } from './utils';

const gitlabCodeBlock = createComponent<
    { url?: string },
    { visible: boolean },
    {},
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
        const [content, filePath] = await getGitlabContent(url, context);
        const fileExtension = await getFileExtension(filePath);=
        
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
