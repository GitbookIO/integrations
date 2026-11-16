import { describe, expect, it } from 'bun:test';

import type { IntegrationEnvironment } from '@gitbook/api';

import { ExposableError, IntegrationError, createIntegration } from '../src';

const ENVIRONMENT = {
    apiEndpoint: 'https://api.example.test',
    apiTokens: { integration: 'test-token' },
    integration: { name: 'test-integration', version: '1' },
} as IntegrationEnvironment;

describe('integration error responses', () => {
    it.each([
        ['authentication_required', 424],
        ['configuration_required', 424],
        ['invalid_input', 422],
    ] as const)('declares %s in a versioned envelope', async (reason, status) => {
        const error = new IntegrationError(reason);
        const response = await runFailure(error);

        expect(response.status).toBe(status);
        expect(await response.json()).toEqual({
            error: error.message,
            integrationError: { version: 1, code: reason },
        });
    });
    it.each([401, 403])(
        'does not send an integration %s as a GitBook login failure',
        async (status) => {
            const response = await runFailure(
                new ExposableError('private-provider-response', status),
            );

            expect(response.status).toBe(424);
            expect(await response.json()).toEqual({
                error: 'The integration connection needs attention. Ask an administrator to reconnect the integration.',
            });
        },
    );

    it('keeps explicitly exposable errors compatible with existing clients', async () => {
        const response = await runFailure(new ExposableError('Enter a valid URL', 400));

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: 'Enter a valid URL' });
    });

    it('preserves custom HTTP responses from fetch handlers', async () => {
        const response = await runFailure(new ExposableError('Authentication required', 401), true);

        expect(response.status).toBe(401);
        expect(await response.json()).toEqual({ error: 'Authentication required' });
    });

    it.each([
        new Error('401 Unauthorized private-provider-response'),
        new SyntaxError('Unexpected token in private-provider-response'),
        { status: 422, message: 'Rejected input' },
        null,
    ])('keeps unexpected failures private and returns JSON 500', async (failure) => {
        const response = await runFailure(failure);

        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({ error: 'Internal server error' });
    });
});

async function runFailure(failure: unknown, fetchEvent = false): Promise<Response> {
    Object.assign(globalThis, { MODE: 'production' });
    const integration = createIntegration({
        fetch: async () => {
            throw failure;
        },
        components: [
            {
                componentId: 'test',
                render: async () => {
                    throw failure;
                },
            },
        ],
    });
    const form = new FormData();
    form.set('environment', JSON.stringify(ENVIRONMENT));
    form.set(
        'event',
        JSON.stringify(
            fetchEvent
                ? {
                      type: 'fetch',
                      eventId: 'test-event',
                      request: {
                          url: 'https://integration.example.test/callback',
                          method: 'GET',
                          headers: {},
                      },
                  }
                : { type: 'ui_render', eventId: 'test-event', componentId: 'test' },
        ),
    );
    return integration.fetch(
        new Request('https://integration.example.test/v1', { method: 'POST', body: form }),
        {},
        {
            waitUntil() {},
            passThroughOnException() {},
        },
    );
}
