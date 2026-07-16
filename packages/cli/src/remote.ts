import { GitBookAPI } from '@gitbook/api';

import { version } from '../package.json';
import { clearAuthConfig, getAuthConfig, getStoredEnvConfig, saveAuthConfig } from './config';
import { DEFAULT_ENV, getEnvironment } from './environments';
import { authenticateWithBrowser, refreshOAuthSessionIfNeeded } from './oauth';
import { type OutputOptions, printResult } from './output';

const USER_AGENT = `GitBook-CLI/${version}`;

interface GetAPIClientOptions {
    /**
     * Only use a personal API token, never the OAuth session. Used by operations that aren't
     * available to OAuth tokens (e.g. publishing integrations).
     */
    personalTokenOnly?: boolean;
}

/**
 * Get an authenticated API client.
 *
 * When the user has a browser (OAuth) session it is used (and its access token refreshed as
 * needed); a personal API token is used otherwise, or when `personalTokenOnly` is set.
 */
export async function getAPIClient(
    requireAuth: boolean = true,
    options: GetAPIClientOptions = {},
): Promise<GitBookAPI> {
    const { endpoint, token } = await resolveAuth(options.personalTokenOnly ?? false);
    if (!token && requireAuth) {
        throw new Error(
            `You must be authenticated before you can run this command.\n  Run "${getLoginCommand()}" to sign in with your browser, or "${getAuthCommand()}" to use an API token.`,
        );
    }

    return new GitBookAPI({
        userAgent: USER_AGENT,
        endpoint,
        authToken: token,
    });
}

/**
 * Resolve the access token to use, preferring the OAuth session (refreshing and persisting it
 * when needed) and falling back to a personal API token.
 */
async function resolveAuth(
    personalTokenOnly: boolean,
): Promise<{ endpoint: string; token?: string }> {
    const authConfig = getAuthConfig();

    if (!personalTokenOnly && authConfig.oauth) {
        const refreshed = await refreshOAuthSessionIfNeeded(authConfig.oauth);
        if (refreshed) {
            // Persist a rotated access/refresh token so later commands reuse it.
            if (refreshed.accessToken !== authConfig.oauth.accessToken) {
                saveAuthConfig({ ...authConfig, oauth: refreshed });
            }
            return { endpoint: authConfig.endpoint, token: refreshed.accessToken };
        }

        // The OAuth session expired and couldn't be refreshed. Fall back to a personal token
        // if one is configured, otherwise prompt the user to sign in again.
        if (authConfig.token) {
            return { endpoint: authConfig.endpoint, token: authConfig.token };
        }
        throw new Error(`Your session has expired. Run "${getLoginCommand()}" to sign in again.`);
    }

    return { endpoint: authConfig.endpoint, token: authConfig.token };
}

/**
 * Authenticate with an API token, preserving any existing browser (OAuth) session.
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
        ...getStoredEnvConfig(),
        endpoint,
        token: authToken,
    });

    console.log(`You are now authenticated as ${user.displayName}.`);
}

/**
 * Authenticate through the browser using the OAuth authorization code flow, preserving any
 * existing personal API token.
 */
export async function login({ endpoint }: { endpoint: string }): Promise<void> {
    console.log(`Opening your browser to sign in with ${endpoint}...`);

    const oauth = await authenticateWithBrowser({
        endpoint,
        onAuthorizationURL: (url) => {
            console.log(`\nIf your browser did not open, visit this URL to continue:\n  ${url}\n`);
        },
    });

    const api = new GitBookAPI({
        userAgent: USER_AGENT,
        endpoint,
        authToken: oauth.accessToken,
    });

    const { data: user } = await api.user.getAuthenticatedUser();

    saveAuthConfig({
        ...getStoredEnvConfig(),
        endpoint,
        oauth,
    });

    console.log(`\nYou are now authenticated as ${user.displayName}.`);
}

/**
 * Remove the stored authentication (token and OAuth session) for the current environment.
 */
export async function logout(): Promise<void> {
    clearAuthConfig();
    console.log('You have been logged out.');
}

/**
 * Print authentication infos
 */
export async function whoami(options: OutputOptions = {}): Promise<void> {
    const env = getEnvironment();
    const authConfig = getAuthConfig();
    const api = await getAPIClient(false);
    // Only the explicit --json/--yaml flags switch to machine output; unlike the
    // generated commands we don't auto-switch when piped, so the human form (and
    // the not-authenticated guidance) stays the interactive default.
    const machine = options.json || options.yaml;

    if (!api.authToken) {
        if (machine) {
            printResult({ authenticated: false }, options);
        } else {
            console.log(
                `No authentication configured. Run "${getLoginCommand()}" to sign in with your browser, or "${getAuthCommand()}" to use an API token.`,
            );
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
    console.log(`Method: ${authConfig.oauth ? 'browser (OAuth)' : 'API token'}`);
    if (authConfig.oauth && authConfig.token) {
        console.log('A personal API token is also configured (used for publishing integrations).');
    }
    if (env !== DEFAULT_ENV) {
        console.log(`Environment: ${env}`);
    }
}

/**
 * Throw a helpful error if the current session can't publish integrations.
 *
 * Publishing/unpublishing integrations is not an OAuth-exposed API operation, so a browser
 * (OAuth) session can't perform it — a personal API token is required.
 */
export function assertCanPublishIntegrations(): void {
    const authConfig = getAuthConfig();
    if (!authConfig.token && authConfig.oauth) {
        throw new Error(
            'Publishing integrations requires a personal API token, but you are signed in through the browser (OAuth).\n' +
                '  Create a token at https://app.gitbook.com/account/developer and run:\n' +
                `    ${getAuthCommand()}`,
        );
    }
}

function getAuthCommand() {
    const env = getEnvironment();
    return env === DEFAULT_ENV
        ? 'gitbook auth --token <token>'
        : `gitbook auth --token <token> --env ${env}`;
}

function getLoginCommand() {
    const env = getEnvironment();
    return env === DEFAULT_ENV ? 'gitbook login' : `gitbook login --env ${env}`;
}
