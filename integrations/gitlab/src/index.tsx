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
        const base64URLEncode = (str) => {
            return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        };
        const verifier = base64URLEncode(crypto.randomBytes(32));

        const sha256 = (buffer) => {
            return crypto.createHash('sha256').update(buffer).digest();
        };
        const challenge = base64URLEncode(sha256(verifier));

        const oauthHandler = createOAuthHandler({
            redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
            clientId: context.environment.secrets.CLIENT_ID,
            clientSecret: context.environment.secrets.CLIENT_SECRET,
            authorizeURL: `https://gitlab.com/login/oauth/authorize?scope=read_repository&code_challenge=${challenge}&code_challenge_method=S256`,
            accessTokenURL: 'https://gitlab.com/login/oauth/token',
        });

        return oauthHandler(request, context);
    },
    components: [gitlabCodeBlock],
});
