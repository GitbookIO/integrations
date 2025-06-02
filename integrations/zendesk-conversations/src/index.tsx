import { createIntegration, createOAuthHandler } from '@gitbook/runtime';
import { ZendeskRuntimeContext } from './types';
import { configComponent } from './config';
import { getZendeskClient, getZendeskOAuthConfig } from './client';
import { ingestTickets, parseTicketAsConversation } from './conversations';
import { ZendeskWebhookPayload } from './zendesk';

export default createIntegration<ZendeskRuntimeContext>({
    fetch: async (request, context) => {
        const url = new URL(request.url);

        /*
         * Webhook to ingest tickets when they are closed or solved.
         */
        if (url.pathname.endsWith('/webhook')) {
            const payload = await request.json<ZendeskWebhookPayload>();

            if (payload.type === 'zen:event-type:ticket.status_changed') {
                if (payload.event.current === 'CLOSED' || payload.event.current === 'SOLVED') {
                    const { installation } = context.environment;
                    if (!installation) {
                        throw new Error('Installation not found');
                    }

                    const client = await getZendeskClient(context);
                    const { ticket } = await client.getTicket(payload.detail.id);
                    console.log(`Ticket ${ticket.id} status changed to ${ticket.status}`);

                    const conversation = await parseTicketAsConversation(client, ticket);
                    await context.api.orgs.ingestConversation(installation.target.organization, [
                        conversation,
                    ]);
                }
            } else {
                throw new Error(`Unknown webhook received: ${payload.type}`);
            }

            return new Response('OK', { status: 200 });
        }

        /*
         * OAuth flow.
         */
        if (url.pathname.endsWith('/oauth')) {
            const oauthHandler = createOAuthHandler(getZendeskOAuthConfig(context), {
                replace: false,
            });
            return oauthHandler(request, context);
        }

        return new Response('Not found', { status: 404 });
    },
    components: [configComponent],
    events: {
        /**
         * When the integration is installed, we:
         *   - Setup a webhook to be notified when tickets are closed
         *   - Fetch all recent tickets and ingest them
         */
        installation_setup: async (event, context) => {
            const { installation } = context.environment;
            if (
                installation?.configuration.subdomain &&
                installation?.configuration.oauth_credentials
            ) {
                const client = await getZendeskClient(context);

                // Recreate the webhook.
                const name = `GitBook - ${installation.target.organization}`;
                const { webhooks } = await client.listWebhooks({ name });
                await Promise.all(webhooks.map((webhook) => client.deleteWebhook(webhook.id)));
                const { webhook } = await client.createWebhook({
                    name: `GitBook - ${installation.target.organization}`,
                    endpoint: `${installation.urls.publicEndpoint}/webhook`,
                    subscriptions: ['zen:event-type:ticket.status_changed'],
                });
                console.log(`Webhook created: ${webhook.id}`);

                await ingestTickets(
                    client,
                    async (conversations) => {
                        console.log(`Ingesting ${conversations.length} conversations`);
                        await context.api.orgs.ingestConversation(
                            installation.target.organization,
                            conversations,
                        );
                    },
                    {
                        startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
                        maxTickets: 300,
                    },
                );
            }
        },
    },
});
