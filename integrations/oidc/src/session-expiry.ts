import { Logger } from '@gitbook/runtime';

/**
 * Derivation of the GitBook session token expiry from the tokens returned by the
 * upstream authentication provider.
 */

const logger = Logger('oidc.session-expiry');

/**
 * Which of the tokens returned by the authentication provider drives the expiry of
 * the GitBook session. Defaults to the ID token, matching the behaviour of the
 * integration before this option existed.
 */
export type OIDCSessionExpirySource = 'id_token' | 'access_token';

export const DEFAULT_SESSION_EXPIRY_SOURCE: OIDCSessionExpirySource = 'id_token';

/** Floor of the GitBook session lifetime, however short-lived the upstream token is. */
export const MINIMUM_SESSION_DURATION_SECONDS = 60 * 60;

/**
 * Ceiling of the GitBook session lifetime. Visitors are re-checked against the
 * authentication provider at least once a week, whichever lifetime it hands out.
 */
export const MAXIMUM_SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60;

/**
 * Derive the expiry of the GitBook session token from the upstream token the site
 * admin picked as the source of truth:
 *
 * - `id_token` (default): the `exp` claim of the ID token.
 * - `access_token`: the `expires_in` of the token response, counted from now.
 *
 * Either one can be missing or unusable, in which case the session falls back to the
 * minimum lifetime. The result is always clamped between the minimum and maximum
 * session durations.
 */
export function computeSessionExpiry(params: {
    source: OIDCSessionExpirySource;
    idTokenExp: unknown;
    accessTokenExpiresIn: unknown;
}): number {
    const now = Math.floor(Date.now() / 1000);
    const minimumExp = now + MINIMUM_SESSION_DURATION_SECONDS;
    const maximumExp = now + MAXIMUM_SESSION_DURATION_SECONDS;

    let upstreamExp: number | undefined;
    if (params.source === 'access_token') {
        const expiresIn = toPositiveNumber(params.accessTokenExpiresIn);
        upstreamExp = expiresIn !== undefined ? now + expiresIn : undefined;
        if (upstreamExp === undefined) {
            logger.info(
                'token response has no usable expires_in, falling back to the minimum session duration',
            );
        }
    } else {
        upstreamExp = toPositiveNumber(params.idTokenExp);
    }

    return Math.min(maximumExp, Math.max(minimumExp, upstreamExp ?? 0));
}

/**
 * Coerce a value coming from the authentication provider into a positive number.
 * Providers are known to send numeric fields as strings, so those are accepted too.
 */
export function toPositiveNumber(value: unknown): number | undefined {
    const parsed = typeof value === 'string' ? Number(value) : value;
    if (typeof parsed !== 'number' || !Number.isFinite(parsed) || parsed <= 0) {
        return undefined;
    }

    return parsed;
}
