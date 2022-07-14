/**
 * Execute a Slack API request and return the result.
 */
export async function executeSlackAPIRequest(
    httpMethod: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
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

    let body = '';
    const headers: Record<string, string> = {};

    headers.Authorization = `Bearer ${accessToken}`;

    if (Object.keys(payload).length > 0) {
        body = JSON.stringify(payload);
        headers['Content-Type'] = 'application/json';
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
