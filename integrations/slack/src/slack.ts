import { Logger } from '@gitbook/runtime';

import { SlackRuntimeContext } from './configuration';

const logger = Logger('slack:api');

/**
 * Cloudflare workers have a maximum number of subrequests we can call (20 according to my
 * tests) https://developers.cloudflare.com/workers/platform/limits/#how-many-subrequests-can-i-make
 * TODO: Test with 50
 */
const maximumSubrequests = 20;

/**
 * Executes a Slack API request to fetch channels, handles pagination, then returns the merged
 * results.
 */
export async function getChannelsPaginated(context: SlackRuntimeContext) {
    const channels = [];

    let response = await slackAPI(context, {
        method: 'GET',
        path: 'conversations.list',
        payload: {
            limit: 1000,
            exclude_archived: true,
            types: 'public_channel,private_channel',
        },
    });
    channels.push(...response?.channels);

    let numberOfCalls = 0;
    // Handle pagination. Slack can be weird when it comes to paginating requests and not return
    // all the channels even if we tell it to fetch a thousand of them. Pagination may be called
    // even with workspaces with less than 1000 channels. We also keep a reference to number of
    // subsequent calls to avoid hitting the hard limit of calls on workers.
    while (response.response_metadata.next_cursor && numberOfCalls < maximumSubrequests) {
        logger.debug('Request was paginated, calling the next cursor');
        response = await slackAPI(context, {
            method: 'GET',
            path: 'conversations.list',
            payload: {
                limit: 1000,
                exclude_archived: true,
                types: 'public_channel,private_channel',
                cursor: response.response_metadata.next_cursor,
            },
        });
        channels.push(...response?.channels);
        numberOfCalls++;
    }

    // Remove any duplicate as the pagination API could return duplicated channels
    return channels.filter(
        (value, index, self) =>
            index === self.findIndex((t) => t.place === value.place && t.id === value.id)
    );
}

/**
 * Execute a Slack API request and return the result.
 */
export async function slackAPI(
    context: SlackRuntimeContext,
    request: {
        method: string;
        path: string;
        responseUrl?: string;
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
        environment.installation?.configuration.oauth_credentials?.access_token;

    if (!accessToken) {
        throw new Error('No authentication token provided');
    }

    const url = request.responseUrl
        ? new URL(request.responseUrl)
        : new URL(`https://slack.com/api/${request.path}`);

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

    logger.debug(`fetch ${request.method} ${url.toString()}: ${body}`);

    const response = await fetch(url.toString(), {
        method: request.method,
        body,
        headers,
    });

    if (!response.ok) {
        logger.error(`slack returned an error ${response.status}: ${response.statusText}`);
        throw new Error(`${response.status} ${response.statusText}`);
    }

    const result = await response.json<SlackResponse>();

    if (!result.ok) {
        if (retriesLeft > 0) {
            switch (result.error) {
                case 'not_in_channel':
                    logger.debug(`Retrying ${request.path} after not_in_channel`);

                    /**
                     * Join the channel/conversation first and then
                     * try to send the message again.
                     */
                    await slackAPI(
                        context,
                        {
                            method: 'POST',
                            path: 'conversations.join',
                            payload: {
                                channel: request.payload.channel,
                            },
                        },
                        options,
                        0
                    );

                    return slackAPI(context, request, options, retriesLeft - 1);
            }
        }

        throw new Error(`${request.method} ${url.toString()}: ${result.error}`);
    }

    return result;
}

interface SlackResponse {
    ok: boolean;
    error?: string;
}
