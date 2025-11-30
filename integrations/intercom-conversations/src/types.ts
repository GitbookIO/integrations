import type { IntegrationInstallation, Organization } from '@gitbook/api';
import type { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';
import type { Intercom } from 'intercom-client';

export type IntercomInstallationConfiguration = {
    /**
     * OAuth credentials.
     */
    oauth_credentials?: {
        access_token: string;
    };
};

export type IntercomRuntimeEnvironment = RuntimeEnvironment<IntercomInstallationConfiguration>;
export type IntercomRuntimeContext = RuntimeContext<
    IntercomRuntimeEnvironment,
    IntercomIntegrationTask
>;

/**
 * Intercom API response types
 */
export interface IntercomApp {
    type: 'app';
    id_code: string;
    name: string;
    created_at: number;
    secure: boolean;
    identity_verification: boolean;
    timezone: string;
    region: string;
}

export interface IntercomMeResponse {
    type: 'admin';
    id: string;
    email: string;
    name: string;
    email_verified: boolean;
    app: IntercomApp;
    avatar?: {
        type: 'avatar';
        image_url: string;
    };
    has_inbox_seat: boolean;
}

/**
 * Intercom Webhooks types
 */
export type IntercomWebhookPayload =
    | IntercomWebhookConversationClosedPayload
    | IntercomWebhookPingPayload;

/**
 * https://developers.intercom.com/docs/references/webhooks/webhook-models#webhook-notification-object
 */
interface IntercomWebhookBasePayload {
    type: 'notification_event';
    // This is the workspace ID
    app_id: string;
    topic: string;
}

export interface IntercomWebhookConversationClosedPayload extends IntercomWebhookBasePayload {
    topic: 'conversation.admin.closed';
    data: {
        item: Intercom.Conversation;
    };
}

interface IntercomWebhookPingPayload extends IntercomWebhookBasePayload {
    topic: 'ping';
    data: {
        item: {
            type: 'ping';
            message: string;
        };
    };
}

/**
 * Integration ingestion tasks
 */
type IntercomIntegrationTaskType = 'ingest:closed-conversations';

type IntercomIntegrationBaseTask<
    Type extends IntercomIntegrationTaskType,
    Payload extends object,
> = {
    type: Type;
    payload: Payload;
};

export type IntercomIntegrationIngestClosedConversationsTask = IntercomIntegrationBaseTask<
    'ingest:closed-conversations',
    {
        organization: Organization['id'];
        installation: IntegrationInstallation['id'];
        conversations: Array<Intercom.Conversation['id']>;
    }
>;

export type IntercomIntegrationTask = IntercomIntegrationIngestClosedConversationsTask;
