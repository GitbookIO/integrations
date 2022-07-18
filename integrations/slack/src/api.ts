/**
 * Execute a Slack API request and return the result.
 */
export async function executeSlackAPIRequest(
    httpMethod: string,
    apiMethod: string,
    payload: { [key: string]: any } = {},
    options: {
        accessToken?: string;
    } = {}
) {
    const accessToken =
        options.accessToken ||
        environment.installation.configuration.oauth_credentials?.access_token;
    if (!accessToken) {
        throw new Error('Connection not ready');
    }

    const url = new URL(`https://slack.com/api/${apiMethod}`);

    let body;
    const headers: {
        [key: string]: string;
    } = {
        Authorization: `Bearer ${accessToken}`,
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

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.ok) {
        throw new Error(`${httpMethod} ${url.toString()}: ${result.error}`);
    }

    return result;
}
