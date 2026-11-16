import { afterEach, describe, expect, it, mock } from 'bun:test';

import { ExposableError, IntegrationError } from '@gitbook/runtime';
import { getMailingLists, subscribeUserToList } from '../src/sdk';

import integration from '../src';

const ORIGINAL_FETCH = globalThis.fetch;

const request = () =>
    subscribeUserToList('list', 'test@example.test', {
        apiEndpoint: 'https://mailchimp.test',
        accessToken: 'test-token',
    });

afterEach(() => {
    globalThis.fetch = ORIGINAL_FETCH;
});

describe('mailchimp provider failures', () => {
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

it('identifies email validation without exposing the submitted email', async () => {
    globalThis.fetch = mock(async () =>
        Response.json(
            {
                title: 'Invalid Resource',
                errors: [{ field: 'email_address', message: 'private-email-value' }],
            },
            { status: 400 },
        ),
    ) as unknown as typeof fetch;
    await expect(request()).rejects.toMatchObject({ reason: 'invalid_input', code: 422 });
});

it('does not classify unknown 400 responses by their text', async () => {
    globalThis.fetch = mock(
        async () => new Response('invalid email', { status: 400 }),
    ) as unknown as typeof fetch;
    const error = await request().catch((error) => error);
    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBeInstanceOf(ExposableError);
});

it('also classifies rejected tokens while listing audiences', async () => {
    globalThis.fetch = mock(
        async () => new Response(null, { status: 401 }),
    ) as unknown as typeof fetch;
    await expect(getMailingLists('https://mailchimp.test', 'test-token')).rejects.toMatchObject({
        reason: 'authentication_required',
    });
});

it('lets the renderer propagate a rejected connection to the SDK error envelope', async () => {
    Object.assign(globalThis, { MODE: 'production' });
    const fetchMock = mock(async () => new Response('private-provider-body', { status: 401 }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const form = new FormData();
    form.set(
        'environment',
        JSON.stringify({
            apiEndpoint: 'https://api.gitbook.test',
            apiTokens: { integration: 'test-token' },
            integration: { name: 'mailchimp', urls: {} },
            installation: {
                id: 'installation',
                configuration: {
                    api_endpoint: 'https://mailchimp.test',
                    oauth_credentials: { access_token: 'test-token' },
                },
            },
        }),
    );
    form.set(
        'event',
        JSON.stringify({
            type: 'ui_render',
            eventId: 'test',
            componentId: 'mailchimpSubscribe',
            props: { listId: 'list' },
            context: { type: 'document', spaceId: 'space', editable: false, theme: 'light' },
            action: { action: 'subscribe', email: 'test@example.test' },
        }),
    );
    const response = await integration.fetch(
        new Request('https://integration.test/v1', { method: 'POST', body: form }),
        {},
        { waitUntil() {}, passThroughOnException() {}, exports: {}, props: {}, abort() {} },
    );
    expect(response.status).toBe(424);
    expect(await response.json()).toMatchObject({
        integrationError: { version: 1, code: 'authentication_required' },
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
});
