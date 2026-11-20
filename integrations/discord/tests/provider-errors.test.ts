import { afterEach, expect, it, mock } from 'bun:test';
import { ExposableError, type EventByType } from '@gitbook/runtime';
import { sendDiscordMessage } from '../src/discord';
import type { DiscordRuntimeContext } from '../src/types';

const ORIGINAL_FETCH = globalThis.fetch;
const CONTEXT = {
    api: {
        spaces: {
            getSpaceById: async () => ({
                data: { title: 'Test', urls: { app: 'https://gitbook.test' } },
            }),
        },
    },
    environment: {
        secrets: { BOT_TOKEN: 'test-bot-token' },
        installation: {
            configuration: {
                oauth_credentials: {
                    access_token: 'test-token',
                    webhook: { channel_id: 'channel' },
                },
            },
        },
    },
} as unknown as DiscordRuntimeContext;
const EVENT = {
    type: 'space_content_updated',
    spaceId: 'space',
} as EventByType<'space_content_updated'>;

afterEach(() => {
    globalThis.fetch = ORIGINAL_FETCH;
});

it.each([401, 403, 404])(
    'reports Discord HTTP %s as a configuration failure without replaying',
    async (status) => {
        const fetchMock = mock(async () => new Response(null, { status }));
        globalThis.fetch = fetchMock as unknown as typeof fetch;
        await expect(sendDiscordMessage(EVENT, CONTEXT)).rejects.toMatchObject({
            reason: 'configuration_required',
            code: 424,
        });
        expect(fetchMock).toHaveBeenCalledTimes(1);
    },
);

it.each([429, 503])('keeps Discord HTTP %s unexpected', async (status) => {
    globalThis.fetch = mock(async () => new Response(null, { status })) as unknown as typeof fetch;
    const error = await sendDiscordMessage(EVENT, CONTEXT).catch((error) => error);
    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBeInstanceOf(ExposableError);
});
