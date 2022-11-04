import { Logger } from '@gitbook/runtime';

import { SentryIssue, SentryRuntimeContext } from './types';

export const logger = Logger('integration:sentry');
/**
 * Fetches an API auth token
 */
async function getToken(context: SentryRuntimeContext) {
    const { auth_token } = context.environment.installation.configuration;

    return auth_token;
}

/**
 * Fetch issue data from Sentry
 */
export async function getIssue(
    issueId: string,
    context: SentryRuntimeContext
): Promise<SentryIssue> {
    const token = await getToken(context);

    const response = await fetch(`https://sentry.io/api/0/issues/${issueId}/`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        throw Error('Failed to fetch Sentry issue');
    }

    const data = (await response.json()) as SentryIssue;

    return data;
}
