/**
 * Primitives for reading and writing the encrypted cookies used by the OIDC visitor
 * authentication flow, shared by the PKCE code verifier and the logout hint.
 */

/**
 * Derive an AES-GCM key from a site installation signing secret. The secret is
 * scoped to a single site installation and is never handed to other
 * integrations, so values encrypted with it stay opaque to anything else running
 * on the shared integrations origin.
 */
export async function importCookieKey(signingSecret: string): Promise<CryptoKey> {
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
 * Encrypt a value with AES-GCM. The random IV is prepended to the ciphertext and
 * the result is base64url-encoded for cookie storage.
 *
 * `additionalData` is authenticated but not encrypted: passing a value that
 * identifies the site installation binds the ciphertext to it, so a cookie
 * captured elsewhere cannot be replayed here even if the paths were to collide.
 */
export async function encryptCookieValue(
    signingSecret: string,
    plaintext: string,
    additionalData?: string,
): Promise<string> {
    const key = await importCookieKey(signingSecret);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv,
            ...(additionalData ? { additionalData: new TextEncoder().encode(additionalData) } : {}),
        },
        key,
        new TextEncoder().encode(plaintext),
    );
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.length);
    return base64url(combined);
}

/**
 * Decrypt a value produced by {@link encryptCookieValue}. Throws if the cookie was
 * tampered with (AES-GCM authentication failure), if `additionalData` does not
 * match the value used when encrypting, or if the input is malformed.
 */
export async function decryptCookieValue(
    signingSecret: string,
    value: string,
    additionalData?: string,
): Promise<string> {
    const key = await importCookieKey(signingSecret);
    const combined = base64urlDecode(value);
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const plaintext = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv,
            ...(additionalData ? { additionalData: new TextEncoder().encode(additionalData) } : {}),
        },
        key,
        ciphertext,
    );
    return new TextDecoder().decode(plaintext);
}

/**
 * Read a single cookie value from a request Cookie header.
 */
export function readCookie(cookieHeader: string | null, name: string): string | undefined {
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
 * Encode bytes as a base64url string.
 */
export function base64url(data: ArrayBuffer | Uint8Array): string {
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    // Built in chunks rather than with a spread, as the values encoded here can
    // be several kilobytes long.
    let binary = '';
    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Decode a base64url string back into bytes.
 */
export function base64urlDecode(input: string): Uint8Array {
    const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}
