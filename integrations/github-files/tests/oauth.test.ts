import { afterEach, describe, expect, it, mock, spyOn } from 'bun:test';
import { createOAuthHandler } from '@gitbook/runtime';
import { getGithubOAuthConfiguration } from '../src/oauth';
import type { GithubRuntimeContext } from '../src/types';

const existingCredentials = { access_token: 'existing-test-token' };
const transactionId = 't'.repeat(43);

function createContext() {
    const updateInstallation = mock(async () => ({ data: {} }));
    const context = {
        environment: {
            integration: {
                name: 'github-files-test',
                urls: { publicEndpoint: 'https://example.com/github-files' },
            },
            installation: {
                id: 'test-installation',
                configuration: { oauth_credentials: { ...existingCredentials } },
            },
            secrets: { CLIENT_ID: 'test-client', CLIENT_SECRET: 'test-secret' },
        },
        api: {
            integrations: {
                consumeIntegrationOAuthTransaction: mock(async () => ({
                    data: { installation: 'test-installation', codeVerifier: 'test-code-verifier' },
                })),
                updateIntegrationInstallation: updateInstallation,
            },
        },
    } as unknown as GithubRuntimeContext;

    return { context, updateInstallation };
}

function callbackRequest(state = transactionId) {
    const url = new URL('https://example.com/github-files/oauth');
    url.searchParams.set('code', 'test-code');
    url.searchParams.set('state', state);
    return new Request(url);
}

afterEach(() => {
    mock.restore();
});

describe('GitHub Files OAuth callback', () => {
    for (const error of [
        'bad_verification_code',
        'incorrect_client_credentials',
        'redirect_uri_mismatch',
        'unverified_user_email',
    ]) {
        it(`preserves the existing connection when GitHub returns ${error} with HTTP 200`, async () => {
            spyOn(console, 'debug').mockImplementation(() => {});
            const fetch = spyOn(globalThis, 'fetch').mockResolvedValue(
                Response.json({ error, error_description: 'Test OAuth error' }),
            );
            const { context, updateInstallation } = createContext();
            const handler = createOAuthHandler(getGithubOAuthConfiguration(context));

            await expect(handler(callbackRequest(), context)).rejects.toThrow(
                'GitHub authorization did not return an access token',
            );

            expect(fetch).toHaveBeenCalledTimes(1);
            expect(updateInstallation).not.toHaveBeenCalled();
            expect(context.environment.installation?.configuration.oauth_credentials).toEqual(
                existingCredentials,
            );
        });
    }

    for (const body of [
        null,
        {},
        { access_token: '' },
        { access_token: '   ' },
        { access_token: 123 },
        { error: 'bad_verification_code', access_token: 'unusable-test-token' },
    ]) {
        it(`does not save malformed credentials: ${JSON.stringify(body)}`, async () => {
            spyOn(console, 'debug').mockImplementation(() => {});
            spyOn(globalThis, 'fetch').mockResolvedValue(Response.json(body));
            const { context, updateInstallation } = createContext();
            const handler = createOAuthHandler(getGithubOAuthConfiguration(context));

            await expect(handler(callbackRequest(), context)).rejects.toThrow(
                'GitHub authorization did not return an access token',
            );

            expect(updateInstallation).not.toHaveBeenCalled();
        });
    }

    it('replaces the connection after a successful non-expiring token exchange', async () => {
        spyOn(console, 'debug').mockImplementation(() => {});
        const fetch = spyOn(globalThis, 'fetch').mockResolvedValue(
            Response.json({ access_token: 'replacement-test-token', token_type: 'bearer' }),
        );
        const { context, updateInstallation } = createContext();
        const handler = createOAuthHandler(getGithubOAuthConfiguration(context));

        const response = await handler(callbackRequest(), context);

        expect(response.status).toBe(200);
        expect(fetch).toHaveBeenCalledWith(
            'https://github.com/login/oauth/access_token',
            expect.objectContaining({
                body: expect.stringContaining('code_verifier=test-code-verifier'),
            }),
        );
        expect(updateInstallation).toHaveBeenCalledTimes(1);
        expect(updateInstallation).toHaveBeenCalledWith('github-files-test', 'test-installation', {
            configuration: { oauth_credentials: { access_token: 'replacement-test-token' } },
            oauthTransaction: transactionId,
        });
    });

    it('retains expiry and refresh metadata when GitHub supplies it', async () => {
        spyOn(console, 'debug').mockImplementation(() => {});
        spyOn(Date, 'now').mockReturnValue(1_800_000_000_000);
        spyOn(globalThis, 'fetch').mockResolvedValue(
            Response.json({
                access_token: 'replacement-test-token',
                expires_in: 28_800,
                refresh_token: 'refresh-test-token',
            }),
        );
        const { context, updateInstallation } = createContext();
        const handler = createOAuthHandler(getGithubOAuthConfiguration(context));

        await handler(callbackRequest(), context);

        expect(updateInstallation).toHaveBeenCalledWith('github-files-test', 'test-installation', {
            configuration: {
                oauth_credentials: {
                    access_token: 'replacement-test-token',
                    expires_at: 1_800_028_800_000,
                    refresh_token: 'refresh-test-token',
                },
            },
            oauthTransaction: transactionId,
        });
    });

    it('also preserves the existing connection for a failed legacy callback', async () => {
        spyOn(console, 'debug').mockImplementation(() => {});
        spyOn(globalThis, 'fetch').mockResolvedValue(
            Response.json({ error: 'bad_verification_code' }),
        );
        const { context, updateInstallation } = createContext();
        const handler = createOAuthHandler(getGithubOAuthConfiguration(context));

        await expect(
            handler(
                callbackRequest(JSON.stringify({ installationId: 'test-installation' })),
                context,
            ),
        ).rejects.toThrow('GitHub authorization did not return an access token');

        expect(updateInstallation).not.toHaveBeenCalled();
        expect(context.api.integrations.consumeIntegrationOAuthTransaction).not.toHaveBeenCalled();
    });
});
