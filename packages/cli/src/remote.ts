import { GitBookAPI } from '@gitbook/api';

import { getConfigValue, setConfigValue } from './config';

/**
 * Get an authenticated API client.
 */
export async function getAPIClient(requireAuth: boolean = true): Promise<GitBookAPI> {
    const authToken = getAuthToken();

    if (!authToken && requireAuth) {
        throw new Error(
            'You must be authenticated before you can run this command.\n  Run "gitbook auth" to authenticate.'
        );
    }

    return new GitBookAPI({
        endpoint: getConfigValue('endpoint'),
        authToken,
    });
}

/**
 * Authenticate with an API token.
 */
export async function authenticate(endpoint: string, authToken: string): Promise<void> {
    console.log(`Authenticating with ${endpoint}...`);

    const api = new GitBookAPI({
        endpoint,
        authToken,
    });

    const { data: user } = await api.user.getAuthenticatedUser();

    setConfigValue('endpoint', endpoint);
    setConfigValue('token', authToken);

    console.log(`You are now authenticated as ${user.displayName}.`);
}

/**
 * Print authentication infos
 */
export async function whoami(): Promise<void> {
    const endpoint = getConfigValue('endpoint');
    const authToken = getConfigValue('token');

    if (authToken) {
        const api = await getAPIClient();
        const { data: user } = await api.user.getAuthenticatedUser();

        console.log(`Authenticated as ${user.displayName} on ${endpoint}`);
    } else {
        console.log(`No authentication configured.`);
    }
}

/**
 * Lookup the auth token to use.
 */
function getAuthToken(): string | null {
    // First lookup the token in the environment.
    if (process.env.GITBOOK_TOKEN) {
        return process.env.GITBOOK_TOKEN;
    }

    const token = getConfigValue('token');

    return token;
}
