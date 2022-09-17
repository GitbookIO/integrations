import { SlackRuntimeContext } from './configuration';

/**
 * Execute a Slack API request and return the result.
 */
export async function slackAPI(
    context: SlackRuntimeContext,
    request: {
        method: string;
        path: string;
        payload?: { [key: string]: any };
    },
    options: {
        accessToken?: string;
    } = {},
    retriesLeft = 1
) {
    const { environment } = context;
    const accessToken =
        options.accessToken ||
        environment.installation.configuration.oauth_credentials?.access_token;
    if (!accessToken) {
        throw new Error('Connection not ready');
    }

    const url = new URL(`https://slack.com/api/${request.path}`);

    let body;
    const headers: {
        [key: string]: string;
    } = {
        Authorization: `Bearer ${accessToken}`,
    };

    if (request.method === 'GET') {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        Object.entries(request.payload || {}).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
    } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(request.payload || {});
    }

    const response = await fetch(url.toString(), {
        method: request.method,
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
                    await slackAPI(
                        'POST',
                        'conversations.join',
                        { channel: payload.channel },
                        { accessToken },
                        0 // no retries
                    );
                    return slackAPI(context, request, options, retriesLeft - 1);
            }
        }

        throw new Error(`${request.method} ${url.toString()}: ${result.error}`);
    }

    return result;
}
