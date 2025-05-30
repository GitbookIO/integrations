import { GitBookAPI } from '@gitbook/api';

import { name, version } from '../package.json';
import { getAuthConfig, saveAuthConfig } from './config';
import { DEFAULT_ENV, getEnvironment } from './environments';

const userAgent = `${name}/${version}`;

/**
 * Get an authenticated API client.
 */
export async function getAPIClient(requireAuth: boolean = true): Promise<GitBookAPI> {
    const authConfig = getAuthConfig();
    if (!authConfig.token && requireAuth) {
        throw new Error(
            'You must be authenticated before you can run this command.\n  Run "gitbook auth" to authenticate.',
        );
    }

    return new GitBookAPI({
        userAgent,
        endpoint: authConfig.endpoint,
        authToken: authConfig.token,
    });
}

/**
 * Authenticate with an API token.
 */
export async function authenticate({
    endpoint,
    authToken,
}: {
    /**
     * API endpoint to authenticate to.
     */
    endpoint: string;
    /**
     * API token to authenticate with.
     */
    authToken: string;
}): Promise<void> {
    console.log(`Authenticating with ${endpoint}...`);

    const api = new GitBookAPI({
        userAgent,
        endpoint,
        authToken,
    });

    const { data: user } = await api.user.getAuthenticatedUser();

    saveAuthConfig({
        endpoint,
        token: authToken,
    });

    console.log(`You are now authenticated as ${user.displayName}.`);
}

/**
 * Print authentication infos
 */
export async function whoami(): Promise<void> {
    const env = getEnvironment();
    const api = await getAPIClient();

    if (api.authToken) {
        const { data: user } = await api.user.getAuthenticatedUser();

        console.log(`Authenticated as ${user.displayName}`);
        console.log(`ID: ${user.id}`);
        console.log(`Email: ${user.email}`);
        console.log(`API: ${api.endpoint}`);
        if (env !== DEFAULT_ENV) {
            console.log(`Environment: ${env}`);
        }
    } else {
        console.log(`No authentication configured.`);
    }
}
