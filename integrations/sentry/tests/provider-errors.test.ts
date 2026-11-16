import { afterEach, describe, expect, it, mock } from 'bun:test';

import { ExposableError, IntegrationError } from '@gitbook/runtime';
import { embedBlock } from '../src/blocks';
import type { SentryRuntimeContext } from '../src/types';

const ORIGINAL_FETCH = globalThis.fetch;
const CONTEXT = {
    environment: { installation: { configuration: { auth_token: 'test-token' } } },
} as SentryRuntimeContext;
const request = () =>
    embedBlock.render(
        {
            type: 'ui_render',
            eventId: 'test',
            installationId: 'installation',
            spaceId: 'space',
            componentId: 'embed',
            props: { issueId: '123' },
            context: { type: 'document', spaceId: 'space', editable: false, theme: 'light' },
        },
        CONTEXT,
    );

afterEach(() => {
    globalThis.fetch = ORIGINAL_FETCH;
});

describe('sentry provider failures', () => {
    it.each([
        [401, 'authentication_required'],
        [403, 'configuration_required'],
        [404, 'invalid_input'],
    ] as const)('classifies HTTP %s as %s', async (status, reason) => {
        const fetchMock = mock(async () =>
            Response.json({ error: 'private-provider-body' }, { status }),
        );
        globalThis.fetch = fetchMock as unknown as typeof fetch;

        const error = await request().catch((error) => error);
        expect(error).toBeInstanceOf(IntegrationError);
        expect(error).toMatchObject({ reason, code: reason === 'invalid_input' ? 422 : 424 });
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
