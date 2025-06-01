import {
    createIntegration,
    createOAuthHandler,
} from '@gitbook/runtime';
import { ZendeskRuntimeContext } from './types';
import { configComponent } from './config';
import { getZendeskClient, getZendeskOAuthConfig } from './client';

export default createIntegration<ZendeskRuntimeContext>({
    fetch: (request, context) => {
        const oauthHandler = createOAuthHandler(getZendeskOAuthConfig(context), { replace: false });
        return oauthHandler(request, context);
    },
    components: [configComponent],
    events: {
        installation_setup: async (event, context) => {
            const { installation } = context.environment;
            if (installation?.configuration.subdomain && installation?.configuration.oauth_credentials) {
                // Properly configured
                const client = await getZendeskClient(context);

                // Recreate the webhook.
                const name = `GitBook - ${installation.target.organization}`;
                const { webhooks } = await client.listWebhooks({ name });
                await Promise.all(webhooks.map(webhook => client.deleteWebhook(webhook.id)));
                const webhook = await client.createWebhook({
                    name: `GitBook - ${installation.target.organization}`,
                    endpoint: `${installation.urls.publicEndpoint}/webhook`,
                    subscriptions: [
                        'zen:event-type:ticket.status_changed'
                    ]
                });
                
                console.log('Webhook created', webhook);
            }
        },

    }
});
