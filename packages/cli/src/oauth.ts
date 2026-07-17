import { spawn } from 'node:child_process';
import * as crypto from 'node:crypto';
import * as http from 'node:http';
import { URL } from 'node:url';

import getPort from 'get-port';

import { version } from '../package.json';
import type { OAuthSession } from './config';
import { OAUTH_SCOPES } from './generated-oauth-scopes';

const CLIENT_NAME = 'GitBook CLI';
const CLIENT_URI = 'https://github.com/GitbookIO/integrations';
const USER_AGENT = `GitBook-CLI/${version}`;

/**
 * Refresh the access token this many milliseconds before it actually expires, to avoid
 * racing the API with a token that expires mid-request.
 */
const TOKEN_EXPIRY_BUFFER_MS = 60 * 1000;

/**
 * Subset of the RFC 8414 authorization server metadata we rely on.
 */
interface AuthorizationServerMetadata {
    issuer: string;
    authorization_endpoint: string;
    token_endpoint: string;
    registration_endpoint?: string;
    scopes_supported?: string[];
    code_challenge_methods_supported?: string[];
}

/**
 * Standard OAuth token endpoint response.
 */
interface OAuthTokenResponse {
    access_token: string;
    token_type: string;
    expires_in?: number;
    refresh_token?: string;
    scope?: string;
}

/**
 * Resolve the OAuth authorization server endpoint for a given API endpoint.
 *
 * The OAuth server lives on a sibling host of the API (e.g. `api.gitbook.com` ->
 * `oauth.gitbook.com`, `api-tal.gitbook.space` -> `oauth-tal.gitbook.space`). It can be
 * overridden explicitly with `GITBOOK_OAUTH_ENDPOINT` for setups that don't follow that
 * convention.
 */
export function resolveOAuthEndpoint(apiEndpoint: string): string {
    if (process.env.GITBOOK_OAUTH_ENDPOINT) {
        return process.env.GITBOOK_OAUTH_ENDPOINT.replace(/\/$/, '');
    }

    try {
        const url = new URL(apiEndpoint);
        const host = url.hostname;
        if (host === 'api.gitbook.com') {
            return 'https://oauth.gitbook.com';
        }
        if (host.startsWith('api.')) {
            return `${url.protocol}//oauth.${host.slice('api.'.length)}`;
        }
        if (host.startsWith('api-')) {
            return `${url.protocol}//oauth-${host.slice('api-'.length)}`;
        }
    } catch {
        // Fall through to the production default below.
    }

    return 'https://oauth.gitbook.com';
}

/**
 * Fetch the authorization server metadata (RFC 8414), falling back to the conventional
 * endpoint paths if the discovery document can't be retrieved.
 */
async function fetchAuthorizationServerMetadata(
    issuer: string,
): Promise<AuthorizationServerMetadata> {
    const metadataURL = `${issuer}/.well-known/oauth-authorization-server`;
    try {
        const response = await fetch(metadataURL, {
            headers: { accept: 'application/json', 'user-agent': USER_AGENT },
        });
        if (response.ok) {
            const metadata = (await response.json()) as AuthorizationServerMetadata;
            if (metadata.authorization_endpoint && metadata.token_endpoint) {
                return metadata;
            }
        }
    } catch {
        // Ignore and fall back to conventional endpoints.
    }

    return {
        issuer,
        authorization_endpoint: `${issuer}/authorize`,
        token_endpoint: `${issuer}/token`,
        registration_endpoint: `${issuer}/register`,
    };
}

/**
 * Register a public OAuth client for this CLI via Dynamic Client Registration (RFC 7591).
 */
async function registerClient(
    metadata: AuthorizationServerMetadata,
    redirectUri: string,
): Promise<string> {
    const registrationEndpoint = metadata.registration_endpoint ?? `${metadata.issuer}/register`;

    const response = await fetch(registrationEndpoint, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            accept: 'application/json',
            'user-agent': USER_AGENT,
        },
        body: JSON.stringify({
            client_name: CLIENT_NAME,
            client_uri: CLIENT_URI,
            redirect_uris: [redirectUri],
            grant_types: ['authorization_code', 'refresh_token'],
            response_types: ['code'],
            token_endpoint_auth_method: 'none',
            application_type: 'native',
        }),
    });

    if (!response.ok) {
        throw new Error(
            `Failed to register OAuth client (${response.status}): ${await safeErrorBody(response)}`,
        );
    }

    const registration = (await response.json()) as { client_id: string };
    if (!registration.client_id) {
        throw new Error('OAuth client registration did not return a client_id');
    }
    return registration.client_id;
}

