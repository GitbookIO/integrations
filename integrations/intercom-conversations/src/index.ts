import { createIntegration, createOAuthHandler, ExposableError } from '@gitbook/runtime';
import { IntercomRuntimeContext } from './types';
import { getIntercomClient, getIntercomOAuthConfig } from './client';
import { ingestConversations, parseConversationAsGitBook } from './conversations';
import { configComponent } from './config';
import { Intercom } from 'intercom-client';

/**
 * https://developers.intercom.com/docs/references/webhooks/webhook-models#webhook-notification-object
 */
type IntercomWebhookPayload = {
    type: 'notification_event';
    topic: 'conversation.closed';
    data: {
        item: Intercom.Conversation;
    };
};

export default createIntegration<IntercomRuntimeContext>({
    fetch: async (request, context) => {
        const url = new URL(request.url);

        /*
         * Webhook to ingest conversations when they are closed.
         */
        if (url.pathname.endsWith('/webhook')) {
            const payload = await request.json<IntercomWebhookPayload>();

            if (payload.topic === 'conversation.closed') {
                const { installation } = context.environment;
                if (!installation) {
                    throw new Error('Installation not found');
                }

                const client = await getIntercomClient(context);
                const conversation = payload.data.item;
                console.log(`Conversation ${conversation.id} was closed`);

                const gitbookConversation = await parseConversationAsGitBook(
                    context,
                    client,
                    conversation,
                );
                await context.api.orgs.ingestConversation(installation.target.organization, [
                    gitbookConversation,
                ]);
            } else {
                throw new ExposableError(`Unknown webhook received: ${payload.topic}`);
            }

            return new Response('OK', { status: 200 });
        }

        /*
         * OAuth flow.
         */
        if (url.pathname.endsWith('/oauth')) {
            const oauthHandler = createOAuthHandler(getIntercomOAuthConfig(context), {
                replace: false,
            });
            return oauthHandler(request, context);
        }

        return new Response('Not found', { status: 404 });
    },
    components: [configComponent],
    events: {
        /**
         * When the integration is installed, we fetch all recent conversations and ingest them
         */
        installation_setup: async (event, context) => {
            const { installation } = context.environment;
            if (installation?.configuration.oauth_credentials) {
                await ingestConversations(context);
            }
        },
    },
});
