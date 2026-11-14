import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';

import { GitBookAPIError } from '@gitbook/api';

import { createOAuthHandler, getOAuthToken } from '../src/oauth';

const CLIENT_SECRET = 'fake-client-secret-0001';
const AUTHORIZATION_CODE = 'fake-authorization-code-0002';
const ACCESS_TOKEN = 'fake-access-token-0003';
const REFRESH_TOKEN = 'fake-refresh-token-0004';
const ID_TOKEN = 'fake-id-token-0005';

const TRANSACTION_ID = 'fakeTransactionId0006_abcdefghijklmnopqrstu';
const CODE_CHALLENGE = 'fakeCodeChallenge0007_abcdefghijklmnopqrstu';
const CODE_VERIFIER = 'fakeCodeVerifier0008';

const SECRETS = [
    CLIENT_SECRET,
    AUTHORIZATION_CODE,
    ACCESS_TOKEN,
    REFRESH_TOKEN,
    ID_TOKEN,
    TRANSACTION_ID,
    CODE_VERIFIER,
];

const INTEGRATION_ENDPOINT = 'https://integrations.gitbook.test/v1/integrations/test-integration';
const REDIRECT_URL = `${INTEGRATION_ENDPOINT}/oauth`;

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

describe('createOAuthHandler start', () => {
    it('should use the transaction ID as state and send the PKCE challenge', async () => {
        const response = await createOAuthHandler({ ...OAUTH_CONFIG, pkce: true })(
            createStartRequest({
                gitbook_oauth_transaction: TRANSACTION_ID,
                gitbook_oauth_code_challenge: CODE_CHALLENGE,
            }),
            createContext(),
        );

        const location = getRedirectLocation(response);
        expect(location.searchParams.get('state')).toBe(TRANSACTION_ID);
        expect(location.searchParams.get('code_challenge')).toBe(CODE_CHALLENGE);
        expect(location.searchParams.get('code_challenge_method')).toBe('S256');
        expect(location.searchParams.get('redirect_uri')).toBe(REDIRECT_URL);
        expectNoSecrets(logged.join('\n'));
    });

    it('should not send a PKCE challenge when PKCE is not enabled', async () => {
        const response = await createOAuthHandler(OAUTH_CONFIG)(
            createStartRequest({
                gitbook_oauth_transaction: TRANSACTION_ID,
                gitbook_oauth_code_challenge: CODE_CHALLENGE,
            }),
            createContext(),
        );

        const location = getRedirectLocation(response);
        expect(location.searchParams.get('state')).toBe(TRANSACTION_ID);
        expect(location.searchParams.has('code_challenge')).toBe(false);
        expect(location.searchParams.has('code_challenge_method')).toBe(false);
    });

    it('should use the legacy JSON state without transaction parameters', async () => {
        const context = createContext();
        context.environment.spaceInstallation = { space: 'space-id' };

        const response = await createOAuthHandler({ ...OAUTH_CONFIG, pkce: true })(
            createStartRequest({}),
            context,
        );

        const location = getRedirectLocation(response);
        expect(JSON.parse(location.searchParams.get('state')!)).toEqual({
            installationId: 'installation-id',
            spaceId: 'space-id',
        });
        expect(location.searchParams.has('code_challenge')).toBe(false);
    });

    it('should refuse a start with only one of the transaction parameters', async () => {
        const response = await createOAuthHandler(OAUTH_CONFIG)(
            createStartRequest({ gitbook_oauth_transaction: TRANSACTION_ID }),
            createContext(),
        );

        expect(response.status).toBe(400);
        expect(await response.text()).toContain('start the connection again from GitBook');
    });

    it('should refuse malformed transaction parameters', async () => {
        const response = await createOAuthHandler(OAUTH_CONFIG)(
            createStartRequest({
                gitbook_oauth_transaction: '{"installationId":"other"}',
                gitbook_oauth_code_challenge: CODE_CHALLENGE,
            }),
            createContext(),
        );

        expect(response.status).toBe(400);
        expect(await response.text()).toContain('start the connection again from GitBook');
    });
});

