import { decryptCookieValue, encryptCookieValue } from './cookie';

/**
 * Carry the ID token issued at login by the upstream auth provider through to logout,
 * where it is passed as the `id_token_hint` to the logout URL so the provider does not
 * ask the visitor to confirm the logout.
 * Providers MUST prompt without it, per OpenID Connect RP-Initiated
 * Logout 1.0 §2: https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout
 *
 * The token carries the visitor's claims, so it is encrypted with the site
 * installation signing secret and bound to that installation and site: the
 * cookie lives on the shared integrations origin, where nothing else can read
 * or replay it.
 */

export const LOGOUT_HINT_COOKIE_NAME = 'gitbook-oidc-logout-hint';

const MAX_COOKIE_BYTES = 4096;

/**
 * The site installation a hint belongs to, shaped so callers can pass their
 * site installation straight through. Authenticated as part of the encryption,
 * so a hint encrypted for one site installation cannot be read by another,
 * whatever the cookie path scoping happens to be.
 */
export type LogoutHintScope = {
    installation: string;
    site: string;
};

type LogoutHintPayload = {
    /** The ID token as issued by the authentication provider. */
    idToken: string;
    /** Expiry of the hint, as a unix timestamp in seconds. */
    exp: number;
};

function serializeScope(scope: LogoutHintScope): string {
    return `${scope.installation}:${scope.site}`;
}

/**
 * Encrypt an ID token into the opaque value stored in the logout hint cookie.
 */
export async function encryptLogoutHint(
    signingSecret: string,
    scope: LogoutHintScope,
    idToken: string,
    expiresAt: number,
): Promise<string> {
    const payload: LogoutHintPayload = { idToken, exp: expiresAt };
    return encryptCookieValue(signingSecret, JSON.stringify(payload), serializeScope(scope));
}

/**
 * Decrypt a value produced by {@link encryptLogoutHint} and return the ID token.
 *
 * Returns `undefined` whenever the hint cannot be trusted: absent, tampered
 * with, encrypted for a different site installation, encrypted with a
 * since-rotated signing secret, or expired. Callers fall back to logging out
 * without a hint.
 */
export async function decryptLogoutHint(
    signingSecret: string,
    scope: LogoutHintScope,
    value: string,
): Promise<string | undefined> {
    let payload: LogoutHintPayload;
    try {
        const plaintext = await decryptCookieValue(signingSecret, value, serializeScope(scope));
        payload = JSON.parse(plaintext);
    } catch {
        return undefined;
    }

    if (typeof payload?.idToken !== 'string' || typeof payload?.exp !== 'number') {
        return undefined;
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
        return undefined;
    }

    return payload.idToken;
}

/**
 * Read and decrypt the logout hint from the cookies forwarded on the visitor
 * authentication event.
 */
export async function getLogoutHintFromCookies(
    cookies: Record<string, string> | undefined,
    signingSecret: string,
    scope: LogoutHintScope,
): Promise<string | undefined> {
    const value = cookies?.[LOGOUT_HINT_COOKIE_NAME];
    if (!value) {
        return undefined;
    }
    return decryptLogoutHint(signingSecret, scope, value);
}

/**
 * Serialize the Set-Cookie header carrying the encrypted logout hint.
 *
 * Only this integration can read it back: the cookie is host-only (no `Domain`),
 * scoped by `Path` to this installation and site, `HttpOnly` and `Secure`. It
 * expires with the GitBook session it was issued alongside.
 *
 * Returns `undefined` when the resulting cookie would exceed what browsers
 * accept, so the caller can carry on without a hint instead of emitting a
 * header that would be dropped.
 */
export function serializeLogoutHintCookie(
    value: string,
    path: string,
    expiresAt: number,
): string | undefined {
    const maxAge = Math.max(0, expiresAt - Math.floor(Date.now() / 1000));
    const cookie = [
        `${LOGOUT_HINT_COOKIE_NAME}=${value}`,
        `Path=${path}`,
        `Max-Age=${maxAge}`,
        'HttpOnly',
        'Secure',
        'SameSite=Lax',
    ].join('; ');

    if (new TextEncoder().encode(cookie).byteLength > MAX_COOKIE_BYTES) {
        return undefined;
    }

    return cookie;
}

/**
 * Serialize a Set-Cookie header that clears the logout hint cookie.
 */
export function clearLogoutHintCookie(path: string): string {
    return `${LOGOUT_HINT_COOKIE_NAME}=; Path=${path}; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}
