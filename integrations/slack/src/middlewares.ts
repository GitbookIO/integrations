import { sha256 } from 'js-sha256';

import { SlackRuntimeContext } from './configuration';
import { slackAPI } from './slack';

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

/**
 * We acknowledge the slack request immediately to avoid failures
 * and "queue" the actual task to be executed in a subsequent request.
 */
export async function acknowledgeSlackRequest(req: Request) {
    fetch(`${req.url}_task`, {
        method: 'POST',
        body: await req.text(),
        headers: {
            'content-type': req.headers.get('content-type'),
            'x-slack-signature': req.headers.get('x-slack-signature'),
            'x-slack-request-timestamp': req.headers.get('x-slack-request-timestamp'),
        },
    });

    return new Response(JSON.stringify({ acknowledged: true }), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

/**
 * We acknowledge the slack request immediately to avoid failures
 * and "queue" the actual task to be executed in a subsequent request.
 */
export async function acknowledgeSlackShortcut(req: Request, context: SlackRuntimeContext) {
    const requestText = await req.clone().text();
    const shortcutEvent = Object.fromEntries(new URLSearchParams(requestText).entries());
    const shortcutPayload = JSON.parse(shortcutEvent.payload);
    // Clone the request so its body is still available to the fallback
    // const event = await request.clone().json<{ event?: { type: string }; type?: string }>();

    const { channel, message, team, user, response_url } = shortcutPayload;

    console.log('shortcutPayload', shortcutPayload);

    const res = await slackAPI(context, {
        method: 'POST',
        path: 'chat.postEphemeral',
        payload: {
            channel: channel.id,
            text: 'Docs being generated',
            thread_ts: message.thread_ts,
            user: user.id,
        },
    });

    fetch(`${req.url}_task`, {
        method: 'POST',
        body: await req.text(),
        headers: {
            'content-type': req.headers.get('content-type'),
            'x-slack-signature': req.headers.get('x-slack-signature'),
            'x-slack-request-timestamp': req.headers.get('x-slack-request-timestamp'),
        },
    });

    // const res = await fetch(response_url, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         text: `Docs being generated...`,
    //         replace_original: false,
    //         thread_ts: message.thread_ts,
    //         // response_type: 'in_channel',
    //     }),
    // });

    console.log('acknowledgeSlackShortcut==========', await res);

    return new Response(JSON.stringify({ acknowledged: true }), {
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