/**
 * Perform the browser-based OAuth authorization code flow (with PKCE) and return the resulting
 * session. Opens the user's browser, spins up a temporary loopback server to receive the
 * redirect, and exchanges the authorization code for tokens.
 */
export async function authenticateWithBrowser({
    endpoint,
    onAuthorizationURL,
}: {
    endpoint: string;
    /**
     * Called with the authorization URL, so the caller can open/print it.
     */
    onAuthorizationURL: (url: string) => void;
}): Promise<OAuthSession> {
    const issuer = resolveOAuthEndpoint(endpoint);
    const metadata = await fetchAuthorizationServerMetadata(issuer);

    const port = await getPort();
    const redirectUri = `http://127.0.0.1:${port}/callback`;
    const clientId = await registerClient(metadata, redirectUri);

    // PKCE (RFC 7636) — the code verifier never leaves this process; only its S256 challenge
    // is sent to the authorization endpoint.
    const codeVerifier = base64URLEncode(crypto.randomBytes(32));
    const codeChallenge = base64URLEncode(
        crypto.createHash('sha256').update(codeVerifier).digest(),
    );
    const state = base64URLEncode(crypto.randomBytes(16));

    // Request every scope the server supports; the user narrows it on the consent
    // screen. Prefer the server's discovery metadata (environment-correct); fall
    // back to the spec-derived scope list only when discovery omits it, so login
    // never silently requests zero scopes. See generated-oauth-scopes.ts.
    const supported = metadata.scopes_supported ?? [];
    const scope = (supported.length > 0 ? supported : OAUTH_SCOPES).join(' ');

    const authorizationURL = new URL(metadata.authorization_endpoint);
    authorizationURL.searchParams.set('response_type', 'code');
    authorizationURL.searchParams.set('client_id', clientId);
    authorizationURL.searchParams.set('redirect_uri', redirectUri);
    authorizationURL.searchParams.set('state', state);
    authorizationURL.searchParams.set('code_challenge', codeChallenge);
    authorizationURL.searchParams.set('code_challenge_method', 'S256');
    if (scope) {
        authorizationURL.searchParams.set('scope', scope);
    }

    const code = await waitForAuthorizationCode({
        port,
        state,
        onReady: () => {
            onAuthorizationURL(authorizationURL.toString());
            openBrowser(authorizationURL.toString());
        },
    });

    const tokenResponse = await exchangeToken(metadata.token_endpoint, {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier,
    });

    return {
        issuer,
        clientId,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt: expiryFromResponse(tokenResponse),
        scope: tokenResponse.scope ?? (scope || undefined),
    };
}

/**
 * Return a valid OAuth session, refreshing the access token if it has expired (or is about
 * to). Returns the same session when still valid, an updated session when refreshed, or
 * `null` if the session couldn't be refreshed and the user must log in again.
 */
export async function refreshOAuthSessionIfNeeded(
    oauth: OAuthSession,
): Promise<OAuthSession | null> {
    const stillValid =
        oauth.accessToken &&
        oauth.expiresAt &&
        oauth.expiresAt - TOKEN_EXPIRY_BUFFER_MS > Date.now();
    if (stillValid) {
        return oauth;
    }

    if (!oauth.refreshToken) {
        return null;
    }

    const metadata = await fetchAuthorizationServerMetadata(oauth.issuer);
    let tokenResponse: OAuthTokenResponse;
    try {
        tokenResponse = await exchangeToken(metadata.token_endpoint, {
            grant_type: 'refresh_token',
            refresh_token: oauth.refreshToken,
            client_id: oauth.clientId,
        });
    } catch {
        return null;
    }

    return {
        ...oauth,
        accessToken: tokenResponse.access_token,
        // The server may rotate the refresh token; keep the previous one otherwise.
        refreshToken: tokenResponse.refresh_token ?? oauth.refreshToken,
        expiresAt: expiryFromResponse(tokenResponse),
        scope: tokenResponse.scope ?? oauth.scope,
    };
}

