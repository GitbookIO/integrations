import { sha256 } from 'js-sha256';

import { SlackRuntimeContext } from './configuration';
import { slackAPI } from './slack';
import {
    getInstallationConfig,
    isSaveThreadEvent,
    parseActionPayload,
    parseEventPayload,
    parseCommandPayload,
    stripBotName,
    getActionNameAndType,
} from './utils';

/**
 * Verify the authenticity of a Slack request.
 * Reference - https://api.slack.com/authentication/verifying-requests-from-slack
 */
export async function verifySlackRequest(request: Request, { environment }: SlackRuntimeContext) {
    // Clone the request as to not use up the only read the body allows for future requests
    const req = request.clone();

    // @ts-ignore
    const slackSignature = req.headers.get('x-slack-signature');
    // @ts-ignore
    const slackTimestamp = req.headers.get('x-slack-request-timestamp');

    // Check for replay attacks
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - Number(slackTimestamp)) > 60 * 5) {
        throw new Error('Stale request');
    }

    const body = (await req.text()) as string;
    const baseSignature = `v0:${slackTimestamp}:${body}`;

    const computedSignature = `v0=${sha256.hmac
        .create(environment.secrets.SIGNING_SECRET)
        .update(baseSignature)
        .hex()}`;

    if (!secureCompare(slackSignature, computedSignature)) {
        throw new Error('Invalid signature');
    }
}

const acknowledgeQuery = async ({ context, text, userId, channelId, threadId, accessToken }) => {
    console.log('acknowledgeQuer userId', userId);
    return slackAPI(
        context,
        {
            method: 'POST',
            path: userId ? 'chat.postEphemeral' : 'chat.postMessage', // probably alwasy ephemeral? or otherwise have replies in same thread
            payload: {
                channel: channelId,
                text: `_Asking: ${text}_`,
                // thread_ts: message.thread_ts,
                ...(userId ? { user: userId } : {}), // actually shouldn't be optional
                ...(threadId ? { thread_ts: threadId } : {}),
            },
        },
        {
            accessToken,
        }
    );
};

/**
 * We acknowledge the slack request immediately to avoid failures
 * and "queue" the actual task to be executed in a subsequent request.
 */
export async function acknowledgeSlackEvent(req: Request, context: SlackRuntimeContext) {
    const eventPayload = await parseEventPayload(req);
    const { type, team_id, text, bot_id, ts, thread_ts, parent_user_id, channel, user, event_ts } =
        eventPayload.event;

    const { accessToken } = await getInstallationConfig(context, team_id);

    if (!['block_actions'].includes(type)) {
        const saveThreadEvent = isSaveThreadEvent(type, text);

        if (saveThreadEvent) {
            await slackAPI(
                context,
                {
                    method: 'POST',
                    path: 'chat.postEphemeral',
                    payload: {
                        channel,
                        text: `Saving thread in GitBook. Hang tight, this will take a sec.`,
                        thread_ts,
                        user,
                    },
                },
                { accessToken }
            );
        } else if (['message', 'app_mention'].includes(type) && !bot_id) {
            // check for bot_id so that the bot doesn't trigger itself
            // stript out the bot-name in the mention and account for user mentions within the query
            const parsedQuery = stripBotName(text, eventPayload.authorizations[0]?.user_id);

            await acknowledgeQuery({
                context,
                text: parsedQuery,
                userId: user,
                threadId: thread_ts,
                channelId: channel,
                accessToken,
            });
        }
    }

    const data = fetch(`${req.url}_task`, {
        method: 'POST',
        body: await req.text(),
        headers: {
            'content-type': req.headers.get('content-type'),
            'x-slack-signature': req.headers.get('x-slack-signature'),
            'x-slack-request-timestamp': req.headers.get('x-slack-request-timestamp'),
        },
    });

    // return new Response(JSON.stringify({ acknowledged: true }), {
    return new Response(null, {
        status: 200,
    });
}

export async function acknowledgeSlackCommand(req: Request, context: SlackRuntimeContext) {
    const eventPayload = await parseCommandPayload(req);
    const { team_id, user_id, channel_id, text } = eventPayload;

    const { accessToken } = await getInstallationConfig(context, team_id);
    const textBody = await req.text();

    const data = fetch(`${req.url}_task`, {
        method: 'POST',
        body: textBody,
        headers: {
            'content-type': req.headers.get('content-type'),
            'x-slack-signature': req.headers.get('x-slack-signature'),
            'x-slack-request-timestamp': req.headers.get('x-slack-request-timestamp'),
        },
    });

    await acknowledgeQuery({ context, text, userId: user_id, channelId: channel_id, accessToken });

    return new Response(null, {
        status: 200,
    });
}

/**
 * We acknowledge the slack request immediately to avoid failures
 * and "queue" the actual task to be executed in a subsequent request.
 */
export async function acknowledgeSlackAction(req: Request, context: SlackRuntimeContext) {
    const actionPayload = await parseActionPayload(req);

    const { type, channel, message, team, user, actions, container } = actionPayload;

    console.log('actions payload====', actionPayload);

    const { accessToken } = await getInstallationConfig(context, team.id);

    if (!['block_actions'].includes(type)) {
        const saveThreadEvent = isSaveThreadEvent(type, message.text);
        if (saveThreadEvent) {
            await slackAPI(
                context,
                {
                    method: 'POST',
                    path: 'chat.postEphemeral',
                    payload: {
                        channel: channel.id,
                        text: `Saving thread in GitBook. Hang tight, this will take a sec.`,
                        thread_ts: message.thread_ts,
                        user: user.id,
                    },
                },
                { accessToken }
            );
        }
    } else if (actions.length > 0) {
        await Promise.all(
            actions.map(async (action) => {
                const { action_id, value } = actions[0];

                const { actionName } = getActionNameAndType(action_id);

                // TODO: check if we are actually trying to query via the action_id. setting this up for demo
                if (actionName === 'queryLens') {
                    return acknowledgeQuery({
                        context,
                        text: value,
                        userId: user.id,
                        channelId: channel.id,
                        threadId: container?.thread_ts,
                        accessToken,
                    });
                } else {
                    await slackAPI(
                        context,
                        {
                            method: 'POST',
                            path: 'chat.postEphemeral',
                            payload: {
                                channel: channel.id,
                                text: `Sharing...`,
                                user: user.id,
                                thread_ts: message?.thread_ts,
                            },
                        },
                        { accessToken }
                    );
                }
            })
        );
    }

    const data = fetch(`${req.url}_task`, {
        method: 'POST',
        body: await req.text(),
        headers: {
            'content-type': req.headers.get('content-type'),
            'x-slack-signature': req.headers.get('x-slack-signature'),
            'x-slack-request-timestamp': req.headers.get('x-slack-request-timestamp'),
        },
    });

    return new Response(null, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

/**
 * Secure compare two strings to prevent timing attacks.
 * Implementation taken from: https://github.com/vadimdemedes/secure-compare
 * TODO: Once the `crypto` is implemented in the runtime, we can use `crypto.timingSafeEqual`
 */
function secureCompare(a: string, b: string): boolean {
    if (typeof a !== 'string' || typeof b !== 'string') {
        return false;
    }

    let mismatch = a.length === b.length ? 0 : 1;
    if (mismatch) {
        b = a;
    }

    for (let i = 0; i < a.length; ++i) {
        mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return mismatch === 0;
}
