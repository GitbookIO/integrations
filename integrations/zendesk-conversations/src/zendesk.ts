interface ZendeskConfig {
  subdomain: string;
  oauthToken: string;
}

interface Webhook {
  id: number;
  name: string;
  endpoint: string;
  status: string;
  created_at: string;
  updated_at: string;
  subscriptions?: WebhookSubscription[];
}

type WebhookSubscription = string;

interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

export class ZendeskClient {
  private baseUrl: string;
  private authHeader: string;

  constructor(config: ZendeskConfig) {
    this.baseUrl = `https://${config.subdomain}.zendesk.com/api/v2`;
    this.authHeader = `Bearer ${config.oauthToken}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': this.authHeader,
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

  // Webhook methods
  async listWebhooks(input: {
    name?: string;
  } = {}): Promise<{ webhooks: Webhook[] }> {
    const queryParams = new URLSearchParams();
    if (input.name) queryParams.set('filter[name_contains]', input.name);

    const queryString = queryParams.toString();
    const endpoint = `/webhooks${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{ webhooks: Webhook[] }>(endpoint);
  }

  async createWebhook(
    input: {
        name: string, 
        endpoint: string, 
        subscriptions?: WebhookSubscription[]
    }
  ): Promise<{ webhook: Webhook }> {
    return this.request<{ webhook: Webhook }>('/webhooks', {
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

  async deleteWebhook(id: number): Promise<void> {
    await this.request(`/webhooks/${id}`, {
      method: 'DELETE',
    });
  }

  // Ticket methods
  async listTickets(params: {
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  } = {}): Promise<{ tickets: Ticket[]; count: number; next_page: string | null }> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.per_page) queryParams.set('per_page', params.per_page.toString());
    if (params.sort_by) queryParams.set('sort_by', params.sort_by);
    if (params.sort_order) queryParams.set('sort_order', params.sort_order);

    const queryString = queryParams.toString();
    const endpoint = `/tickets${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{ tickets: Ticket[]; count: number; next_page: string | null }>(endpoint);
  }
}
