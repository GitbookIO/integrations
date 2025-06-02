export type ZendeskWebhook = {
    id: number;
    name: string;
    endpoint: string;
    status: string;
    created_at: string;
    updated_at: string;
    subscriptions?: ZendeskWebhookSubscription[];
};

type ZendeskWebhookSubscription = string;

export type ZendeskPaginatedResponse<T> = T & {
    count: number;
    next_page: string | null;
    previous_page: string | null;
};

export type ZendeskTicket = {
    id: number;
    subject: string;
    raw_subject: string;
    description: string;
    status: 'new' | 'open' | 'pending' | 'hold' | 'solved' | 'closed';
    priority: string;
    created_at: string;
    updated_at: string;
};

export type ZendeskTicketComment = {
    id: number;
    type: 'Comment';
    body: string;
    html_body: string;
    plain_body: string;
    public: boolean;
    author_id: number;
    created_at: string;
    updated_at: string;
};

export type ZendeskWebhookVia = {
    channel: string;
};

/**
 * https://developer.zendesk.com/api-reference/webhooks/event-types/ticket-events/#status-changed
 */
export type ZendeskWebhookTicketStatusPayload = {
    account_id: number;
    detail: Pick<ZendeskTicket, 'id' | 'status'>;
    event: {
        current:
            | 'NEW'
            | 'OPEN'
            | 'PENDING'
            | 'HOLD'
            | 'SOLVED'
            | 'CLOSED'
            | 'DELETED'
            | 'ARCHIVED'
            | 'SCRUBBED';
        previous:
            | 'NEW'
            | 'OPEN'
            | 'PENDING'
            | 'HOLD'
            | 'SOLVED'
            | 'CLOSED'
            | 'DELETED'
            | 'ARCHIVED'
            | 'SCRUBBED';
    };
    id: string;
    subject: string;
    time: string;
    type: 'zen:event-type:ticket.status_changed';
    zendesk_event_version: string;
};

/**
 * Payload of a webhook event.
 */
export type ZendeskWebhookPayload = ZendeskWebhookTicketStatusPayload;

/**
 * https://developer.zendesk.com/api-reference/ticketing/users/users/#json-format
 */
export type ZendeskUser = {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    active: boolean;
    verified: boolean;
    role: 'end-user' | 'agent' | 'admin';
};

/**
 * Zendesk API client.
 */
export class ZendeskClient {
    private baseURL: string;
    private authHeader: string;

    public subdomain: string;

    constructor(config: { subdomain: string; oauthToken: string }) {
        this.subdomain = config.subdomain;
        this.baseURL = `https://${config.subdomain}.zendesk.com/api/v2`;
        this.authHeader = `Bearer ${config.oauthToken}`;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            Authorization: this.authHeader,
            'Content-Type': 'application/json',
            ...options.headers,
        };

        const response = await fetch(url, {
            ...options,
            headers,
        });

        console.log(`request ${options.method ?? 'GET'} ${url} (${this.authHeader})`);

        if (!response.ok) {
            const text = await response.text();
            console.error(text);
            throw new Error(`Zendesk API error: ${response.status} ${text}`);
        }

        if (response.status === 204) {
            // @ts-ignore - 204 is not a valid JSON response.
            return;
        }

        return response.json();
    }

    /**
     * List webhooks.
     * https://developer.zendesk.com/api-reference/webhooks/webhooks-api/webhooks/#list-webhooks
     */
    async listWebhooks(
        input: {
            name?: string;
        } = {},
    ): Promise<{ webhooks: ZendeskWebhook[] }> {
        const queryParams = new URLSearchParams();
        if (input.name) queryParams.set('filter[name_contains]', input.name);

        const queryString = queryParams.toString();
        const endpoint = `/webhooks${queryString ? `?${queryString}` : ''}`;

        return this.request<{ webhooks: ZendeskWebhook[] }>(endpoint);
    }

    /**
     * Create a webhook.
     * https://developer.zendesk.com/api-reference/webhooks/webhooks-api/webhooks/#create-or-clone-webhook
     */
    async createWebhook(input: {
        name: string;
        endpoint: string;
        subscriptions?: ZendeskWebhookSubscription[];
    }): Promise<{ webhook: ZendeskWebhook }> {
        return this.request<{ webhook: ZendeskWebhook }>('/webhooks', {
            method: 'POST',
            body: JSON.stringify({
                webhook: {
                    name: input.name,
                    endpoint: input.endpoint,
                    status: 'active',
                    http_method: 'POST',
                    request_format: 'json',
                    subscriptions: input.subscriptions,
                },
            }),
        });
    }

    /**
     * Delete a webhook.
     * https://developer.zendesk.com/api-reference/webhooks/webhooks-api/webhooks/#delete-webhook
     */
    async deleteWebhook(id: number): Promise<void> {
        await this.request(`/webhooks/${id}`, {
            method: 'DELETE',
        });
    }

    /**
     * Incrementally list tickets.
     * https://developer.zendesk.com/api-reference/ticketing/ticket-management/incremental_exports/#incremental-ticket-export-time-based
     */
    async listTicketsIncremental(params: { startTime: Date; cursor?: string | null }) {
        const queryParams = new URLSearchParams();
        queryParams.set('start_time', Math.floor(params.startTime.getTime() / 1000).toString());
        if (params.cursor) {
            queryParams.set('cursor', params.cursor);
        }

        const queryString = queryParams.toString();
        const endpoint = `/incremental/tickets/cursor${queryString ? `?${queryString}` : ''}`;

        return this.request<{
            tickets: ZendeskTicket[];
            count: number;
            after_cursor: string | null;
            before_cursor: string | null;
        }>(endpoint);
    }

    /**
     * Get a ticket.
     * https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/#show-ticket
     */
    async getTicket(ticketId: number) {
        const endpoint = `/tickets/${ticketId}`;
        return this.request<{ ticket: ZendeskTicket }>(endpoint);
    }

    /**
     * List the comments in a ticket.
     * https://developer.zendesk.com/api-reference/ticketing/tickets/ticket_comments/#list-comments
     */
    async listTicketComments(ticketId: number) {
        const endpoint = `/tickets/${ticketId}/comments?page[size]=100`;
        return this.request<ZendeskPaginatedResponse<{ comments: ZendeskTicketComment[] }>>(
            endpoint,
        );
    }

    /**
     * Get a user profile.
     * https://developer.zendesk.com/api-reference/ticketing/users/users/#show-user
     */
    async getUser(userId: number) {
        const endpoint = `/users/${userId}`;
        return this.request<{ user: ZendeskUser }>(endpoint);
    }
}
