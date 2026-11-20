import { IntegrationError, Logger } from '@gitbook/runtime';

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
        throw new IntegrationError('authentication_required');
    }

    const response = await fetch(`https://sentry.io/api/0/issues/${issueId}/`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new IntegrationError('authentication_required');
        }
        if (response.status === 403) {
            throw new IntegrationError('configuration_required');
        }
        if (response.status === 404) {
            throw new IntegrationError('invalid_input');
        }
        throw Error('Failed to fetch Sentry issue');
    }

    const data = (await response.json()) as SentryIssue;

    return data;
}
