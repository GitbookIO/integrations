import { ExposableError, Logger } from '@gitbook/runtime';

import { SentryIssue, SentryRuntimeContext } from './types';

export const logger = Logger('integration:sentry');

/**
 * Fetch issue data from Sentry
 */
export async function getIssue(
    issueId: string,
    context: SentryRuntimeContext,
): Promise<SentryIssue> {
    const token = context.environment.installation?.configuration.auth_token;
    if (!token) {
        throw new ExposableError('Sentry integration is not configured');
    }

    const response = await fetch(`https://sentry.io/api/0/issues/${issueId}/`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw Error('Failed to fetch Sentry issue');
    }

    const data = (await response.json()) as SentryIssue;

    return data;
}
