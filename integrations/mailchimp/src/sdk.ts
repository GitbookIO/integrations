/**
 * Returns all available mailing lists (audiences), fetching all pages.
 */
export async function getMailingLists(
    apiEndpoint: string,
    accessToken: string,
): Promise<MailchimpListItem[]> {
    const allLists: MailchimpListItem[] = [];
    const count = 100;
    let offset = 0;

    while (true) {
        const resp = await fetch(`${apiEndpoint}/3.0/lists?count=${count}&offset=${offset}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!resp.ok) {
            const body = await resp.text();
            throw new Error(`Mailchimp API error: ${resp.status} ${resp.statusText} - ${body}`);
        }

        const { lists = [], total_items = 0 } = (await resp.json()) as MailchimpListsResponse;
        allLists.push(...lists);

        if (allLists.length >= total_items || lists.length === 0) {
            break;
        }

        offset += count;
    }

    return allLists;
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
        const body = await resp.text();
        throw new Error(`Mailchimp API error: ${resp.status} ${resp.statusText} - ${body}`);
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
