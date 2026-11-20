import { afterEach, describe, expect, it, mock } from 'bun:test';

import { ExposableError, IntegrationError } from '@gitbook/runtime';
import { getJIRAIssue, getJIRASites } from '../src/sdk';

const ORIGINAL_FETCH = globalThis.fetch;

const request = () => getJIRAIssue('TEST-1', { site: 'site', accessToken: 'test-token' });

afterEach(() => {
    globalThis.fetch = ORIGINAL_FETCH;
});

describe('jira provider failures', () => {
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

it('also classifies rejected tokens during site discovery', async () => {
    globalThis.fetch = mock(
        async () => new Response(null, { status: 401 }),
    ) as unknown as typeof fetch;
    await expect(getJIRASites('test-token')).rejects.toMatchObject({
        reason: 'authentication_required',
    });
});
