import { Logger } from '@gitbook/runtime';

import { OAuthResponse, SentryIssue, SentryRuntimeContext } from './types';
import { extractCredentials } from './utils';

export const logger = Logger('integration:sentry');

export enum AuthorizationGrant {
    AuthorizationCode = 'authorization_code',
    RefreshToken = 'refresh_token',
}

export type CredentialsParam = {
    clientId: string;
    clientSecret: string;
    installationId: string;
    code?: string;
    refreshToken?: string;
    grantType?: AuthorizationGrant;
    orgSlug?: string;
};

export async function fetchCredentials({
    clientId,
    clientSecret,
    code,
    refreshToken,
    grantType,
    installationId,
}: CredentialsParam) {
    const payload = {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: grantType,
        ...(grantType === AuthorizationGrant.AuthorizationCode
            ? { code }
            : { refresh_token: refreshToken }),
    };

    const authorizationURL = `https://sentry.io/api/0/sentry-app-installations/${installationId}/authorizations/`;

    const response = await fetch(authorizationURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Failed to exchange code for ${grantType}`);
    }

    const credentials = await response.json<OAuthResponse>();

    return credentials;
}

async function refreshCredentials({
    clientId,
    clientSecret,
    refreshToken,
    installationId,
    orgSlug,
}: CredentialsParam) {
    // If the token is expired, we'll need to refresh it...
    logger.info(`Token for '${orgSlug}' has expired. Refreshing...`);

    const credentials = await fetchCredentials({
        clientId,
        clientSecret,
        refreshToken,
        grantType: AuthorizationGrant.RefreshToken,
        installationId,
    });

    // Store the token information for future requests
    logger.info(`Token for '${orgSlug}' has been refreshed.`);

    // Return the newly refreshed credentials
    return credentials;
}

/**
 * Fetches an organization's Sentry auth token, refreshing it if necessary.
 */
async function getToken(context: SentryRuntimeContext) {
    const { api, environment } = context;
    const { CLIENT_ID: clientId, CLIENT_SECRET: clientSecret } = environment.secrets;
    const {
        oauth_credentials: { token: currentToken, refreshToken, expiresAt },
    } = environment.installation.configuration;

    const [sentryInstallationId, sentryOrgSlug] = environment.installation.externalIds;

    // If the token is not expired, no need to refresh it
    if (new Date(expiresAt).getTime() > Date.now()) {
        return currentToken;
    }

    const tokens = await refreshCredentials({
        clientId,
        clientSecret,
        refreshToken,
        installationId: sentryInstallationId,
        orgSlug: sentryOrgSlug,
    });

    const credentials = extractCredentials(tokens);

    await api.integrations.updateIntegrationInstallation(
        environment.integration.name,
        environment.installation.id,
        {
            configuration: {
                ...credentials,
            },
            externalIds: [sentryInstallationId, sentryOrgSlug],
        }
    );

    return tokens.token;
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
