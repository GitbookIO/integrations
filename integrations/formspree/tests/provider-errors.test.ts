import { afterEach, expect, it, mock } from 'bun:test';
import { ExposableError } from '@gitbook/runtime';
import { handleSubmit } from '../src/utils';

const ORIGINAL_FETCH = globalThis.fetch;
const INPUT = { email: 'test@example.test', name: 'Test', message: 'Test' };

afterEach(() => {
    globalThis.fetch = ORIGINAL_FETCH;
});

it('reports rejected form input without submitting again', async () => {
    const fetchMock = mock(async () =>
        Response.json(
            { errors: [{ code: 'TYPE_EMAIL', field: 'email', message: 'private-provider-body' }] },
            { status: 422 },
        ),
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    await expect(handleSubmit('form', INPUT)).rejects.toMatchObject({
        reason: 'invalid_input',
        code: 422,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
});

it('keeps provider outages unexpected', async () => {
    globalThis.fetch = mock(
        async () => new Response(null, { status: 503 }),
    ) as unknown as typeof fetch;
    const error = await handleSubmit('form', INPUT).catch((error) => error);
    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBeInstanceOf(ExposableError);
});

it.each([
    () => new Response('<html>private-provider-body</html>', { status: 422 }),
    () => Response.json({ errors: [{ code: 'UNKNOWN' }] }, { status: 422 }),
    () => Response.json({ errors: [{ code: 'TYPE_EMAIL', field: 'email' }] }, { status: 503 }),
])('keeps unrecognized and unavailable responses unexpected', async (response) => {
    globalThis.fetch = mock(async () => response()) as unknown as typeof fetch;
    const error = await handleSubmit('form', INPUT).catch((error) => error);
    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBeInstanceOf(ExposableError);
});

it('recognizes a disabled form as a configuration failure', async () => {
    globalThis.fetch = mock(async () =>
        Response.json({ errors: [{ code: 'INACTIVE' }] }, { status: 422 }),
    ) as unknown as typeof fetch;
    await expect(handleSubmit('form', INPUT)).rejects.toMatchObject({
        reason: 'configuration_required',
        code: 424,
    });
});
