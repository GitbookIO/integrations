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
 * Encrypt the PKCE verifier with AES-GCM. The random IV is prepended to the
 * ciphertext and the result is base64url-encoded for cookie storage.
 */
export async function encryptPKCEVerifier(
    signingSecret: string,
    plaintext: string,
): Promise<string> {
    const key = await importPKCECookieKey(signingSecret);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        new TextEncoder().encode(plaintext),
    );
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.length);
    return base64url(combined);
}

/**
 * Decrypt a value produced by {@link encryptPKCEVerifier}. Throws if the cookie was
 * tampered with (AES-GCM authentication failure) or is malformed.
 */
async function decryptPKCEVerifier(signingSecret: string, value: string): Promise<string> {
    const key = await importPKCECookieKey(signingSecret);
    const combined = base64urlDecode(value);
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    return new TextDecoder().decode(plaintext);
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
        return await decryptPKCEVerifier(signingSecret, encryptedVerifier);
    } catch {
        return undefined;
    }
}

/**
 * Derive an AES-GCM key from the site installation signing secret, used to
 * encrypt the PKCE verifier before storing it in a cookie so the value stays
 * confidential and tamper-proof even if the cookie were to leak.
 */
async function importPKCECookieKey(signingSecret: string): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(signingSecret),
    );
    return crypto.subtle.importKey('raw', keyMaterial, { name: 'AES-GCM' }, false, [
        'encrypt',
        'decrypt',
    ]);
}

/**
 * Read a single cookie value from a request Cookie header.
 */
function readCookie(cookieHeader: string | null, name: string): string | undefined {
    if (!cookieHeader) {
        return undefined;
    }
    for (const part of cookieHeader.split(';')) {
        const [key, ...rest] = part.trim().split('=');
        if (key === name) {
            return rest.join('=');
        }
    }
    return undefined;
}

/**
 * Encode bytes as a base64url string, the encoding
 * required for PKCE code verifiers and challenges.
 */
function base64url(data: ArrayBuffer | Uint8Array): string {
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    return btoa(String.fromCharCode(...bytes))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

/**
 * Decode a base64url string back into bytes.
 */
function base64urlDecode(input: string): Uint8Array {
    const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}
