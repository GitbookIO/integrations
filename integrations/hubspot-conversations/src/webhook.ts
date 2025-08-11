import pMap from 'p-map';
import { Logger } from '@gitbook/runtime';
import { HubSpotRuntimeContext, HubSpotConversation } from './types';
import { hubspotApiRequest } from './client';
import { parseConversationAsGitBook } from './conversations';

const logger = Logger('hubspot-conversations');

/**
 * Verify HubSpot webhook signature using v3 format
 * https://developers.hubspot.com/docs/api/webhooks/validating-requests
 */
async function verifyHubSpotSignature(
    signature: string,
    method: string,
    url: string,
    body: string,
    clientSecret: string,
    timestamp: string,
): Promise<boolean> {
    try {
        // Validate timestamp (reject if older than 5 minutes)
        const MAX_ALLOWED_TIMESTAMP = 300000; // 5 minutes in milliseconds
        const currentTime = Date.now();
        const timestampMs = parseInt(timestamp);
        
        if (currentTime - timestampMs > MAX_ALLOWED_TIMESTAMP) {
            return false;
        }
        
        // Create concatenated string: method + uri + body + timestamp
        const rawString = method + url + body + timestamp;
        
        // Create HMAC SHA-256 hash using client secret as key
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(clientSecret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        
        const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(rawString));
        const hashArray = Array.from(new Uint8Array(signatureBuffer));
        const computedBase64 = btoa(String.fromCharCode.apply(null, hashArray));
        
        return computedBase64 === signature;
    } catch (error) {
        logger.error('Failed to verify webhook signature', {
            error: error instanceof Error ? error.message : String(error),
        });
        return false;
    }
}

/**
 * HubSpot webhook payload for conversation events
 * https://developers.hubspot.com/docs/guides/api/app-management/webhooks
 */
export type HubSpotWebhookPayload = {
    subscriptionType: 'conversation.propertyChange';
    eventId: number;
    subscriptionId: number;
    portalId: number;
    appId: number;
    occurredAt: number;
    objectId: number;
    propertyName?: string;
    propertyValue?: string;
    attemptNumber?: number;
    changeSource?: string;
    changeFlag?: string;
};

/**
 * Handle incoming HubSpot webhooks for conversation property changes
 * This is configured on the HubSpot app to trigger on conversation status changes.
 */
export async function handleWebhook(
    context: HubSpotRuntimeContext,
    payloads: HubSpotWebhookPayload[],
    request?: Request,
    rawBody?: string,
): Promise<Response> {
    // Verify webhook signature for security
    if (request && rawBody) {
        const signature = request.headers.get('x-hubspot-signature-v3');
        const timestamp = request.headers.get('x-hubspot-request-timestamp');
        const method = request.method;
        const url = request.url;
        const clientSecret = context.environment.secrets.CLIENT_SECRET;
        
        if (!signature || !timestamp) {
            logger.error('Missing required signature headers');
            return new Response('Unauthorized', { status: 401 });
        }
        
        const isValidSignature = await verifyHubSpotSignature(signature, method, url, rawBody, clientSecret, timestamp);
        if (!isValidSignature) {
            logger.error('Invalid webhook signature received');
            return new Response('Unauthorized', { status: 401 });
        }
    }
    for (const payload of payloads) {
        logger.info('Processing HubSpot webhook', {
            subscriptionType: payload.subscriptionType,
            objectId: payload.objectId,
        });

        if (
            payload.subscriptionType === 'conversation.propertyChange' &&
            payload.propertyName === 'status' &&
            payload.propertyValue === 'CLOSED'
        ) {
            // Find all installations that match this HubSpot account
            const hubspotAccountId = payload.portalId.toString();
            logger.info('Looking for installations', { hubspotAccountId });
            const {
                data: { items: installations },
            } = await context.api.integrations.listIntegrationInstallations(
                context.environment.integration.name,
                {
                    externalId: hubspotAccountId,
                },
            );

            logger.info('Found installations', {
                count: installations.length,
                hubspotAccountId,
            });

            if (installations.length === 0) {
                logger.info('No installations found', { hubspotAccountId });
                continue;
            }

            logger.info('Conversation was closed', { conversationId: payload.objectId });

            // Process the webhook for each matching installation using p-map
            await pMap(
                installations,
                async (installation) => {
                    try {
                        // Create a context for this specific installation
                        const installationContext: HubSpotRuntimeContext = {
                            ...context,
                            environment: {
                                ...context.environment,
                                installation,
                            },
                        };

                        // Fetch the conversation details from HubSpot
                        const conversationResponse = await hubspotApiRequest<HubSpotConversation>(
                            installationContext,
                            `/conversations/v3/conversations/threads/${payload.objectId}`,
                            { method: 'GET' },
                        );

                        const gitbookConversation = await parseConversationAsGitBook(
                            installationContext,
                            conversationResponse,
                        );

                        // Create installation-specific API client for proper authentication
                        const installationApiClient = await context.api.createInstallationClient(
                            context.environment.integration.name,
                            installation.id,
                        );

                        await installationApiClient.orgs.ingestConversation(
                            installation.target.organization,
                            [gitbookConversation],
                        );

                        logger.info('Successfully processed closed conversation', {
                            conversationId: payload.objectId,
                            installationId: installation.id,
                        });
                    } catch (error) {
                        logger.error('Failed to process closed conversation', {
                            conversationId: payload.objectId,
                            installationId: installation.id,
                            error: error instanceof Error ? error.message : String(error),
                        });
                        // Error is logged but doesn't stop processing other installations
                    }
                },
                {
                    concurrency: 2,
                    stopOnError: false,
                },
            );
        } else {
            logger.debug('Ignoring webhook', {
                subscriptionType: payload.subscriptionType,
                propertyName: payload.propertyName,
                propertyValue: payload.propertyValue,
            });
        }
    }

    return new Response('OK', { status: 200 });
}
