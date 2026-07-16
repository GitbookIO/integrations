import Conf from 'conf';

import { GITBOOK_DEFAULT_ENDPOINT } from '@gitbook/api';
import { DEFAULT_ENV, getEnvironment } from './environments';

/**
 * OAuth session details, stored when the user authenticated through the browser
 * (`gitbook login`). Kept independently from a personal API token so both can coexist.
 */
export interface OAuthSession {
    /**
     * OAuth authorization server issuer the tokens were minted by.
     */
    issuer: string;
    /**
     * Dynamically-registered OAuth client id used to obtain and refresh tokens.
     */
    clientId: string;
    /**
     * Current access token used to authenticate API requests.
     */
    accessToken?: string;
    /**
     * Refresh token used to mint new access tokens once the current one expires.
     */
    refreshToken?: string;
    /**
     * Epoch milliseconds at which the current access token expires.
     */
    expiresAt?: number;
    /**
     * Space-delimited scopes granted to the token.
     */
    scope?: string;
}

/**
 * Authentication configuration for a single environment.
 *
 * A personal API token and a browser (OAuth) session can both be stored at once: the token is
 * required for publishing integrations, while the OAuth session covers the rest of the API.
 */
export interface EnvAuthConfig {
    /**
     * API endpoint to authenticate to.
     */
    endpoint: string;
    /**
     * Personal API token to authenticate with, if configured.
     */
    token?: string;
    /**
     * Browser (OAuth) session, if the user signed in through the browser.
     */
    oauth?: OAuthSession;
}

interface CliConfig {
    /**
     * Endpoint for the API.
     * @deprecated Use `envs.default.endpoint` instead.
     */
    endpoint: string;
    /**
     * Token to use for authentication.
     * @deprecated Use `envs.default.token` instead.
     */
    token?: string;

    /**
     * Environment configured.
     */
    envs: Record<string, EnvAuthConfig>;
}

/**
 * Config preserved in the user's home directory.
 */
export const config = new Conf<CliConfig>({
    projectName: 'gitbook',
    defaults: {
        endpoint: GITBOOK_DEFAULT_ENDPOINT,
        token: undefined,
        envs: {
            default: {
                endpoint: GITBOOK_DEFAULT_ENDPOINT,
                token: undefined,
            },
        },
    },
});

/**
 * Save the authentication to use for the given environment.
 */
export function saveAuthConfig(authConfig: EnvAuthConfig): void {
    const env = getEnvironment();
    config.set(`envs.${env}`, authConfig);
}

/**
 * Remove all stored authentication (token and OAuth session) for the given environment.
 */
export function clearAuthConfig(): void {
    const env = getEnvironment();
    config.set(`envs.${env}`, {
        endpoint: getStoredEnvConfig().endpoint,
    });
}

/**
 * Get the authentication stored on disk for the current environment, ignoring any
 * `GITBOOK_TOKEN` environment override. Used when merging in a new credential so the other
 * one is preserved.
 */
export function getStoredEnvConfig(): EnvAuthConfig {
    const env = getEnvironment();
    const envConfig = config.get('envs')[env];
    if (envConfig) {
        return envConfig;
    }
    if (env !== DEFAULT_ENV) {
        throw new Error(`Environment "${env}" not found`);
    }

    const deprecatedEndpoint = config.get('endpoint');
    const deprecatedToken = config.get('token');
    if (deprecatedEndpoint && deprecatedToken) {
        return {
            endpoint: deprecatedEndpoint,
            token: deprecatedToken,
        };
    }

    return {
        endpoint: GITBOOK_DEFAULT_ENDPOINT,
    };
}

/**
 * Get the authentication to use for the given environment.
 *
 * A `GITBOOK_TOKEN` environment variable takes precedence and is treated as a personal token
 * (any stored OAuth session is ignored in that case, so CI overrides stay explicit).
 */
export function getAuthConfig(): EnvAuthConfig {
    if (process.env.GITBOOK_TOKEN) {
        return {
            endpoint: process.env.GITBOOK_ENDPOINT || GITBOOK_DEFAULT_ENDPOINT,
            token: process.env.GITBOOK_TOKEN,
        };
    }

    return getStoredEnvConfig();
}
