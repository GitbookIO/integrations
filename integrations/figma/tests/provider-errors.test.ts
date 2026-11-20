import { afterEach, describe, expect, it, mock } from 'bun:test';

import { IntegrationError } from '@gitbook/runtime';
import { fetchFigmaFile } from '../src/figma';
import type { FigmaRuntimeContext } from '../src/types';

const ORIGINAL_FETCH = globalThis.fetch;
const CONTEXT = {
    environment: {
        installation: { configuration: { oauth_credentials: { access_token: 'test-token' } } },
    },
} as FigmaRuntimeContext;
const request = () => fetchFigmaFile('file', CONTEXT);

afterEach(() => {
    globalThis.fetch = ORIGINAL_FETCH;
});

describe('figma provider failures', () => {
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