describe('createOAuthHandler transaction callback', () => {
    it('should consume the transaction and write to the returned target only', async () => {
        const fetchMock = mockTokenEndpoint(
            Response.json({ access_token: ACCESS_TOKEN, expires_in: 3600 }),
        );
        const context = createContext({ space: 'bound-space-id' });

        const response = await createOAuthHandler(OAUTH_CONFIG)(
            createTransactionCallbackRequest(),
            context,
        );

        expect(response.status).toBe(200);
        expect(context.api.integrations.consumeIntegrationOAuthTransaction).toHaveBeenCalledWith(
            'test-integration',
            TRANSACTION_ID,
            { redirectUri: REDIRECT_URL, code: AUTHORIZATION_CODE },
        );
        expect(context.api.integrations.updateIntegrationSpaceInstallation).toHaveBeenCalledTimes(
            1,
        );
        expect(context.api.integrations.updateIntegrationSpaceInstallation).toHaveBeenCalledWith(
            'test-integration',
            'bound-installation-id',
            'bound-space-id',
            {
                configuration: {
                    oauth_credentials: expect.objectContaining({ access_token: ACCESS_TOKEN }),
                },
                oauthTransaction: TRANSACTION_ID,
            },
        );
        expect(context.api.integrations.updateIntegrationInstallation).not.toHaveBeenCalled();
        expect(context.api.integrations.updateIntegrationSiteInstallation).not.toHaveBeenCalled();
        expect(getTokenRequestBody(fetchMock).has('code_verifier')).toBe(false);
        expectNoSecrets(logged.join('\n'));
    });

    it('should send the code verifier when PKCE is enabled', async () => {
        const fetchMock = mockTokenEndpoint(
            Response.json({ access_token: ACCESS_TOKEN, expires_in: 3600 }),
        );
        const context = createContext();

        await createOAuthHandler({ ...OAUTH_CONFIG, pkce: true })(
            createTransactionCallbackRequest(),
            context,
        );

        const body = getTokenRequestBody(fetchMock);
        expect(body.get('code_verifier')).toBe(CODE_VERIFIER);
        expect(body.get('redirect_uri')).toBe(REDIRECT_URL);
        expect(context.api.integrations.updateIntegrationInstallation).toHaveBeenCalledWith(
            'test-integration',
            'bound-installation-id',
            expect.objectContaining({ oauthTransaction: TRANSACTION_ID }),
        );
        expectNoSecrets(logged.join('\n'));
    });

    it('should resolve a dynamic token URL from the returned installation', async () => {
        const fetchMock = mockTokenEndpoint(
            Response.json({ access_token: ACCESS_TOKEN, expires_in: 3600 }),
        );
        const context = createContext();
        context.api.integrations.getIntegrationInstallationById.mockImplementation(
            async (_name: string, installationId: string) => ({
                data: { id: installationId, configuration: {} },
            }),
        );

        await createOAuthHandler({
            ...OAUTH_CONFIG,
            accessTokenURL: (installation) => `https://provider.test/${installation.id}/token`,
        })(createTransactionCallbackRequest(), context);

        expect(context.api.integrations.getIntegrationInstallationById).toHaveBeenCalledWith(
            'test-integration',
            'bound-installation-id',
        );
        expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
            'https://provider.test/bound-installation-id/token',
        );
    });

    it('should ask to restart when PKCE is enabled and no verifier is returned', async () => {
        const fetchMock = mockTokenEndpoint(Response.json({ access_token: ACCESS_TOKEN }));
        const context = createContext();
        context.api.integrations.consumeIntegrationOAuthTransaction.mockImplementation(
            async () => ({
                data: {
                    id: TRANSACTION_ID,
                    installation: 'bound-installation-id',
                    codeVerifier: '',
                },
            }),
        );

        const response = await createOAuthHandler({ ...OAUTH_CONFIG, pkce: true })(
            createTransactionCallbackRequest(),
            context,
        );

        expect(response.status).toBe(400);
        expect(fetchMock).not.toHaveBeenCalled();
        expect(context.api.integrations.updateIntegrationInstallation).not.toHaveBeenCalled();
    });

    it('should merge with the configuration of the returned site installation', async () => {
        mockTokenEndpoint(Response.json({ access_token: ACCESS_TOKEN, expires_in: 3600 }));
        const context = createContext({ site: 'bound-site-id' });

        await createOAuthHandler(OAUTH_CONFIG, { replace: false })(
            createTransactionCallbackRequest(),
            context,
        );

        expect(context.api.integrations.getIntegrationSiteInstallation).toHaveBeenCalledWith(
            'test-integration',
            'bound-installation-id',
            'bound-site-id',
        );
        expect(context.api.integrations.updateIntegrationSiteInstallation).toHaveBeenCalledWith(
            'test-integration',
            'bound-installation-id',
            'bound-site-id',
            {
                configuration: {
                    existing: 'value',
                    oauth_credentials: expect.objectContaining({ access_token: ACCESS_TOKEN }),
                },
                oauthTransaction: TRANSACTION_ID,
            },
        );
    });

    for (const status of [404, 403, 503]) {
        it(`should ask to restart when consuming fails with ${status}`, async () => {
            const fetchMock = mockTokenEndpoint(Response.json({ access_token: ACCESS_TOKEN }));
            const context = createContext();
            context.api.integrations.consumeIntegrationOAuthTransaction.mockImplementation(
                async () => {
                    throw new GitBookAPIError(
                        'Transaction not found or already used',
                        new Response(null, { status }),
                    );
                },
            );

            const response = await createOAuthHandler(OAUTH_CONFIG)(
                createTransactionCallbackRequest(),
                context,
            );

            expect(response.status).toBe(400);
            const text = await response.text();
            expect(text).toContain('start the connection again from GitBook');
            expect(text).not.toContain('Transaction not found');
            expect(fetchMock).not.toHaveBeenCalled();
            expect(context.api.integrations.updateIntegrationInstallation).not.toHaveBeenCalled();
            expect(logged.join('\n')).toContain(`HTTP ${status}`);
            expectNoSecrets(`${text}\n${logged.join('\n')}`);
        });
    }
});

