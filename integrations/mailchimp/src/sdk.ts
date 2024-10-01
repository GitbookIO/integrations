/**
 * Returns all available mailing lists
 */
export async function getMailingLists(
    apiEndpoint: string,
    accessToken: string,
): Promise<MailchimpListItem[]> {
    const resp = await fetch(`${apiEndpoint}/3.0/lists`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const { lists = [] } = (await resp.json()) as MailchimpListsResponse;
    return lists;
}

/**
 * Returns user metadata.
 */
export async function getUserMetadata(accessToken: string): Promise<MailchimpMetadataResponse> {
    const resp = await fetch('https://login.mailchimp.com/oauth2/metadata', {
        headers: {
            Authorization: `OAuth ${accessToken}`,
        },
    });

    const json = (await resp.json()) as MailchimpMetadataResponse;
    return json;
}

/**
 * Subscribes the given email to a list.
 */
export async function subscribeUserToList(
    listId: string,
    email: string,
    options: { apiEndpoint: string; accessToken: string },
): Promise<void> {
    const { apiEndpoint, accessToken } = options;

    const resp = await fetch(`${apiEndpoint}/3.0/lists/${listId}/members`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            email_address: email,
            status: 'subscribed',
        }),
    });

    if (!resp.ok) {
        throw new Error(`Mailchimp API error: ${resp.status} ${resp.statusText}`);
    }
}

interface MailchimpListsResponse {
    lists: MailchimpListItem[];
    total_items: number;
}

interface MailchimpListItem {
    id: string;
    web_id: number;
    name: string;
    date_created: string;
}

interface MailchimpMetadataResponse {
    dc: string;
    role: string;
    accountname: string;
    user_id: number;
    login: {
        email: string;
        avatar: string | null;
        login_id: number;
        login_name: string;
        login_email: string;
    };
    login_url: string;
    api_endpoint: string;
}
