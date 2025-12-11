import type { IRequest } from 'itty-router';

import type { IntercomRuntimeContext, IntercomWebhookPayload } from './types';
import { getIntercomClient } from './client';
import { parseIntercomConversationAsGitBook } from './conversations';
import { ExposableError, Logger } from '@gitbook/runtime';

const logger = Logger('intercom-conversations:webhooks');

/**
 * Handle webhook request from Intercom
 */
export async function handleIntercomWebhookRequest(
    request: IRequest,
    context: IntercomRuntimeContext,
) {
    const payload = await request.json<IntercomWebhookPayload>();
    const topic = payload.topic;

    if (topic === 'ping') {
        return new Response('OK', { status: 200 });
    }

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
        throw new ExposableError(`No installations found for Intercom workspace: ${appId}`);
    }

    if (topic === 'conversation.admin.closed') {
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

                const intercomConversation = await intercomClient.conversations.find(
                    { conversation_id: conversation.id },
                    {
                        headers: { Accept: 'application/json' },
                        timeoutInSeconds: 3,
                    },
                );

                const gitbookConversation =
                    parseIntercomConversationAsGitBook(intercomConversation);

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

        return new Response('OK', { status: 200 });
    }

    throw new ExposableError(`Unknown webhook received: ${topic}`);
}
