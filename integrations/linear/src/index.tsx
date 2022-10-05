import { createIntegration, createComponent, createOAuthHandler } from '@gitbook/runtime';
import { extractLinearIssueIdFromLink, getLinearAPIClient } from './linear';
import { LinearRuntimeContext } from './types';

/**
 * Component to render the block when embeding a Linear issue URL.
 */
const embedBlock = createComponent<{
    url?: string;
    issueId?: string;
}>({
    componentId: 'embed',

    async action(element, action, context) {
        switch (action.action) {
            case '@link.unfurl': {
                const { url } = action;
                const issueId = extractLinearIssueIdFromLink(url);

                return {
                    props: {
                        url,
                        issueId,
                    },
                };
            }
        }

        return element;
    },

    async render(element, context) {
        const { environment } = context;
        const { installation } = environment;

        if (!installation) {
            return;
        }

        const { issueId, url } = element.props;

        const linearClient = await getLinearAPIClient(installation.configuration);
        const { issue } = await linearClient.issue({ id: issueId });

        return (
            <block>
                <card
                    title={issue.title}
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
    },
});

export default createIntegration<LinearRuntimeContext>({
    fetch: (request, context) => {
        const oauthHandler = createOAuthHandler({
            redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
            clientId: environment.secrets.CLIENT_ID,
            clientSecret: environment.secrets.CLIENT_SECRET,
            authorizeURL: 'https://linear.app/oauth/authorize',
            accessTokenURL: 'https://api.linear.app/oauth/token',
        });

        return oauthHandler(request, context);
    },
    components: [embedBlock],
});
