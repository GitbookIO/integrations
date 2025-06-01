import {
    createIntegration,
    createOAuthHandler,
    ExposableError,
} from '@gitbook/runtime';
import type { IntegrationInstallation } from '@gitbook/api';
import { ZendeskRuntimeContext } from './types';
import { configComponent } from './config';

export default createIntegration<ZendeskRuntimeContext>({
    fetch: (request, context) => {
        const oauthHandler = createOAuthHandler({
            redirectURL: `${context.environment.integration.urls.publicEndpoint}/oauth`,
            clientId: context.environment.secrets.CLIENT_ID,
            clientSecret: context.environment.secrets.CLIENT_SECRET,
            scopes: ['tickets:read'],
            authorizeURL: (installation) => {
                const subdomain = assertInstallationSubdomain(installation);
                return `https://${subdomain}.zendesk.com/oauth/authorizations/new`
            },
            accessTokenURL: (installation) => {
                const subdomain = assertInstallationSubdomain(installation);
                return `https://${subdomain}.zendesk.com/oauth/tokens`
            },
        }, { replace: false });

        return oauthHandler(request, context);
    },
    components: [configComponent]
});

function assertInstallationSubdomain(installation: IntegrationInstallation) {
    const subdomain = installation?.configuration?.subdomain;
    if (!subdomain) {
        throw new ExposableError('Subdomain is not configured');
    }

    return subdomain;
}
