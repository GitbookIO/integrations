import { GitBookAPI } from '@gitbook/api';

import { version } from '../package.json';
import { getAuthConfig, saveAuthConfig } from './config';
import { DEFAULT_ENV, getEnvironment } from './environments';
import { type OutputOptions, printResult } from './output';

const USER_AGENT = `GitBook-CLI/${version}`;

/**
 * Get an authenticated API client.
 */
export async function getAPIClient(requireAuth: boolean = true): Promise<GitBookAPI> {
    const authConfig = getAuthConfig();
    if (!authConfig.token && requireAuth) {
        throw new Error(
            `You must be authenticated before you can run this command.\n  Run "${getAuthCommand()}" to authenticate.`,
        );
    }

    return new GitBookAPI({
        userAgent: USER_AGENT,
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
        userAgent: USER_AGENT,
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
export async function whoami(options: OutputOptions = {}): Promise<void> {
    const env = getEnvironment();
    const api = await getAPIClient(true);
    // Only the explicit --json/--yaml flags switch to machine output; unlike the
    // generated commands we don't auto-switch when piped, so the human form (and
    // the not-authenticated guidance) stays the interactive default.
    const machine = options.json || options.yaml;

    if (!api.authToken) {
        if (machine) {
            printResult({ authenticated: false }, options);
        } else {
            console.log(`No authentication configured. Run "${getAuthCommand()}" to authenticate.`);
        }
        return;
    }

    const { data: user } = await api.user.getAuthenticatedUser();

    if (machine) {
        // Emit the user object itself so scripts can read e.g. `--json | jq -r .id`
        // for their own user ID (the reason this command needed machine output).
        printResult(user, options);
        return;
    }

    console.log(`Authenticated as ${user.displayName}`);
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`API: ${api.endpoint}`);
    if (env !== DEFAULT_ENV) {
        console.log(`Environment: ${env}`);
    }
}

function getAuthCommand() {
    const env = getEnvironment();
    return env === DEFAULT_ENV ? 'gitbook auth' : `gitbook auth --env ${env}`;
}
