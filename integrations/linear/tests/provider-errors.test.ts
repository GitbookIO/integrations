import { afterEach, describe, expect, it, mock } from 'bun:test';

import { IntegrationError } from '@gitbook/runtime';
import { getLinearAPIClient } from '../src/linear';

import integration from '../src';

const ORIGINAL_FETCH = globalThis.fetch;

const request = async () =>
    (await getLinearAPIClient({ oauth_credentials: { access_token: 'test-token' } })).issue({
        id: 'TEST-1',
    });

afterEach(() => {
    globalThis.fetch = ORIGINAL_FETCH;
});

describe('linear provider failures', () => {
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
            integration: { name: 'linear', urls: {} },
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
            componentId: 'embed',
            props: { issueId: 'TEST-1', url: 'https://linear.app/team/issue/TEST-1/test' },
            context: { type: 'document', spaceId: 'space', editable: false, theme: 'light' },
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
