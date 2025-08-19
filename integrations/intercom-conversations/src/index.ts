import { createIntegration, createOAuthHandler, ExposableError, Logger } from '@gitbook/runtime';
import { Intercom } from 'intercom-client';
import { getIntercomClient, getIntercomOAuthConfig } from './client';
import { configComponent } from './config';
import { ingestConversations, parseConversationAsGitBook } from './conversations';
import { IntercomRuntimeContext } from './types';

const logger = Logger('intercom-conversations');

/**
 * https://developers.intercom.com/docs/references/webhooks/webhook-models#webhook-notification-object
 */
type IntercomWebhookPayload = {
    type: 'notification_event';
    // This is the workspace ID
    app_id: string;
    topic: 'conversation.admin.closed';
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

            if (payload.topic === 'conversation.admin.closed') {
                const appId = payload.app_id;

                // Find all installations matching this Intercom workspace (externalId = app_id)
                const {
                    data: { items: installations },
                } = await context.api.integrations.listIntegrationInstallations(
                    context.environment.integration.name,
                    {
                        externalId: appId,
                    },
                );

                if (installations.length === 0) {
                    throw new Error(`No installations found for Intercom workspace: ${appId}`);
                }

                const conversation = payload.data.item;
                logger.info(
                    `Webhook received with topic '${payload.topic}' for conversation id ${conversation.id}. Processing for installations ${installations.join(' ')} `,
                );

                for (const installation of installations) {
                    try {
                        const installationContext: IntercomRuntimeContext = {
                            ...context,
                            environment: {
                                ...context.environment,
                                installation,
                            },
                        };

                        const intercomClient = await getIntercomClient(installationContext);

                        const gitbookConversation = await parseConversationAsGitBook(
                            intercomClient,
                            conversation,
                        );

                        const installationApiClient = await context.api.createInstallationClient(
                            context.environment.integration.name,
                            installation.id,
                        );

                        await installationApiClient.orgs.ingestConversation(
                            installation.target.organization,
                            [gitbookConversation],
                        );
                    } catch (error) {
                        logger.error('Failed processing Intercom webhook for installation', {
                            installationId: installation.id,
                            error: error instanceof Error ? error.message : String(error),
                        });
                    }
                }
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
        installation_setup: async (_, context) => {
            const { installation } = context.environment;
            if (installation?.configuration.oauth_credentials) {
                await ingestConversations(context);
            }
        },
    },
});
