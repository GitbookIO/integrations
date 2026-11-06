import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';

import { createOAuthHandler, getOAuthToken } from '../src/oauth';

const CLIENT_SECRET = 'fake-client-secret-0001';
const AUTHORIZATION_CODE = 'fake-authorization-code-0002';
const ACCESS_TOKEN = 'fake-access-token-0003';
const REFRESH_TOKEN = 'fake-refresh-token-0004';
const ID_TOKEN = 'fake-id-token-0005';

const SECRETS = [CLIENT_SECRET, AUTHORIZATION_CODE, ACCESS_TOKEN, REFRESH_TOKEN, ID_TOKEN];

const OAUTH_CONFIG = {
    clientId: 'client-id',
    clientSecret: CLIENT_SECRET,
    authorizeURL: 'https://provider.test/oauth/authorize',
    accessTokenURL: 'https://provider.test/oauth/token',
};

const originalFetch = globalThis.fetch;
let logged: string[] = [];

beforeEach(() => {
    logged = [];
    for (const level of ['log', 'debug', 'info', 'warn', 'error'] as const) {
        spyOn(console, level).mockImplementation((...args: unknown[]) => {
            logged.push(args.map((arg) => stringify(arg)).join(' '));
        });
    }
});

afterEach(() => {
    globalThis.fetch = originalFetch;
    mock.restore();
});

describe('createOAuthHandler', () => {
    it('should store the exchanged credentials', async () => {
        mockTokenEndpoint(
            Response.json({
                access_token: ACCESS_TOKEN,
                refresh_token: REFRESH_TOKEN,
                expires_in: 3600,
            }),
        );
        const context = createContext();

        const response = await createOAuthHandler(OAUTH_CONFIG)(createCallbackRequest(), context);

        expect(response.status).toBe(200);
        expect(context.api.integrations.updateIntegrationInstallation).toHaveBeenCalledWith(
            'test-integration',
            'installation-id',
            {
                configuration: {
                    oauth_credentials: expect.objectContaining({
                        access_token: ACCESS_TOKEN,
                        refresh_token: REFRESH_TOKEN,
                    }),
                },
            },
        );
        expect(logged.join('\n')).toContain('exchanged code for credentials');
        expectNoSecrets(logged.join('\n'));
    });

    it('should fail when the token response has no access_token', async () => {
        mockTokenEndpoint(Response.json({ refresh_token: REFRESH_TOKEN, id_token: ID_TOKEN }));

        const error = await getRejection(
            createOAuthHandler(OAUTH_CONFIG)(createCallbackRequest(), createContext()),
        );

        expect(error.message).toBe('Failed to retrieve access_token from response');
        expect(logged.join('\n')).toContain('fields: refresh_token, id_token');
        expectNoSecrets(`${error.message}\n${logged.join('\n')}`);
    });

    it('should summarize an unparseable provider error', async () => {
        mockTokenEndpoint(
            new Response(
                `invalid request client_secret=${CLIENT_SECRET} code=${AUTHORIZATION_CODE}`,
                {
                    status: 400,
                    statusText: 'Bad Request',
                    headers: { 'Content-Type': 'text/plain' },
                },
            ),
        );

        const error = await getRejection(
            createOAuthHandler(OAUTH_CONFIG)(createCallbackRequest(), createContext()),
        );

        expect(error.message).toBe(
            'Failed to exchange code for access token: HTTP 400 Bad Request: no error details',
        );
        expectNoSecrets(`${error.message}\n${logged.join('\n')}`);
    });
});

describe('getOAuthToken', () => {
    it('should refresh an expired token', async () => {
        const fetchMock = mockTokenEndpoint(
            Response.json({
                access_token: ACCESS_TOKEN,
                refresh_token: REFRESH_TOKEN,
                expires_in: 3600,
            }),
        );
        const context = createContext();

        const token = await getOAuthToken(
            {
                access_token: 'expired-token',
                refresh_token: REFRESH_TOKEN,
                expires_at: expiredAt(),
            },
            OAUTH_CONFIG,
            context,
        );

        expect(token).toBe(ACCESS_TOKEN);
        expect(context.api.integrations.updateIntegrationInstallation).toHaveBeenCalledTimes(1);
        expectNoSecrets(String(fetchMock.mock.calls[0]?.[0]));
        expectNoSecrets(logged.join('\n'));
    });

    it('should report the provider error when the refresh fails', async () => {
        mockTokenEndpoint(
            Response.json(
                {
                    error: 'invalid_grant',
                    error_description: 'The refresh token is invalid',
                    refresh_token: REFRESH_TOKEN,
                },
                { status: 400, statusText: 'Bad Request' },
            ),
        );

        const error = await getRejection(
            getOAuthToken(
                {
                    access_token: 'expired-token',
                    refresh_token: REFRESH_TOKEN,
                    expires_at: expiredAt(),
                },
                OAUTH_CONFIG,
                createContext(),
            ),
        );

        expect(error.message).toBe(
            'Failed to refresh the OAuth access token: HTTP 400 Bad Request: invalid_grant: The refresh token is invalid',
        );
        expectNoSecrets(`${error.message}\n${logged.join('\n')}`);
    });
});

function mockTokenEndpoint(response: Response) {
    const fetchMock = mock(async () => response);
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    return fetchMock;
}

function createCallbackRequest(): Request {
    const url = new URL('https://integrations.gitbook.test/v1/integrations/test-integration/oauth');
    url.searchParams.set('code', AUTHORIZATION_CODE);
    url.searchParams.set('state', JSON.stringify({ installationId: 'installation-id' }));
    return new Request(url);
}

function createContext() {
    const integrations = {
        getIntegrationInstallationById: mock(async () => ({ data: { configuration: {} } })),
        updateIntegrationInstallation: mock(async () => ({ data: {} })),
        updateIntegrationSpaceInstallation: mock(async () => ({ data: {} })),
        updateIntegrationSiteInstallation: mock(async () => ({ data: {} })),
    };

    // Only the fields read by the OAuth helpers are provided.
    return {
        api: { integrations },
        environment: {
            integration: { name: 'test-integration' },
            installation: { id: 'installation-id', configuration: {} },
        },
    } as any;
}

function expiredAt(): string {
    return new Date(Date.now() - 60_000).toISOString();
}

async function getRejection(promise: Promise<unknown>): Promise<Error> {
    try {
        await promise;
    } catch (error) {
        return error as Error;
    }
    throw new Error('Expected the promise to reject');
}

function expectNoSecrets(output: string) {
    for (const secret of SECRETS) {
        expect(output).not.toContain(secret);
    }
}

function stringify(value: unknown): string {
    if (typeof value === 'string') {
        return value;
    }
    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
}
