import { Router } from 'itty-router';

import { ContentKitIcon } from '@gitbook/api';
import {
    createIntegration,
    createComponent,
    createOAuthHandler,
    FetchEventCallback,
} from '@gitbook/runtime';

import { getGithubContent, GithubProps } from './github';
import { getGithubOAuthConfiguration } from './oauth';
import { GithubRuntimeContext } from './types';
import { getFileExtension } from './utils';

const embedBlock = createComponent<
    { url?: string; visible?: boolean },
    { visible: boolean },
    {
        action: 'show' | 'hide';
    },
    GithubRuntimeContext
>({
    componentId: 'github-code-block',
    initialState: (props) => {
        return {
            visible: props.visible ?? true,
        };
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
                return {
                    ...element,
                    state: { visible: true },
                    props: {
                        ...element.props,
                        visible: true,
                    },
                };
            }
            case 'hide': {
                return {
                    ...element,
                    state: { visible: false },
                    props: { ...element.props, visible: false },
                };
            }
        }

        return element;
    },

    async render(element, context) {
        const { url } = element.props as GithubProps;
        const found = await getGithubContent(url, context);

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
                            context.environment.integration.urls.icon ? (
                                <image
                                    source={{
                                        url: context.environment.integration.urls.icon,
                                    }}
                                    aspectRatio={1}
                                />
                            ) : undefined
                        }
                    />
                </block>
            );
        }

        const { content, fileName } = found;
        const fileExtension = await getFileExtension(fileName);

        return (
            <block
                controls={[
                    element.state.visible
                        ? {
                              label: 'Hide title & link',
                              icon: ContentKitIcon.EyeOff,
                              onPress: {
                                  action: 'hide',
                              },
                          }
                        : {
                              label: 'Show title & link',
                              icon: ContentKitIcon.Eye,
                              onPress: {
                                  action: 'show',
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
                        context.environment.integration.urls.icon ? (
                            <image
                                source={{
                                    url: context.environment.integration.urls.icon,
                                }}
                                aspectRatio={1}
                            />
                        ) : undefined
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

const handleFetchEvent: FetchEventCallback<GithubRuntimeContext> = async (request, context) => {
    const { environment } = context;

    const router = Router({
        base: new URL(
            environment.spaceInstallation?.urls?.publicEndpoint ||
                environment.installation?.urls.publicEndpoint ||
                environment.integration.urls.publicEndpoint,
        ).pathname,
    });

    /*
     * Authenticate the user using OAuth.
     */
    router.get(
        '/oauth',
        // @ts-ignore
        createOAuthHandler(getGithubOAuthConfiguration(context)),
    );

    const response = await router.handle(request, context);
    if (!response) {
        return new Response(`No route matching ${request.method} ${request.url}`, {
            status: 404,
        });
    }

    return response;
};

export default createIntegration<GithubRuntimeContext>({
    fetch: handleFetchEvent,
    components: [embedBlock],
});
