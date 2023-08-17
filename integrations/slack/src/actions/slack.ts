export interface SlackMessage {
    channel: string;
    thread_ts?: string;
    blocks?: any[];
    text?: string;
}

export interface SlackResponse {
    delete_original?: boolean;
    replace_original?: boolean;
    response_type?: 'in_channel';
    blocks?: any[];
    text?: string;
}

export class SlackClient {
    token: string;

    constructor(token: string) {
        this.token = token;
    }

    async postMessage(message: SlackMessage): Promise<void> {
        await this.post('https://slack.com/api/chat.postMessage', message);
    }

    async postEphemeralMessage(message: SlackMessage): Promise<void> {
        await this.post('https://slack.com/api/chat.postEphemeral', message);
    }

    async postResponse(responseURL: string, response: SlackResponse): Promise<void> {
        await this.post(responseURL, response);
    }

    async deleteMessage(responseURL: string): Promise<void> {
        await this.post(responseURL, {
            delete_original: true,
        });
    }

    async openView(triggerId: string, view: any): Promise<void> {
        await this.post('https://slack.com/api/views.open', {
            trigger_id: triggerId,
            view,
        });
    }

    async updateView(viewId: string, view: any): Promise<void> {
        await this.post('https://slack.com/api/views.update', {
            view_id: viewId,
            view,
        });
    }

    private async post(url: string, body: any) {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
            body,
        });

        this.processResponse(response);
    }

    private async processResponse(response: any) {
        if (!response.ok) {
            const metadata = response.response_metadata;
            if (metadata.messages != null && metadata.messages.length > 0) {
                throw new Error(`${response.error}: ${metadata.messages[0]}`);
            } else {
                throw new Error(response.error);
            }
        }
    }
}
