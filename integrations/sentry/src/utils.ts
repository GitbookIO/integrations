import { SentryCredentials, SentryOAuthCredentials } from './types';

/**
 * Extract the Sentry issue from a url
 */
export function extractIssueIdFromURL(input: string): string | undefined {
    const url = new URL(input);
    if (url.hostname !== 'sentry.io') {
        return;
    }

    const parts = url.pathname.split('/');
    return parts[4];
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function extractCredentials(response: SentryCredentials): SentryOAuthCredentials {
    const { token, refreshToken, expiresAt, dateCreated } = response;

    return {
        oauth_credentials: {
            token,
            refreshToken,
            expiresAt,
            dateCreated,
        },
    };
}
