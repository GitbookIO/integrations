import { GitBookAPI } from '@gitbook/api';

import { version } from '../package.json';
import { getAuthConfig, saveAuthConfig } from './config';
import { DEFAULT_ENV, getEnvironment } from './environments';

const BASE_USER_AGENT = `GitBook-CLI/${version}`;

/**
 * Build the User-Agent sent to the API.
 *
 * `command` is the dotted command path the user invoked (e.g.
 * "spaces.change-requests.content.update"). Including it lets requests be
 * attributed to a specific command in the API logs / the GCP per-endpoint
 * dashboard, without per-request plumbing. Omitted → just the surface token.
 */
function buildUserAgent(command?: string): string {
    return command ? `${BASE_USER_AGENT} (${command})` : BASE_USER_AGENT;
}

/**
 * Get an authenticated API client. `command` is the invoked command path, folded
 * into the User-Agent for usage attribution (see buildUserAgent).
 */
export async function getAPIClient(
    requireAuth: boolean = true,
    command?: string,
): Promise<GitBookAPI> {
    const authConfig = getAuthConfig();
    if (!authConfig.token && requireAuth) {
        throw new Error(
            `You must be authenticated before you can run this command.\n  Run "${getAuthCommand()}" to authenticate.`,
        );
    }

    return new GitBookAPI({
        userAgent: buildUserAgent(command),
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
        userAgent: buildUserAgent('auth'),
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
    const api = await getAPIClient(true, 'whoami');

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
        console.log(`No authentication configured. Run "${getAuthCommand()}" to authenticate.`);
    }
}

function getAuthCommand() {
    const env = getEnvironment();
    return env === DEFAULT_ENV ? 'gitbook auth' : `gitbook auth --env ${env}`;
}
