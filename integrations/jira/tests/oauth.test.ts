/// <reference types="bun" />

import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';

import jira from '../src';

const TOKEN_URL = 'https://auth.atlassian.com/oauth/token';
const SITES_URL = 'https://api.atlassian.com/oauth/token/accessible-resources';
const ISSUE_URL = 'https://api.atlassian.com/ex/jira/site-id/rest/api/3/issue/TEST-1';
const INSTALLATION_URL =
    'https://api.gitbook.test/v1/integrations/jira/installations/installation-id';
const SITE = {
    id: 'site-id',
    url: 'https://example.atlassian.net',
    name: 'Example',
    avatarUrl: 'https://example.test/avatar.png',
};
const originalFetch = globalThis.fetch;

beforeEach(() => {
    for (const level of ['log', 'debug', 'info', 'warn', 'error'] as const) {
        spyOn(console, level).mockImplementation(() => {});
    }
    // The Worker build normally supplies this constant.
    Object.assign(globalThis, { MODE: 'test' });
});

afterEach(() => {
    globalThis.fetch = originalFetch;
    Reflect.deleteProperty(globalThis, 'MODE');
    mock.restore();
});

describe('Jira OAuth refresh', () => {
    it('persists each rotated token without depending on the site discovery endpoint', async () => {
        const configuration = expiredConfiguration();
        const network = mockNetwork();

        const first = await render(configuration);

        expect(first.status).toBe(200);
        expect(network.calls).toEqual(['refresh', 'persist', 'issue']);
        expect(network.saved[0]).toEqual({
            ...configuration,
            oauth_credentials: {
                access_token: 'access-1',
                refresh_token: 'refresh-1',
                expires_at: expect.any(Number),
            },
        });
        expect(network.saved[0].oauth_credentials.expires_at).toBeGreaterThan(Date.now());

        const second = await render({
            ...network.saved[0],
            oauth_credentials: {
                ...network.saved[0].oauth_credentials,
                expires_at: Date.now() - 60_000,
            },
        });

        expect(second.status).toBe(200);
        expect(network.refreshTokens).toEqual(['refresh-0', 'refresh-1']);
        expect(network.saved[1].oauth_credentials.refresh_token).toBe('refresh-2');
        expect(network.saved[1].sites).toEqual([SITE]);
    });

    it('keeps the rotated credentials when the subsequent Jira issue request fails', async () => {
        const network = mockNetwork({ issueFails: true });

        const response = await render(expiredConfiguration());

        expect(response.ok).toBe(false);
        expect(network.calls).toEqual(['refresh', 'persist', 'issue']);
        expect(network.saved[0].oauth_credentials.refresh_token).toBe('refresh-1');
    });

    it('does not request the issue until the rotated credentials have been persisted', async () => {
        const network = mockNetwork({ persistenceFails: true });

        const response = await render(expiredConfiguration());

        expect(response.ok).toBe(false);
        expect(network.calls).toEqual(['refresh', 'persist']);
        expect(network.saved).toEqual([]);
    });

    it('does not retry an invalid refresh token or overwrite the saved configuration', async () => {
        const network = mockNetwork({ invalidRefreshToken: true });

        const response = await render(expiredConfiguration());

        expect(response.ok).toBe(false);
        expect(network.calls).toEqual(['refresh']);
        expect(network.refreshTokens).toEqual(['refresh-0']);
        expect(network.saved).toEqual([]);
    });

    it('uses an unexpired access token without refreshing or writing configuration', async () => {
        const configuration = expiredConfiguration();
        configuration.oauth_credentials.expires_at = Date.now() + 60_000;
        const network = mockNetwork();

        const response = await render(configuration);

        expect(response.status).toBe(200);
        expect(network.calls).toEqual(['issue']);
        expect(network.saved).toEqual([]);
    });
});

function expiredConfiguration() {
    return {
        sites: [SITE],
        setting: 'preserved',
        oauth_credentials: {
            access_token: 'access-0',
            refresh_token: 'refresh-0',
            expires_at: Date.now() - 60_000,
        },
    };
}

async function render(configuration: ReturnType<typeof expiredConfiguration>) {
    const form = new FormData();
    form.set(
        'event',
        JSON.stringify({
            type: 'ui_render',
            eventId: 'test-event',
            componentId: 'embed',
            props: { url: `${SITE.url}/browse/TEST-1` },
            context: {},
        }),
    );
    form.set(
        'environment',
        JSON.stringify({
            integration: { name: 'jira', version: 'test' },
            installation: { id: 'installation-id', configuration },
            secrets: { CLIENT_ID: 'test-client', CLIENT_SECRET: 'test-secret' },
            apiEndpoint: 'https://api.gitbook.test',
            apiTokens: { integration: 'test-integration', installation: 'test-installation' },
        }),
    );
    return jira.fetch(new Request('https://worker.test/v1', { method: 'POST', body: form }), {}, {
        waitUntil() {},
    } as any);
}

function mockNetwork(
    options: {
        issueFails?: boolean;
        persistenceFails?: boolean;
        invalidRefreshToken?: boolean;
    } = {},
) {
    const calls: string[] = [];
    const saved: ReturnType<typeof expiredConfiguration>[] = [];
    const refreshTokens: (string | null)[] = [];

    globalThis.fetch = mock(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = input instanceof Request ? input.url : String(input);
        if (url === TOKEN_URL) {
            calls.push('refresh');
            const params = new URLSearchParams(String(init?.body));
            expect(params.get('grant_type')).toBe('refresh_token');
            refreshTokens.push(params.get('refresh_token'));
            if (options.invalidRefreshToken) {
                return Response.json(
                    {
                        error: 'unauthorized_client',
                        error_description: 'refresh_token is invalid',
                    },
                    { status: 403 },
                );
            }
            return Response.json({
                access_token: `access-${refreshTokens.length}`,
                refresh_token: `refresh-${refreshTokens.length}`,
                expires_in: 3600,
            });
        }
        if (url === SITES_URL) {
            calls.push('sites');
            return new Response('Site discovery unavailable', { status: 503 });
        }
        if (url === INSTALLATION_URL) {
            calls.push('persist');
            expect(init?.method).toBe('PATCH');
            if (options.persistenceFails) {
                return Response.json({ error: 'Unavailable' }, { status: 503 });
            }
            const { configuration } = JSON.parse(String(init?.body));
            saved.push(configuration);
            return Response.json({ id: 'installation-id', configuration });
        }
        if (url === ISSUE_URL) {
            calls.push('issue');
            if (options.issueFails) {
                throw new Error('Jira issue request unavailable');
            }
            return Response.json({
                key: 'TEST-1',
                fields: {
                    summary: 'Test issue',
                    status: { name: 'Open' },
                    issuetype: { iconUrl: 'https://example.test/issue.png' },
                },
            });
        }
        throw new Error(`Unexpected test request: ${url}`);
    }) as typeof fetch;

    return { calls, saved, refreshTokens };
}
