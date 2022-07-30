/**
 * Execute a Mailchimp API request and return the result.
 */
export async function executeMailchimpAPIRequest(
    httpMethod: string,
    apiMethod: string,
    payload: { [key: string]: any } = {}
) {
    if (!environment.installation.configuration.oauth_credentials) {
        throw new Error('Connection not ready');
    }

    const { dc, access_token } = environment.installation.configuration.oauth_credentials;

    const url = new URL(`https://${dc}.api.mailchimp.com/3.0/${apiMethod}`);

    let body;
    const headers: {
        [key: string]: string;
    } = {
        Authorization: `Bearer ${access_token}`,
    };

    if (httpMethod === 'GET') {
        Object.entries(payload).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
    } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(payload);
    }

    const response = await fetch(url.toString(), {
        method: httpMethod,
        body,
        headers,
    });

    console.log(response.status);

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result;
}
