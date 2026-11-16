import { afterEach, describe, expect, it, mock } from 'bun:test';

import { ExposableError, IntegrationError } from '@gitbook/runtime';
import { slackAPI } from '../src/slack';
import type { SlackRuntimeContext } from '../src/configuration';

const ORIGINAL_FETCH = globalThis.fetch;
const CONTEXT = {
    environment: {
        installation: { configuration: { oauth_credentials: { access_token: 'test-token' } } },
    },
} as SlackRuntimeContext;
const request = () =>
    slackAPI(CONTEXT, {
        method: 'POST',
        path: 'chat.postMessage',
        payload: { channel: 'channel', text: 'test' },
    });

afterEach(() => {
    globalThis.fetch = ORIGINAL_FETCH;
});

describe('slack provider failures', () => {
    it.each([
        [401, 'authentication_required'],
        [403, 'configuration_required'],
    ] as const)('classifies HTTP %s as %s', async (status, reason) => {
        const fetchMock = mock(async () =>
            Response.json({ error: 'private-provider-body' }, { status }),
        );
        globalThis.fetch = fetchMock as unknown as typeof fetch;

        const error = await request().catch((error) => error);
        expect(error).toBeInstanceOf(IntegrationError);
        expect(error).toMatchObject({ reason, code: 424 });
        expect(error.message).not.toContain('private-provider-body');
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
});

it.each([429, 503])('keeps HTTP %s unexpected', async (status) => {
    globalThis.fetch = mock(async () =>
        Response.json({ error: 'invalid_auth' }, { status }),
    ) as unknown as typeof fetch;
    const error = await request().catch((error) => error);
    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBeInstanceOf(ExposableError);
});

it.each([
    ['invalid_auth', 'authentication_required'],
    ['token_revoked', 'authentication_required'],
    ['token_expired', 'authentication_required'],
    ['missing_scope', 'configuration_required'],
    ['no_permission', 'configuration_required'],
] as const)('classifies Slack code %s without retrying the action', async (code, reason) => {
    const fetchMock = mock(async () => Response.json({ ok: false, error: code }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    await expect(request()).rejects.toMatchObject({ reason, code: 424 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
});

it.each(['internal_error', 'ratelimited', 'unknown'])(
    'keeps Slack code %s unexpected',
    async (code) => {
        globalThis.fetch = mock(async () =>
            Response.json({ ok: false, error: code }),
        ) as unknown as typeof fetch;
        const error = await request().catch((error) => error);
        expect(error).toBeInstanceOf(Error);
        expect(error).not.toBeInstanceOf(ExposableError);
    },
);

it('does not classify malformed success JSON as a credential rejection', async () => {
    globalThis.fetch = mock(async () =>
        Response.json({ error: 'invalid_auth' }),
    ) as unknown as typeof fetch;
    const error = await request().catch((error) => error);
    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBeInstanceOf(ExposableError);
});
