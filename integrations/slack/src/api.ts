/**
 * Execute a Slack API request and return the result.
 */
export async function executeSlackAPIRequest(
    httpMethod: string,
    apiMethod: string,
    payload: { [key: string]: any } = {}
) {
    const accessToken = environment.installation.configuration.oauth_credentials?.access_token;
    if (!accessToken) {
        throw new Error('Connection not ready');
    }

    const url = new URL(`https://slack.com/api/${apiMethod}`);

    let body;

    if (httpMethod === 'GET') {
        url.searchParams.set('token', accessToken);
    } else {
        const params = new URLSearchParams();
        params.set('token', accessToken);

        Object.entries(payload).forEach(([key, value]) => {
            params.set(key, value);
        });

        body = params.toString();
    }

    const response = await fetch(url.toString(), {
        method: httpMethod,
        body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
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
