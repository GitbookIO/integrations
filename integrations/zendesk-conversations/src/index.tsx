import {
    createIntegration,
    createOAuthHandler,
    ExposableError,
} from '@gitbook/runtime';
import type { IntegrationInstallation } from '@gitbook/api';
import { ZendeskRuntimeContext } from './types';
import { configComponent } from './config';
import { getZendeskOAuthConfig } from './client';

export default createIntegration<ZendeskRuntimeContext>({
    fetch: (request, context) => {
        const oauthHandler = createOAuthHandler(getZendeskOAuthConfig(context), { replace: false });
        return oauthHandler(request, context);
    },
    components: [configComponent]
});
