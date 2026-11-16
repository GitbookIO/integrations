import { afterEach, expect, it, mock } from 'bun:test';
import { getGitlabContent } from '../src/gitlab';
import type { GitlabRuntimeContext } from '../src/types';

const ORIGINAL_FETCH = globalThis.fetch;
const CONTEXT = {
    environment: {
        installation: { configuration: { oauth_credentials: { access_token: 'test-token' } } },
    },
} as GitlabRuntimeContext;

afterEach(() => {
    globalThis.fetch = ORIGINAL_FETCH;
});

it('requires reconnecting for rejected GitLab credentials', async () => {
    globalThis.fetch = mock(
        async () => new Response(null, { status: 401 }),
    ) as unknown as typeof fetch;
    await expect(
        getGitlabContent('https://gitlab.com/org/repo/-/blob/main/file.md', CONTEXT),
    ).rejects.toMatchObject({ reason: 'authentication_required', code: 424 });
});

it.each([403, 404])('retains the existing unavailable-file fallback for %s', async (status) => {
    globalThis.fetch = mock(async () => new Response(null, { status })) as unknown as typeof fetch;
    const result = await getGitlabContent(
        'https://gitlab.com/org/repo/-/blob/main/file.md',
        CONTEXT,
    );
    expect(result?.content).toBe(false);
});
