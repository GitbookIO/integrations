import { afterEach, describe, expect, it, mock } from 'bun:test';

import { ExposableError, IntegrationError } from '@gitbook/runtime';
import { fetchArcadeOEmbedData } from '../src/arcade';

const ORIGINAL_FETCH = globalThis.fetch;

const request = () => fetchArcadeOEmbedData('flow');

afterEach(() => {
    globalThis.fetch = ORIGINAL_FETCH;
});

describe('arcade provider failures', () => {
    it.each([
        [404, 'invalid_input'],
        [403, 'configuration_required'],
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