describe('createOAuthHandler legacy callback', () => {
    it('should write to the target of the JSON state without consuming a transaction', async () => {
        mockTokenEndpoint(Response.json({ access_token: ACCESS_TOKEN, expires_in: 3600 }));
        const context = createContext();

        await createOAuthHandler({ ...OAUTH_CONFIG, pkce: true })(createCallbackRequest(), context);

        expect(context.api.integrations.consumeIntegrationOAuthTransaction).not.toHaveBeenCalled();
        expect(context.api.integrations.updateIntegrationInstallation).toHaveBeenCalledWith(
            'test-integration',
            'installation-id',
            {
                configuration: {
                    oauth_credentials: expect.objectContaining({ access_token: ACCESS_TOKEN }),
                },
            },
        );
    });

    it('should not consume a transaction for a provider error without code', async () => {
        const context = createContext();
        delete context.environment.installation;
        const url = new URL(REDIRECT_URL);
        url.searchParams.set('error', 'access_denied');
        url.searchParams.set('state', TRANSACTION_ID);

        const response = await createOAuthHandler(OAUTH_CONFIG)(new Request(url), context);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({
            error: 'Cannot initiate OAuth flow without an installation',
        });
        expect(context.api.integrations.consumeIntegrationOAuthTransaction).not.toHaveBeenCalled();
        expectNoSecrets(logged.join('\n'));
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
    const url = new URL(REDIRECT_URL);
    url.searchParams.set('code', AUTHORIZATION_CODE);
    url.searchParams.set('state', JSON.stringify({ installationId: 'installation-id' }));
    return new Request(url);
}

function createTransactionCallbackRequest(): Request {
    const url = new URL(REDIRECT_URL);
    url.searchParams.set('code', AUTHORIZATION_CODE);
    url.searchParams.set('state', TRANSACTION_ID);
    return new Request(url);
}

function createStartRequest(params: Record<string, string>): Request {
    const url = new URL(REDIRECT_URL);
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
    }
    return new Request(url);
}

function getRedirectLocation(response: Response): URL {
    expect(response.status).toBe(302);
    return new URL(response.headers.get('Location')!);
}

function getTokenRequestBody(fetchMock: ReturnType<typeof mockTokenEndpoint>): URLSearchParams {
    const init = (fetchMock.mock.calls[0] as unknown[] | undefined)?.[1] as RequestInit;
    return new URLSearchParams(String(init.body));
}

/**
 * The bound target is deliberately different from the request's installation.
 */
function createContext(bound: { space?: string; site?: string } = {}) {
    const integrations = {
        consumeIntegrationOAuthTransaction: mock(async () => ({
            data: {
                object: 'integration-oauth-transaction',
                id: 'response-transaction-id',
                organization: 'organization-id',
                installation: 'bound-installation-id',
                ...bound,
                codeVerifier: CODE_VERIFIER,
                redirectUri: REDIRECT_URL,
                grantExpiresAt: new Date(Date.now() + 300_000).toISOString(),
            },
        })),
        getIntegrationInstallationById: mock(async () => ({ data: { configuration: {} } })),
        getIntegrationSpaceInstallation: mock(async () => ({
            data: { configuration: { existing: 'value' } },
        })),
        getIntegrationSiteInstallation: mock(async () => ({
            data: { configuration: { existing: 'value' } },
        })),
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