/**
 * Exchange a grant at the token endpoint. The CLI is a public client, so `client_id` is sent
 * in the body and no client secret is used.
 */
async function exchangeToken(
    tokenEndpoint: string,
    params: Record<string, string>,
): Promise<OAuthTokenResponse> {
    const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            accept: 'application/json',
            'user-agent': USER_AGENT,
        },
        body: new URLSearchParams(params).toString(),
    });

    if (!response.ok) {
        throw new Error(
            `Token request failed (${response.status}): ${await safeErrorBody(response)}`,
        );
    }

    return (await response.json()) as OAuthTokenResponse;
}

/**
 * Start a temporary loopback HTTP server to receive the OAuth redirect and resolve with the
 * authorization code once it arrives.
 */
function waitForAuthorizationCode({
    port,
    state,
    onReady,
}: {
    port: number;
    state: string;
    onReady: () => void;
}): Promise<string> {
    return new Promise((resolve, reject) => {
        // Give up if the user never completes the browser flow, so the CLI doesn't hang forever.
        // The server-side authorization session expires after 10 minutes.
        const timeout = setTimeout(
            () => {
                server.close();
                reject(
                    new Error(
                        'Timed out waiting for authentication. Please run the command again.',
                    ),
                );
            },
            10 * 60 * 1000,
        );

        const settle = (fn: () => void) => {
            clearTimeout(timeout);
            server.close();
            fn();
        };

        const server = http.createServer((req, res) => {
            const requestURL = new URL(req.url ?? '/', `http://127.0.0.1:${port}`);
            if (requestURL.pathname !== '/callback') {
                res.writeHead(404).end();
                return;
            }

            const error = requestURL.searchParams.get('error');
            const code = requestURL.searchParams.get('code');
            const returnedState = requestURL.searchParams.get('state');

            const finish = (statusCode: number, message: string) => {
                res.writeHead(statusCode, { 'content-type': 'text/html; charset=utf-8' });
                res.end(renderCallbackPage(message));
            };

            if (error) {
                finish(400, 'Authentication failed. You can close this tab and return to the CLI.');
                settle(() =>
                    reject(
                        new Error(
                            requestURL.searchParams.get('error_description') ||
                                `Authorization failed: ${error}`,
                        ),
                    ),
                );
                return;
            }

            if (!code || returnedState !== state) {
                finish(400, 'Authentication failed. You can close this tab and return to the CLI.');
                settle(() => reject(new Error('Invalid authorization response (state mismatch)')));
                return;
            }

            finish(200, 'Authentication successful! You can close this tab and return to the CLI.');
            settle(() => resolve(code));
        });

        server.on('error', (err) => {
            clearTimeout(timeout);
            reject(err);
        });
        server.listen(port, '127.0.0.1', onReady);
    });
}

/**
 * Open a URL in the user's default browser. Best-effort: failures are silent since the URL is
 * also printed for the user to open manually.
 */
function openBrowser(url: string): void {
    const command =
        process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'cmd' : 'xdg-open';
    const args = process.platform === 'win32' ? ['/c', 'start', '""', url] : [url];

    try {
        const child = spawn(command, args, { stdio: 'ignore', detached: true });
        child.on('error', () => {
            /* ignore — the URL was printed for manual opening */
        });
        child.unref();
    } catch {
        // Ignore — the URL was printed for manual opening.
    }
}

function expiryFromResponse(tokenResponse: OAuthTokenResponse): number | undefined {
    return tokenResponse.expires_in ? Date.now() + tokenResponse.expires_in * 1000 : undefined;
}

function base64URLEncode(buffer: Buffer): string {
    return buffer.toString('base64url');
}

async function safeErrorBody(response: Response): Promise<string> {
    try {
        return (await response.text()).slice(0, 500);
    } catch {
        return response.statusText;
    }
}

function renderCallbackPage(message: string): string {
    return `<!doctype html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>GitBook CLI</title>
        <style>
            body { font-family: -apple-system, system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f7f7f8; color: #1a1a1a; }
            .card { background: #fff; padding: 2rem 2.5rem; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); text-align: center; max-width: 24rem; }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>GitBook CLI</h1>
            <p>${message}</p>
        </div>
    </body>
</html>`;
}
