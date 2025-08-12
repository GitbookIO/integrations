import { RuntimeEnvironment, RuntimeContext } from '@gitbook/runtime';

export type HubSpotInstallationConfiguration = {
    /**
     * OAuth credentials.
     */
    oauth_credentials?: {
        access_token: string;
        refresh_token: string;
    };
};

export type HubSpotRuntimeEnvironment = RuntimeEnvironment<HubSpotInstallationConfiguration>;
export type HubSpotRuntimeContext = RuntimeContext<HubSpotRuntimeEnvironment>;

/**
 * HubSpot API response types
 */
export interface HubSpotAccountInfo {
    portalId?: number;
}

export interface HubSpotConversation {
    id: string;
    status: string;
    createdAt: string;
    latestMessageTimestamp?: string;
}

export interface HubSpotMessage {
    id: string;
    text?: string;
    richText?: string;
    senderActorType: 'VISITOR' | 'AGENT' | 'BOT';
    createdAt: string;
}

export interface HubSpotPagination {
    next?: {
        after: string;
    };
}

export interface HubSpotConversationsResponse {
    results: HubSpotConversation[];
    paging?: HubSpotPagination;
}

export interface HubSpotMessagesResponse {
    results: HubSpotMessage[];
    paging?: HubSpotPagination;
}
