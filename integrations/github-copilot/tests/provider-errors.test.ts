import { afterEach, describe, expect, it, mock } from 'bun:test';

import { IntegrationError } from '@gitbook/runtime';
import { fetchGitHubInstallations } from '../src/github';

const ORIGINAL_FETCH = globalThis.fetch;

const request = () => fetchGitHubInstallations('test-token');

afterEach(() => {
    globalThis.fetch = ORIGINAL_FETCH;
});

describe('github-copilot provider failures', () => {
    it.each([[401, 'authentication_required']] as const)(
        'classifies HTTP %s as %s',
        async (status, reason) => {
            const fetchMock = mock(async () =>
                Response.json({ error: 'private-provider-body' }, { status }),
            );
            globalThis.fetch = fetchMock as unknown as typeof fetch;

            const error = await request().catch((error) => error);
            expect(error).toBeInstanceOf(IntegrationError);
            expect(error).toMatchObject({ reason, code: 424 });
            expect(error.message).not.toContain('private-provider-body');
            expect(fetchMock).toHaveBeenCalledTimes(1);
        },
    );
});
