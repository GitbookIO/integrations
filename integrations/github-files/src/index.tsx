import { Router } from 'itty-router';

import { RequestUpdateIntegrationInstallation } from '@gitbook/api';
import {
    createIntegration,
    createComponent,
    createOAuthHandler,
    OAuthResponse,
    FetchEventCallback,
} from '@gitbook/runtime';

import { getGithubContent, GithubProps } from './github';
import { GithubRuntimeContext } from './types';
import { getFileExtension } from './utils';

const embedBlock = createComponent<
    { url?: string },
    { visible: boolean },
    {
        action: 'show' | 'hide';
    },
    GithubRuntimeContext
>({
    componentId: 'github-code-block',
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
        createOAuthHandler({
            redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
            clientId: environment.secrets.CLIENT_ID,
            clientSecret: environment.secrets.CLIENT_SECRET,
            authorizeURL: 'https://github.com/login/oauth/authorize',
            accessTokenURL: 'https://github.com/login/oauth/access_token',
            scopes: ['repo'],
            prompt: 'consent',
            extractCredentials,
        }),
    );

    const response = await router.handle(request, context);
    if (!response) {
        return new Response(`No route matching ${request.method} ${request.url}`, {
            status: 404,
        });
    }

    return response;
};

const extractCredentials = async (
    response: OAuthResponse,
): Promise<RequestUpdateIntegrationInstallation> => {
    const { access_token } = response;

    return {
        configuration: {
            oauth_credentials: {
                access_token,
                expires_at: Date.now() + response.expires_in * 1000,
                refresh_token: response.refresh_token,
            },
        },
    };
};

export default createIntegration<GithubRuntimeContext>({
    fetch: handleFetchEvent,
    components: [embedBlock],
});
