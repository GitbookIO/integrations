import {
    createIntegration,
    createComponent,
    createOAuthHandler,
    RuntimeEnvironment,
    RuntimeContext,
} from '@gitbook/runtime';

interface LinearInstallationConfiguration {
    oauth_credentials?: {
        access_token: string;
    };
}

type LinearRuntimeEnvironment = RuntimeEnvironment<LinearInstallationConfiguration>;
type LinearRuntimeContext = RuntimeContext<LinearRuntimeEnvironment>;

/**
 * Component to render the block when embeding a Linear issue URL.
 */
const embedBlock = createComponent<{
    url?: string;
}>({
    componentId: 'embed',

    async action(element, action) {
        switch (action.action) {
            case '@link.unfurl': {
                const { url } = action;
                // Extract the issue details
            }
        }

        return element;
    },

    async render(element, context) {
        return <block></block>;
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
