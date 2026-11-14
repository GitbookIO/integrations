import { describe, expect, it } from 'bun:test';

import {
    computeSessionExpiry,
    MAXIMUM_SESSION_DURATION_SECONDS,
    MINIMUM_SESSION_DURATION_SECONDS,
    toPositiveNumber,
} from '../src/session-expiry';

const now = () => Math.floor(Date.now() / 1000);

/** The expiry is computed against a clock read inside the function, so allow a little drift. */
const expectCloseTo = (actual: number, expected: number) => {
    expect(Math.abs(actual - expected)).toBeLessThanOrEqual(2);
};

describe('computeSessionExpiry', () => {
    describe('with the ID token as the source', () => {
        it('uses the exp claim of the ID token', () => {
            const idTokenExp = now() + 3 * 60 * 60;
            expectCloseTo(
                computeSessionExpiry({
                    source: 'id_token',
                    idTokenExp,
                    accessTokenExpiresIn: 60,
                }),
                idTokenExp,
            );
        });

        it('ignores the expires_in of the token response', () => {
            const idTokenExp = now() + 3 * 60 * 60;
            expectCloseTo(
                computeSessionExpiry({
                    source: 'id_token',
                    idTokenExp,
                    accessTokenExpiresIn: MAXIMUM_SESSION_DURATION_SECONDS,
                }),
                idTokenExp,
            );
        });

        it('falls back to the minimum duration when the exp claim is missing', () => {
            expectCloseTo(
                computeSessionExpiry({
                    source: 'id_token',
                    idTokenExp: undefined,
                    accessTokenExpiresIn: undefined,
                }),
                now() + MINIMUM_SESSION_DURATION_SECONDS,
            );
        });

        it('raises a short-lived ID token up to the minimum duration', () => {
            expectCloseTo(
                computeSessionExpiry({
                    source: 'id_token',
                    idTokenExp: now() + 60,
                    accessTokenExpiresIn: undefined,
                }),
                now() + MINIMUM_SESSION_DURATION_SECONDS,
            );
        });

        it('caps a long-lived ID token at the maximum duration', () => {
            expectCloseTo(
                computeSessionExpiry({
                    source: 'id_token',
                    idTokenExp: now() + 365 * 24 * 60 * 60,
                    accessTokenExpiresIn: undefined,
                }),
                now() + MAXIMUM_SESSION_DURATION_SECONDS,
            );
        });
    });

    describe('with the access token as the source', () => {
        it('counts expires_in from now', () => {
            const expiresIn = 3 * 60 * 60;
            expectCloseTo(
                computeSessionExpiry({
                    source: 'access_token',
                    idTokenExp: undefined,
                    accessTokenExpiresIn: expiresIn,
                }),
                now() + expiresIn,
            );
        });

        it('ignores the exp claim of the ID token', () => {
            const expiresIn = 3 * 60 * 60;
            expectCloseTo(
                computeSessionExpiry({
                    source: 'access_token',
                    idTokenExp: now() + MAXIMUM_SESSION_DURATION_SECONDS,
                    accessTokenExpiresIn: expiresIn,
                }),
                now() + expiresIn,
            );
        });

        it('accepts expires_in sent as a string', () => {
            expectCloseTo(
                computeSessionExpiry({
                    source: 'access_token',
                    idTokenExp: undefined,
                    accessTokenExpiresIn: '7200',
                }),
                now() + 7200,
            );
        });

        it('falls back to the minimum duration when expires_in is absent', () => {
            expectCloseTo(
                computeSessionExpiry({
                    source: 'access_token',
                    idTokenExp: now() + 3 * 60 * 60,
                    accessTokenExpiresIn: undefined,
                }),
                now() + MINIMUM_SESSION_DURATION_SECONDS,
            );
        });

        it('falls back to the minimum duration when expires_in is not a usable number', () => {
            for (const expiresIn of [0, -60, 'soon', Number.NaN, null, {}]) {
                expectCloseTo(
                    computeSessionExpiry({
                        source: 'access_token',
                        idTokenExp: undefined,
                        accessTokenExpiresIn: expiresIn,
                    }),
                    now() + MINIMUM_SESSION_DURATION_SECONDS,
                );
            }
        });

        it('raises a short-lived access token up to the minimum duration', () => {
            expectCloseTo(
                computeSessionExpiry({
                    source: 'access_token',
                    idTokenExp: undefined,
                    accessTokenExpiresIn: 300,
                }),
                now() + MINIMUM_SESSION_DURATION_SECONDS,
            );
        });

        it('caps a long-lived access token at the maximum duration', () => {
            expectCloseTo(
                computeSessionExpiry({
                    source: 'access_token',
                    idTokenExp: undefined,
                    accessTokenExpiresIn: 30 * 24 * 60 * 60,
                }),
                now() + MAXIMUM_SESSION_DURATION_SECONDS,
            );
        });
    });
});

describe('toPositiveNumber', () => {
    it('accepts positive numbers and numeric strings', () => {
        expect(toPositiveNumber(3600)).toBe(3600);
        expect(toPositiveNumber('3600')).toBe(3600);
        expect(toPositiveNumber(0.5)).toBe(0.5);
    });

    it('rejects anything that is not a usable positive number', () => {
        for (const value of [
            0,
            '0',
            -1,
            '-1',
            '',
            '   ',
            'abc',
            Number.NaN,
            Number.POSITIVE_INFINITY,
            null,
            undefined,
            {},
            [],
        ]) {
            expect(toPositiveNumber(value)).toBeUndefined();
        }
    });
});
