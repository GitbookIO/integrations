/**
 * Execute a Slack API request and return the result.
 */
export async function executeSlackAPIRequest(
    httpMethod: string,
    apiMethod: string,
    payload: { [key: string]: any } = {},
    options: {
        accessToken?: string;
    } = {},
    retriesLeft = 1
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
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
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
        if (retriesLeft > 0) {
            switch (result.error) {
                case 'not_in_channel':
                    /**
                     * Join the channel/conversation first and then
                     * try to send the message again.
                     */
                    await executeSlackAPIRequest(
                        'POST',
                        'conversations.join',
                        { channel: payload.channel },
                        { accessToken },
                        0 // no retries
                    );
                    return executeSlackAPIRequest(
                        httpMethod,
                        apiMethod,
                        payload,
                        options,
                        retriesLeft - 1
                    );
            }
        }

        throw new Error(`${httpMethod} ${url.toString()}: ${result.error}`);
    }

    return result;
}
