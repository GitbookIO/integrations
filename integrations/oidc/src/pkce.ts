import { base64url, decryptCookieValue, encryptCookieValue, readCookie } from './cookie';

/**
 * PKCE (Proof Key for Code Exchange, RFC 7636) helpers for the OIDC visitor
 * authentication flow.
 */

const PKCE_COOKIE_NAME = 'gitbook-oidc-pkce-verifier';

/**
 * How long (in seconds) the PKCE verifier cookie is valid. The visitor only
 * needs it for the brief round-trip to the authentication provider and back.
 */
const PKCE_COOKIE_MAX_AGE = 600;

/**
 * Generate a cryptographically random PKCE code verifier (RFC 7636 §4.1):
 * 32 random bytes encoded as a 43-character base64url string.
 */
export function generatePKCECodeVerifier(): string {
    return base64url(crypto.getRandomValues(new Uint8Array(32)));
}

/**
 * Compute the PKCE code challenge (S256) from a code verifier.
 */
export async function computePKCECodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const digest = await crypto.subtle.digest('SHA-256', encoder.encode(codeVerifier));
    return base64url(digest);
}

/**
 * Encrypt the PKCE verifier with AES-GCM for cookie storage.
 */
export async function encryptPKCEVerifier(
    signingSecret: string,
    plaintext: string,
): Promise<string> {
    return encryptCookieValue(signingSecret, plaintext);
}

/**
 * Serialize the Set-Cookie header carrying the encrypted PKCE verifier. The
 * cookie is first-party (HttpOnly, Secure), scoped to the integration's own
 * path, and uses SameSite=Lax so it is still sent on the top-level redirect
 * back from the authentication provider.
 */
export function serializePKCECookie(value: string, path: string): string {
    return [
        `${PKCE_COOKIE_NAME}=${value}`,
        `Path=${path}`,
        `Max-Age=${PKCE_COOKIE_MAX_AGE}`,
        'HttpOnly',
        'Secure',
        'SameSite=Lax',
    ].join('; ');
}

/**
 * Serialize a Set-Cookie header that clears the PKCE verifier cookie.
 */
export function clearPKCECookie(path: string): string {
    return `${PKCE_COOKIE_NAME}=; Path=${path}; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}

/**
 * Read the encrypted PKCE verifier cookie from a request Cookie header and
 * decrypt it back into the code verifier. Returns `undefined` when the cookie is
 * absent or cannot be decrypted (e.g. it was tampered with, or the signing
 * secret rotated since the flow started).
 */
export async function getPKCECodeVerifierFromCookie(
    cookieHeader: string | null,
    signingSecret: string,
): Promise<string | undefined> {
    const encryptedVerifier = readCookie(cookieHeader, PKCE_COOKIE_NAME);
    if (!encryptedVerifier) {
        return undefined;
    }
    try {
        return await decryptCookieValue(signingSecret, encryptedVerifier);
    } catch {
        return undefined;
    }
}
