import {
    createIntegration,
    createOAuthHandler,
} from '@gitbook/runtime';
import { ZendeskRuntimeContext } from './types';

export default createIntegration<ZendeskRuntimeContext>({
    fetch: (request, context) => {
        const oauthHandler = createOAuthHandler({
            redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
            clientId: context.environment.secrets.CLIENT_ID,
            clientSecret: context.environment.secrets.CLIENT_SECRET,
            authorizeURL: 'https://www.figma.com/oauth?scope=file_read',
            accessTokenURL: 'https://api.figma.com/v1/oauth/token',
        });

        return oauthHandler(request, context);
    },
});
